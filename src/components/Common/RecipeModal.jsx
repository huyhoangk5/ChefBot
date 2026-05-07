import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, BookOpen, Edit, Trash2, Plus } from 'lucide-react';
import RecipeCard from '../Recipe/RecipeCard';

const RecipeModal = ({ isOpen, onClose, recipes, modalMode, selectedIngredients, allIngredients, recipePoints, favorites, onToggleFavorite, onCookSuccess, onEditRecipe, onDeleteRecipe, onCreateNew, onViewDetail }) => {
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-gradient-to-br from-white to-gray-50 w-full max-w-6xl h-full sm:h-[90vh] overflow-hidden sm:rounded-[40px] flex flex-col shadow-2xl border-2 border-gray-200">
          
          {/* Header với gradient background */}
          <div className="p-8 bg-gradient-to-r from-blue-600 to-orange-500 text-white border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Icon size={24} fill={modalMode === 'favorites' ? "currentColor" : "none"} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
                <p className="text-blue-100 text-sm font-medium">Khám phá những món ăn tuyệt vời</p>
              </div>
            </div>
            <div className="flex gap-3">
              {modalMode === 'user' && (
                <button
                  onClick={onCreateNew}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-2xl font-bold text-sm transition-all shadow-lg border border-white/20"
                >
                  <Plus size={20} /> <span className="hidden sm:inline">Thêm món</span>
                </button>
              )}
              <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-2xl transition-colors">
                <X size={28} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} recipe={recipe} selectedIngredients={selectedIngredients}
                    allIngredients={allIngredients} recipePoints={recipePoints} 
                    favorites={favorites} onToggleFavorite={onToggleFavorite} 
                    onCookSuccess={onCookSuccess}
                    showEditDelete={modalMode === 'user'}
                    onEdit={() => onEditRecipe(recipe)}
                    onDelete={() => onDeleteRecipe(recipe.id, recipe.name)}
                    onViewDetail={onViewDetail}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-gray-400">
                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl mb-6">
                  <Icon size={64} className="opacity-30" />
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">
                  {modalMode === 'user' ? 'Sổ tay còn trống' : (modalMode === 'favorites' ? 'Chưa có món tủ nào' : 'Chưa có món ăn nào')}
                </h3>
                <p className="text-sm mt-2 max-w-md">
                  {modalMode === 'user' ? 'Hãy tự tạo công thức nấu ăn của riêng bạn!' : (modalMode === 'favorites' ? 'Hãy thả tim hoặc nấu món ăn để tích điểm nhé!' : 'Thử chọn thêm nguyên liệu bạn nhé!')}
                </p>
                {modalMode === 'user' && (
                  <button
                    onClick={onCreateNew}
                    className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus size={20} /> Tạo công thức mới
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