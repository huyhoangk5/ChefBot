import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShoppingCart, Trophy, Utensils, Heart, Store } from 'lucide-react';

const RecipeDetailModal = ({ isOpen, onClose, recipe, selectedIngredients, allIngredients, points = 0, isFavorite, onToggleFavorite, onCookSuccess }) => {
  if (!isOpen || !recipe) return null;

  const getIngredientInfo = (id) => allIngredients.find(ing => ing.id === id);
  const isDining = !!recipe.price; // nếu có trường price thì là món đi ăn ngoài

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden sm:rounded-[40px] flex flex-col">
          <div className="relative h-64 shrink-0">
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
            <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all"><X size={20}/></button>
            <button onClick={() => onToggleFavorite(recipe.id)} className={`absolute top-6 left-6 p-3 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-orange-500 text-white' : 'bg-white/20 text-white'}`}>
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <h2 className="text-3xl font-black text-gray-800 uppercase mb-6 tracking-tighter">{recipe.name}</h2>
            
            {isDining ? (
              // Hiển thị thông tin món ăn ngoài
              <>
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl space-y-2">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Store size={16} className="text-orange-500" />
                    <span className="font-bold">Quán / Nhà hàng:</span> {recipe.restaurant}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Giá tham khảo:</span> {recipe.price}
                  </p>
                </div>
                <section className="mb-8">
                  <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Mô tả món ăn</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-[24px] border border-gray-100">
                    {recipe.description}
                  </p>
                </section>
              </>
            ) : (
              // Hiển thị thông tin món nấu tại nhà
              <>
                <section className="mb-8">
                  <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Nguyên liệu</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recipe.required_ingredients?.map(ingId => {
                      const ing = getIngredientInfo(ingId);
                      const isOwned = selectedIngredients.includes(ingId);
                      return (
                        <div key={ingId} className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${isOwned ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                          {isOwned ? <CheckCircle2 size={18} className="text-green-500" /> : <ShoppingCart size={18} className="text-red-400" />}
                          <span className={`text-sm font-bold flex-1 ${isOwned ? 'text-green-800' : 'text-red-800'}`}>{ing?.name || "Nguyên liệu"}</span>
                          {!isOwned && <span className="text-[10px] font-black uppercase text-red-400">Thiếu</span>}
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Cách thực hiện</h3>
                  <p className="text-gray-600 leading-relaxed font-medium bg-gray-50 p-6 rounded-[24px] border border-gray-100 whitespace-pre-line">{recipe.instructions}</p>
                </section>
              </>
            )}
          </div>
          <div className="p-8 bg-white border-t flex gap-4">
            <div className="flex flex-col items-center justify-center px-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Trophy size={20} className={points > 0 ? "text-yellow-500" : "text-gray-300"} />
              <span className="text-[10px] font-black text-gray-400 mt-1 uppercase">{points} ĐIỂM</span>
            </div>
            <button 
              onClick={() => { onCookSuccess(recipe); onClose(); }}
              className="flex-1 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {isDining ? <Store size={18} /> : <Utensils size={18} />}
              {isDining ? "Ăn ngay" : "Bắt đầu nấu ngay"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RecipeDetailModal;