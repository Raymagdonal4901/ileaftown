import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { properties as defaultProperties } from '../data/properties';
import defaultTranslations from '../data/translations';

const CMSContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const CMSProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [translations, setTranslations] = useState(defaultTranslations);
  const [loading, setLoading] = useState(true);

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Properties
      const propsRes = await axios.get(`${API_URL}/properties`);
      if (propsRes.data.length === 0) {
        // If empty, seed with defaults for the first time
        for (const prop of defaultProperties) {
          const { id, ...cleanProp } = prop; // Remove frontend 'id' for backend 'propertyId'
          await axios.post(`${API_URL}/properties`, { ...cleanProp, propertyId: prop.id });
        }
        const reProps = await axios.get(`${API_URL}/properties`);
        setProperties(reProps.data);
      } else {
        // SILENT CORRECTION: If images are the old broken ones, update them automatically
        const currentData = propsRes.data;
        let needsUpdate = false;
        
        for (const dbProp of currentData) {
          const localMatch = defaultProperties.find(p => p.id === dbProp.propertyId);
          if (localMatch && dbProp.coverImage !== localMatch.coverImage && (dbProp.coverImage.includes('unsplash') || dbProp.coverImage === '')) {
            // Force update to the new reliable URL
            await axios.put(`${API_URL}/properties/${dbProp.propertyId}`, { coverImage: localMatch.coverImage });
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          const refreshed = await axios.get(`${API_URL}/properties`);
          setProperties(refreshed.data);
        } else {
          setProperties(currentData);
        }
      }

      // 2. Fetch Translations
      const transRes = await axios.get(`${API_URL}/translations`);
      if (transRes.data.length === 0) {
        // Seed translations from file
        const seedData = [];
        // Helper to flatten nested translation object into keys for MongoDB
        const flatten = (obj, prefix = '') => {
          Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (obj[key].th && obj[key].en) {
              seedData.push({ key: fullKey, th: obj[key].th, en: obj[key].en });
            } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              flatten(obj[key], fullKey);
            }
          });
        };
        flatten(defaultTranslations);
        await axios.post(`${API_URL}/translations`, seedData);
        
        // Re-construct the translations object
        const reTransRes = await axios.get(`${API_URL}/translations`);
        updateTranslationsState(reTransRes.data);
      } else {
        updateTranslationsState(transRes.data);
      }
    } catch (error) {
      console.error('Error fetching CMS data:', error);
      // Fallback to static data on error
      setProperties(defaultProperties);
    } finally {
      setLoading(false);
    }
  };

  const updateTranslationsState = (dbTranslations) => {
    const newTrans = JSON.parse(JSON.stringify(defaultTranslations));
    dbTranslations.forEach(item => {
      const keys = item.key.split('.');
      let current = newTrans;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = { th: item.th, en: item.en };
    });
    setTranslations(newTrans);
    
    // CLIENT-SIDE SILENT CORRECTION: Ensure 'iLeaf Town' -> 'ไอลีฟทาวน์' in all TH strings
    const fixThaiNames = (obj) => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key].th && typeof obj[key].th === 'string' && obj[key].th.includes('iLeaf Town')) {
            obj[key].th = obj[key].th.replace(/iLeaf Town/g, 'ไอลีฟทาวน์');
          } else if (Array.isArray(obj[key].th)) {
            obj[key].th = obj[key].th.map(s => typeof s === 'string' ? s.replace(/iLeaf Town/g, 'ไอลีฟทาวน์') : s);
          } else {
            fixThaiNames(obj[key]);
          }
        }
      });
    };
    fixThaiNames(newTrans);
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  const updateProperty = async (id, data) => {
    try {
      await axios.put(`${API_URL}/properties/${id}`, data);
      await fetchCMSData(); // Refresh
    } catch (e) { console.error(e); }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${API_URL}/properties/${id}`);
      await fetchCMSData();
    } catch (e) { console.error(e); }
  };

  const addProperty = async (data) => {
    try {
      await axios.post(`${API_URL}/properties`, data);
      await fetchCMSData();
    } catch (e) { console.error(e); }
  };

  const updateAllTranslations = async (flattenedData) => {
    try {
      await axios.post(`${API_URL}/translations`, flattenedData);
      await fetchCMSData();
    } catch (e) { console.error(e); }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_URL}/upload`, formData);
    return res.data.url;
  };

  return (
    <CMSContext.Provider value={{ 
      properties, 
      translations, 
      loading, 
      updateProperty, 
      deleteProperty, 
      addProperty,
      updateAllTranslations,
      uploadFile
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
