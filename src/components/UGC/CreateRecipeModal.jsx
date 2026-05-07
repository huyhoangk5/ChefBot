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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white w-full max-w-2xl rounded-[40px] overflow-hidden flex flex-col max-h-[95vh] shadow-2xl border-2 border-gray-200">
          <div className="p-8 bg-gradient-to-r from-blue-600 to-orange-500 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{editingRecipe ? "Sửa công thức" : "Tạo công thức mới"}</h2>
              <p className="text-blue-100 text-sm font-medium">Chia sẻ món ăn yêu thích của bạn</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all">
              <X size={24}/>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div>
              <label className="text-sm font-black uppercase text-blue-600 mb-3 block flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Tên món ăn
              </label>
              <input 
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Cơm chiên trứng Chefbot..."
                className="w-full p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-black uppercase text-blue-600 mb-3 block flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Số người ăn
              </label>
              <input 
                type="number" min="1"
                value={servings} onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                className="w-full p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-black uppercase text-blue-600 mb-3 block flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Ảnh món ăn
              </label>
              <div className="flex gap-6 items-start">
                {imagePreview && (
                  <img src={imagePreview} className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-200 shadow-lg" />
                )}
                <label className="flex-1 flex flex-col items-center justify-center p-8 border-3 border-dashed border-blue-300 rounded-3xl cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all bg-gradient-to-r from-gray-50 to-gray-100">
                  <Upload size={32} className="text-blue-500 mb-3" />
                  <span className="text-sm font-bold text-blue-600">Tải ảnh lên</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-black uppercase text-blue-600 mb-3 block flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Chọn nguyên liệu ({selectedIngs.length})
              </label>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  placeholder="Tìm nguyên liệu nhanh..."
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl text-sm border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto p-2 mb-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                {sortedIngs.slice(0, 30).map(ing => (
                  <button 
                    key={ing.id} type="button"
                    onClick={() => setSelectedIngs(prev => prev.includes(ing.id) ? prev.filter(id => id !== ing.id) : [...prev, ing.id])}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center gap-2 shadow-sm ${selectedIngs.includes(ing.id) ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600 text-white shadow-orange-200' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'}`}
                  >
                    {selectedIngs.includes(ing.id) && <Check size={14}/>}
                    {ing.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <input 
                  type="text" placeholder="Tên nguyên liệu mới" value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  className="flex-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-sm border-2 border-gray-200 focus:border-blue-400 transition-all font-medium"
                />
                <select value={newIngredientCategory} onChange={(e) => setNewIngredientCategory(e.target.value)} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-sm border-2 border-gray-200 font-medium">
                  {allCategories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <button type="button" onClick={handleAddNewIngredient} className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg">Thêm mới</button>
              </div>
            </div>

            <div>
              <label className="text-sm font-black uppercase text-blue-600 mb-3 block flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Hướng dẫn nấu
              </label>
              <textarea 
                rows="6" value={instructions} onChange={(e) => setInstructions(e.target.value)}
                placeholder="B1: Rửa sạch nguyên liệu...&#10;B2: Luộc chín trong 10 phút...&#10;B3: Nêm nếm gia vị..."
                className="w-full p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-sm text-gray-800 resize-none"
              />
            </div>
          </form>

          <div className="p-8 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100">
            <button onClick={handleSubmit} className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-3xl font-black uppercase text-lg tracking-widest transition-all shadow-xl border-2 border-orange-400">
              {editingRecipe ? "🔄 Cập nhật" : "💾 Lưu vào sổ tay"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateRecipeModal;