import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, BookOpen, Edit, Trash2, Plus } from 'lucide-react';
import RecipeCard from '../Recipe/RecipeCard';

const RecipeModal = ({ isOpen, onClose, recipes, modalMode, selectedIngredients, allIngredients, recipePoints, favorites, onToggleFavorite, onCookSuccess, onEditRecipe, onDeleteRecipe, onCreateNew }) => {
  if (!isOpen) return null;

  const titles = {
    favorites: 'Món ăn yêu thích',
    suggested: 'Danh sách gợi ý',
    user: 'Sổ tay của tôi'
  };

  const title = titles[modalMode] || 'Danh sách món ăn';
  const Icon = modalMode === 'user' ? BookOpen : (modalMode === 'favorites' ? Heart : Sparkles);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-[#F8F9FA] w-full max-w-5xl h-full sm:h-[85vh] overflow-hidden sm:rounded-[32px] flex flex-col shadow-2xl">
          
          {/* Header với nút thêm món đẹp */}
          <div className="p-6 bg-white border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                <Icon size={20} fill={modalMode === 'favorites' ? "currentColor" : "none"} />
              </div>
              <h2 className="text-xl font-black text-gray-800 uppercase">{title}</h2>
            </div>
            <div className="flex gap-3">
              {modalMode === 'user' && (
                <button
                  onClick={onCreateNew}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm transition-all shadow-md"
                >
                  <Plus size={18} /> <span className="hidden sm:inline">Thêm món</span>
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} recipe={recipe} selectedIngredients={selectedIngredients}
                    allIngredients={allIngredients} recipePoints={recipePoints} 
                    favorites={favorites} onToggleFavorite={onToggleFavorite} 
                    onCookSuccess={onCookSuccess}
                    showEditDelete={modalMode === 'user'}
                    onEdit={() => onEditRecipe(recipe)}
                    onDelete={() => onDeleteRecipe(recipe.id, recipe.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-gray-400">
                <Icon size={40} className="mb-4 opacity-20" />
                <h3 className="font-bold text-gray-800">
                  {modalMode === 'user' ? 'Sổ tay còn trống' : (modalMode === 'favorites' ? 'Chưa có món tủ nào' : 'Chưa có món ăn nào')}
                </h3>
                <p className="text-sm mt-2">
                  {modalMode === 'user' ? 'Hãy tự tạo công thức nấu ăn của riêng bạn!' : (modalMode === 'favorites' ? 'Hãy thả tim hoặc nấu món ăn để tích điểm nhé!' : 'Thử chọn thêm nguyên liệu bạn nhé!')}
                </p>
                {modalMode === 'user' && (
                  <button
                    onClick={onCreateNew}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus size={18} /> Tạo công thức mới
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RecipeModal;