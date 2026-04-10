import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, Globe, Home, Image as ImageIcon, 
  ArrowLeft, CheckCircle, Upload, Loader2, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../contexts/CMSContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    properties, translations, loading, 
    addProperty, updateProperty, deleteProperty, 
    updateAllTranslations, uploadFile, uploadMultipleFiles 
  } = useCMS();

  const [activeTab, setActiveTab] = useState('properties');
  const [editingProperty, setEditingProperty] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Property Form State
  const initialFormState = {
    propertyId: '',
    houseNumber: '',
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    kitchens: '',
    coverImage: '',
    videoUrl: '',
    gallery: [],
    highlights: ['']
  };
  const [formState, setFormState] = useState(initialFormState);

  // Translation Editor State (Flattened)
  const [flatTranslations, setFlatTranslations] = useState([]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-gold w-12 h-12" />
      </div>
    );
  }

  // Handle Property Form Changes
  const handlePropChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formState.highlights];
    newHighlights[index] = value;
    setFormState(prev => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlightField = () => {
    setFormState(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlightField = (index) => {
    setFormState(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = async (file) => {
    setIsSaving(true);
    try {
      const url = await uploadFile(file);
      setFormState(prev => ({ ...prev, coverImage: url }));
    } catch (e) {
      alert('อัปโหลดรูปภาพล้มเหลว');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUpload = async (file) => {
    setIsSaving(true);
    try {
      const url = await uploadFile(file);
      setFormState(prev => ({ ...prev, videoUrl: url }));
    } catch (e) {
      alert('อัปโหลดวีดีโอล้มเหลว');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGalleryUpload = async (files) => {
    if (files.length === 0) return;
    setIsSaving(true);
    try {
      const urls = await uploadMultipleFiles(files);
      setFormState(prev => ({ 
        ...prev, 
        gallery: [...(prev.gallery || []), ...urls] 
      }));
    } catch (e) {
      alert('อัปโหลดรูปภาพแกลเลอรี่ล้มเหลว');
    } finally {
      setIsSaving(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormState(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const saveProperty = async () => {
    setIsSaving(true);
    if (isAdding) {
      const newId = `residency-${properties.length + 1}-${Date.now()}`;
      await addProperty({ ...formState, propertyId: newId });
    } else {
      await updateProperty(formState.propertyId, formState);
    }
    cancelEdit();
    setIsSaving(false);
  };

  const cancelEdit = () => {
    setEditingProperty(null);
    setIsAdding(false);
    setFormState(initialFormState);
  };

  const startEdit = (prop) => {
    setEditingProperty(prop);
    setFormState({ ...prop });
    setIsAdding(false);
  };

  // Translations Logic
  const initTranslationEdit = () => {
    const flattened = [];
    const flatten = (obj, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (obj[key].th && obj[key].en) {
          flattened.push({ key: fullKey, th: obj[key].th, en: obj[key].en });
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          flatten(obj[key], fullKey);
        }
      });
    };
    flatten(translations);
    setFlatTranslations(flattened);
  };

  const handleTranslationChange = (index, field, value) => {
    const updated = [...flatTranslations];
    updated[index][field] = value;
    setFlatTranslations(updated);
  };

  const saveTranslations = async () => {
    setIsSaving(true);
    await updateAllTranslations(flatTranslations);
    setIsSaving(false);
    alert('บันทึกข้อมูลหน้าเว็บสำเร็จ!');
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-white font-sans">
      {/* Admin Nav */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-charcoal-800 z-50 h-20 flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2">
            <ArrowLeft size={18} />
            <span className="text-sm uppercase tracking-widest hidden sm:inline">กลับหน้าหลัก</span>
          </button>
          <div className="h-6 w-px bg-charcoal-800"></div>
          <h1 className="font-display text-xl sm:text-2xl text-white tracking-wide">
            ระบบ<span className="text-gold">หลังบ้าน</span>
          </h1>
        </div>

        <div className="flex gap-1 bg-charcoal-900 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${activeTab === 'properties' ? 'bg-gold text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
          >
            <Home size={16} /> จัดการบ้าน
          </button>
          <button 
            onClick={() => { setActiveTab('translations'); initTranslationEdit(); }}
            className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${activeTab === 'translations' ? 'bg-gold text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
          >
            <Globe size={16} /> เนื้อหาเว็บ
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        
        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && !editingProperty && !isAdding && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-display text-white italic">รายการทรัพย์สิน</h2>
                <p className="text-gray-400 text-sm mt-1">จัดการ เพิ่ม ลบ หรือแก้ไขรายละเอียดบ้านในฐานข้อมูล MongoDB Atlas</p>
              </div>
              <div className="flex gap-2 bg-charcoal-900 px-4 py-2 text-gold text-[10px] items-center border border-gold/20 italic">
                <Loader2 size={12} className="animate-spin" />
                โหมดแก้ไขข้อมูลเท่านั้น (ไม่สามารถเพิ่มรายการใหม่ได้)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(prop => (
                <div key={prop.propertyId || prop.id} className="bg-charcoal-900 rounded-none border border-charcoal-800 overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={prop.coverImage} 
                      referrerPolicy="no-referrer" 
                      onError={(e) => { e.target.onError = null; e.target.src = 'https://placehold.co/1200x800/1a1a1a/D4AF37?text=No+Image' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt="" 
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute top-4 left-4 bg-gold text-black text-[10px] font-bold uppercase py-1 px-2 tracking-widest">
                      {prop.houseNumber}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl mb-4 truncate text-white">{prop.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gold text-sm font-light">{prop.price}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => startEdit(prop)}
                          className="p-2 bg-charcoal-800 hover:bg-gold hover:text-black text-gray-400 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => { if(confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) deleteProperty(prop.propertyId) }}
                          className="p-2 bg-charcoal-800 hover:bg-red-900/40 text-gray-400 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROPERTY EDIT/ADD FORM */}
        {(isAdding || editingProperty) && (
          <div className="bg-charcoal-900 p-8 sm:p-12 border border-charcoal-800 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-display italic">{isAdding ? 'เพิ่มข้อมูลบ้านใหม่' : 'แก้ไขข้อมูลบ้าน'}</h2>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gold"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold italic">ชื่อหัวข้อบ้าน (Title)</label>
                  <input 
                    name="title" value={formState.title} onChange={handlePropChange}
                    className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold italic">รายละเอียดบ้าน (Description)</label>
                  <textarea 
                    name="description" value={formState.description} onChange={handlePropChange} rows={4}
                    className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none resize-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold italic">เลขที่บ้าน / แปลง (House Number)</label>
                    <input name="houseNumber" value={formState.houseNumber} onChange={handlePropChange} className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold italic">ราคาลดพิเศษ (Discount Price)</label>
                    <input name="price" value={formState.price} onChange={handlePropChange} className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" placeholder="เช่น 5.9 ล้านบาท" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold italic">ราคาเดิม (Original Price - สำหรับขีดฆ่า)</label>
                  <input name="originalPrice" value={formState.originalPrice} onChange={handlePropChange} className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" placeholder="เช่น 6.5 ล้านบาท (เว้นว่างไว้หากไม่มีส่วนลด)" />
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">พื้นที่ (ตร.ม.)</label>
                    <input type="number" name="area" value={formState.area} onChange={handlePropChange} className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">ห้องนอน</label>
                    <input type="number" name="bedrooms" value={formState.bedrooms} onChange={handlePropChange} className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">ห้องน้ำ</label>
                    <input type="number" name="bathrooms" value={formState.bathrooms} onChange={handlePropChange} className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">ห้องครัว</label>
                    <input type="number" name="kitchens" value={formState.kitchens} onChange={handlePropChange} className="w-full bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" />
                  </div>
                </div>
              </div>

              {/* Right Column: Image & Highlights */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold italic">รูปภาพหน้าปก (Cover Image)</label>
                  {formState.coverImage && (
                    <div className="relative h-48 w-full mb-4 border border-charcoal-800 bg-black">
                      <img src={formState.coverImage} className="w-full h-full object-contain" alt="" />
                      <button 
                        onClick={() => setFormState(prev => ({ ...prev, coverImage: '' }))}
                        className="absolute top-2 right-2 bg-red-600 p-1 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <input name="coverImage" value={formState.coverImage} onChange={handlePropChange} placeholder="วางลิงก์รูปภาพ หรืออัปโหลด" className="flex-grow bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" />
                    <label className="cursor-pointer bg-charcoal-800 hover:bg-gold hover:text-black py-3 px-4 transition-all">
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">*รองรับการอัปโหลดไฟล์จริงจากเครื่อง และจะถูกจัดเก็บในระบบ</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs uppercase tracking-widest text-gold font-bold italic">อัลบั้มรูปภาพ (Gallery Images)</label>
                    <label className="cursor-pointer text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold flex items-center gap-1 font-bold">
                      {isSaving ? <Loader2 className="animate-spin" size={12} /> : <Plus size={12} />}
                      เพิ่มรูปในอัลบั้ม
                      <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleGalleryUpload(e.target.files)} />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto p-2 bg-black/20 border border-charcoal-800 custom-scrollbar">
                    {formState.gallery && formState.gallery.map((url, idx) => (
                      <div key={idx} className="relative aspect-square border border-charcoal-700 group">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button 
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute -top-1 -right-1 bg-red-600 p-0.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    {(!formState.gallery || formState.gallery.length === 0) && (
                      <div className="col-span-full py-8 text-center text-[10px] text-gray-600 uppercase tracking-widest">
                        ยังไม่มีรูปในอัลบั้ม
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 italic">*เลือกหลายไฟล์ได้พร้อมกัน รูปภาพจะถูกส่งไปเก็บที่ Cloudinary</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold italic">วีดีโอตัวอย่าง (Property Video)</label>
                  {formState.videoUrl && (
                    <div className="relative h-48 w-full mb-4 border border-charcoal-800 bg-black flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="animate-spin text-gold mx-auto mb-2" size={18} />
                        <p className="text-[10px] text-gray-500 truncate max-w-xs">{formState.videoUrl.split('/').pop()}</p>
                      </div>
                      <button 
                        onClick={() => setFormState(prev => ({ ...prev, videoUrl: '' }))}
                        className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <input name="videoUrl" value={formState.videoUrl} onChange={handlePropChange} placeholder="วางลิงก์วีดีโอ หรืออัปโหลด" className="flex-grow bg-charcoal-950 border border-charcoal-800 p-3 text-sm focus:border-gold outline-none" />
                    <label className="cursor-pointer bg-charcoal-800 hover:bg-gold hover:text-black py-3 px-4 transition-all">
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      <input type="file" className="hidden" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files[0])} />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">*รองรับไฟล์ MP4, WebM (แสดงผลในส่วน Video Tour)</p>
                </div>

                <div>
                    <label className="text-xs uppercase tracking-widest text-gold font-bold italic">จุดเด่นของบ้าน (Highlights)</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {formState.highlights.map((h, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input value={h} onChange={(e) => handleHighlightChange(idx, e.target.value)} className="flex-grow bg-charcoal-950 border border-charcoal-800 p-2 text-sm focus:border-gold outline-none font-sans" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-charcoal-800 flex justify-end gap-4">
              <button 
                onClick={cancelEdit}
                className="px-8 py-3 text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all font-semibold"
              >
                ยกเลิก
              </button>
              <button 
                onClick={saveProperty} disabled={isSaving}
                className="bg-gold text-black px-12 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-brass transition-all flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isAdding ? 'สร้างข้อมูลใหม่' : 'บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          </div>
        )}

        {/* TRANSLATIONS TAB */}
        {activeTab === 'translations' && (
          <div className="bg-charcoal-900 border border-charcoal-800">
            <div className="p-8 border-b border-charcoal-800 flex justify-between items-center sticky top-20 bg-charcoal-900/90 backdrop-blur-sm z-20">
              <div>
                <h2 className="text-3xl font-display italic">ข้อความบนหน้าเว็บ</h2>
                <p className="text-gray-400 text-sm mt-1">แก้ไขคำพาดหัว ป้ายประกาศ และข้อความในปุ่มต่างๆ ทั้งเวอร์ชันภาษาไทยและอังกฤษ</p>
              </div>
              <button 
                onClick={saveTranslations} disabled={isSaving}
                className="bg-gold text-black font-bold px-10 py-3 rounded-none hover:bg-brass transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} บันทึกทั้งหมด
              </button>
            </div>

            <div className="p-8 space-y-12">
              <div className="grid grid-cols-12 gap-6 text-[10px] uppercase tracking-widest text-gold border-b border-charcoal-800 pb-4">
                <div className="col-span-3">รหัสอ้างอิง (Key)</div>
                <div className="col-span-4 pl-6 border-l border-charcoal-800">ภาษาไทย (TH)</div>
                <div className="col-span-4 pl-6 border-l border-charcoal-800">ภาษาอังกฤษ (EN)</div>
              </div>

              {flatTranslations.map((item, index) => (
                <div key={item.key} className="grid grid-cols-12 gap-6 items-start group">
                  <div className="col-span-3">
                    <code className="text-[10px] text-gray-500 bg-black/40 px-2 py-1 rounded">{item.key}</code>
                  </div>
                  <div className="col-span-4 border-l border-charcoal-800 pl-6">
                    {Array.isArray(item.th) ? (
                      <div className="space-y-2">
                        {item.th.map((val, i) => (
                          <input 
                            key={i} value={val} 
                            onChange={(e) => {
                              const newArr = [...item.th];
                              newArr[i] = e.target.value;
                              handleTranslationChange(index, 'th', newArr);
                            }}
                            className="w-full bg-charcoal-950 border border-charcoal-800 p-2 text-xs focus:border-gold outline-none font-sans" 
                          />
                        ))}
                      </div>
                    ) : (
                      <textarea 
                        value={item.th} 
                        onChange={(e) => handleTranslationChange(index, 'th', e.target.value)}
                        className="w-full bg-charcoal-950 border border-charcoal-800 p-2 text-xs focus:border-gold outline-none h-20 resize-none font-sans" 
                      />
                    )}
                  </div>
                  <div className="col-span-4 border-l border-charcoal-800 pl-6">
                    {Array.isArray(item.en) ? (
                      <div className="space-y-2">
                        {item.en.map((val, i) => (
                          <input 
                            key={i} value={val} 
                            onChange={(e) => {
                              const newArr = [...item.en];
                              newArr[i] = e.target.value;
                              handleTranslationChange(index, 'en', newArr);
                            }}
                            className="w-full bg-charcoal-950 border border-charcoal-800 p-2 text-xs focus:border-gold outline-none font-sans" 
                          />
                        ))}
                      </div>
                    ) : (
                      <textarea 
                        value={item.en} 
                        onChange={(e) => handleTranslationChange(index, 'en', e.target.value)}
                        className="w-full bg-charcoal-950 border border-charcoal-800 p-2 text-xs focus:border-gold outline-none h-20 resize-none font-sans" 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
