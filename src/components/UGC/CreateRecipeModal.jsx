import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search, PlusCircle, Upload } from 'lucide-react';

const CreateRecipeModal = ({ isOpen, onClose, onSave, onUpdate, editingRecipe, allIngredients, onAddCustomIngredient, allCategories }) => {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedIngs, setSelectedIngs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [servings, setServings] = useState(1);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientCategory, setNewIngredientCategory] = useState(allCategories[0] || "Rau củ & Trái cây");

  useEffect(() => {
    if (editingRecipe) {
      setName(editingRecipe.name);
      setInstructions(editingRecipe.instructions);
      setSelectedIngs(editingRecipe.required_ingredients || []);
      setImagePreview(editingRecipe.image || "");
      setServings(editingRecipe.servings || 1);
    } else {
      setName("");
      setInstructions("");
      setSelectedIngs([]);
      setImagePreview("");
      setServings(1);
    }
  }, [editingRecipe, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !instructions) return alert("Vui lòng nhập đủ tên và hướng dẫn!");

    const finalImage = imagePreview || "https://images.unsplash.com/photo-1495195129352-aec329a7ed7a?w=500";

    if (editingRecipe) {
      const updated = {
        ...editingRecipe,
        name,
        instructions,
        required_ingredients: selectedIngs,
        image: finalImage,
        servings,
      };
      onUpdate(updated);
    } else {
      const newRecipe = {
        id: `user-${Date.now()}`,
        name,
        required_ingredients: selectedIngs,
        instructions,
        image: finalImage,
        servings,
      };
      onSave(newRecipe);
    }
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewIngredient = () => {
    if (!newIngredientName.trim()) return alert("Vui lòng nhập tên nguyên liệu");
    const newId = onAddCustomIngredient(newIngredientName.trim(), newIngredientCategory);
    setSelectedIngs(prev => [...prev, newId]);
    setNewIngredientName("");
  };

  // Filter ingredients and put selected ones first
  const filteredIngs = allIngredients.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedIngs = [...filteredIngs].sort((a, b) => {
    const aSelected = selectedIngs.includes(a.id);
    const bSelected = selectedIngs.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.name.localeCompare(b.name, 'vi');
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white w-full max-w-xl rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-black uppercase">{editingRecipe ? "Sửa công thức" : "Tạo công thức mới"}</h2>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Tên món ăn</label>
              <input 
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Cơm chiên trứng Chefbot..."
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black transition-all font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Số người ăn</label>
              <input 
                type="number" min="1"
                value={servings} onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black transition-all font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Ảnh món ăn</label>
              <div className="flex gap-4 items-start">
                {imagePreview && (
                  <img src={imagePreview} className="w-20 h-20 rounded-xl object-cover border" />
                )}
                <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-orange-50">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Tải ảnh lên</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Chọn nguyên liệu ({selectedIngs.length})</label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                <input 
                  placeholder="Tìm nguyên liệu nhanh..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm border border-gray-100"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 mb-3">
                {sortedIngs.slice(0, 30).map(ing => (
                  <button 
                    key={ing.id} type="button"
                    onClick={() => setSelectedIngs(prev => prev.includes(ing.id) ? prev.filter(id => id !== ing.id) : [...prev, ing.id])}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all flex items-center gap-1 ${selectedIngs.includes(ing.id) ? 'bg-orange-500 border-orange-600 text-white' : 'bg-white border-gray-100 text-gray-500'}`}
                  >
                    {selectedIngs.includes(ing.id) && <Check size={12}/>}
                    {ing.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" placeholder="Tên nguyên liệu mới" value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  className="flex-1 p-2 bg-gray-50 rounded-xl text-sm border"
                />
                <select value={newIngredientCategory} onChange={(e) => setNewIngredientCategory(e.target.value)} className="p-2 bg-gray-50 rounded-xl text-sm border">
                  {allCategories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <button type="button" onClick={handleAddNewIngredient} className="px-4 bg-black text-white rounded-xl text-xs font-bold">Thêm mới</button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Hướng dẫn nấu</label>
              <textarea 
                rows="4" value={instructions} onChange={(e) => setInstructions(e.target.value)}
                placeholder="B1: Rửa sạch... B2: Luộc chín..."
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black transition-all font-medium text-sm"
              />
            </div>
          </form>

          <div className="p-6 bg-gray-50 border-t">
            <button onClick={handleSubmit} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-800 transition-all">
              {editingRecipe ? "Cập nhật" : "Lưu vào sổ tay"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateRecipeModal;