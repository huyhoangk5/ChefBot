import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShoppingCart, Trophy, Utensils, Heart, Store, Clock } from 'lucide-react';

const RecipeDetailModal = ({ isOpen, onClose, recipe, selectedIngredients, allIngredients, points = 0, isFavorite, onToggleFavorite, onCookSuccess }) => {
  if (!isOpen || !recipe) return null;

  const getIngredientInfo = (id) => allIngredients.find(ing => ing.id === id);
  const isDining = !!recipe.price;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-3xl h-full sm:h-auto sm:max-h-[95vh] overflow-hidden sm:rounded-[48px] flex flex-col shadow-2xl border-2 border-gray-200">
          <div className="relative h-80 shrink-0">
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            <button onClick={onClose} className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all shadow-lg">
              <X size={24}/>
            </button>
            <button onClick={() => onToggleFavorite(recipe.id)} className={`absolute top-6 left-6 p-4 rounded-full backdrop-blur-md transition-all shadow-lg ${isFavorite ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' : 'bg-white/20 text-white hover:bg-white hover:text-orange-500'}`}>
              <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            
            {/* Recipe title overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-4xl font-black text-white uppercase mb-2 tracking-tighter drop-shadow-lg">{recipe.name}</h2>
              {points > 0 && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <Trophy size={18} />
                  <span className="font-bold">{points} điểm</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {isDining ? (
              <>
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl border border-blue-200">
                  <div className="space-y-3">
                    <p className="text-sm text-blue-700 flex items-center gap-3">
                      <Store size={20} className="text-blue-600" />
                      <span className="font-bold">Quán / Nhà hàng:</span> 
                      <span className="text-blue-800">{recipe.restaurant}</span>
                    </p>
                    <p className="text-sm text-blue-700 flex items-center gap-3">
                      <span className="w-5"></span>
                      <span className="font-bold">Giá tham khảo:</span> 
                      <span className="text-orange-600 font-black">{recipe.price}</span>
                    </p>
                  </div>
                </div>
                <section className="mb-8">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    Mô tả món ăn
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200 font-medium">
                    {recipe.description}
                  </p>
                </section>
              </>
            ) : (
              <>
                {recipe.cookingTime && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl border border-orange-200">
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-orange-600" />
                      <span className="font-bold text-gray-800">Thời gian nấu:</span>
                      <span className="text-orange-700 font-black">{recipe.cookingTime} phút</span>
                    </div>
                  </div>
                )}
                <section className="mb-8">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    Nguyên liệu cần thiết
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recipe.required_ingredients?.map(ingId => {
                      const ing = getIngredientInfo(ingId);
                      const isOwned = selectedIngredients.includes(ingId);
                      return (
                        <div key={ingId} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${isOwned ? 'border-green-200 bg-gradient-to-r from-green-50 to-green-100' : 'border-red-200 bg-gradient-to-r from-red-50 to-red-100'}`}>
                          {isOwned ? <CheckCircle2 size={20} className="text-green-600" /> : <ShoppingCart size={20} className="text-red-500" />}
                          <span className={`text-sm font-bold flex-1 ${isOwned ? 'text-green-800' : 'text-red-800'}`}>{ing?.name || "Nguyên liệu"}</span>
                          {!isOwned && <span className="text-xs font-black uppercase text-red-500 bg-red-200 px-2 py-1 rounded-lg">Thiếu</span>}
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    Cách thực hiện
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-medium bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200 whitespace-pre-line">{recipe.instructions}</p>
                </section>
              </>
            )}
          </div>
          
          <div className="p-8 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100">
            <button 
              onClick={() => { onCookSuccess(recipe); onClose(); }}
              className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-3xl font-black uppercase tracking-widest text-lg shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 border-2 border-orange-400"
            >
              {isDining ? <Store size={24} /> : <Utensils size={24} />}
              {isDining ? "🍽️ Ăn ngay" : "🍳 Bắt đầu nấu ngay"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RecipeDetailModal;