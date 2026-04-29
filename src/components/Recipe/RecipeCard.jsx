import React, { useState } from 'react';
import { Users, Clock, ArrowRight, Star, Heart, Edit, Trash2 } from 'lucide-react';
import RecipeDetailModal from '../Common/RecipeDetailModal';
import { motion } from 'framer-motion';

const RecipeCard = ({ recipe, selectedIngredients, allIngredients, recipePoints = {}, favorites = [], onToggleFavorite, onCookSuccess, showEditDelete = false, onEdit, onDelete }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const points = recipePoints?.[recipe?.id] || 0;
  const isFavorite = favorites.includes(recipe.id);

  const matchCount = recipe?.required_ingredients?.filter(id => 
    selectedIngredients.includes(id)
  ).length || 0;

  // Kiểm tra nếu là món đi ăn ngoài (có price hoặc restaurant)
  const isDining = !!recipe.price || !!recipe.restaurant;

  return (
    <div className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full">
      <div className="relative h-44 overflow-hidden">
        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        
        {/* Favorite button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${isFavorite ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/80 text-gray-400 hover:text-orange-500'}`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Edit/Delete buttons for user recipes */}
        {showEditDelete && (
          <div className="absolute bottom-3 left-3 flex gap-2 z-10">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:bg-orange-500 hover:text-white transition-all">
              <Edit size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        )}

        {recipe.required_ingredients && recipe.required_ingredients.length > 0 && !isDining && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
            <p className="text-[10px] font-black text-orange-600 uppercase">
              Khớp {matchCount}/{recipe.required_ingredients.length}
            </p>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-extrabold text-gray-800 text-base leading-tight uppercase tracking-tight">{recipe.name}</h3>
          {points > 0 && (
            <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
              <Star size={12} fill="currentColor" />
              <span className="text-[10px] font-black">{points}</span>
            </div>
          )}
        </div>

        {/* Chỉ hiển thị thời gian và số người nếu không phải món đi ăn */}
        {!isDining && (
          <div className="flex items-center gap-4 text-gray-400 font-bold text-[10px] uppercase mb-4 mt-auto">
            <div className="flex items-center gap-1"><Clock size={12} /> 30-45p</div>
            <div className="flex items-center gap-1"><Users size={12} /> {recipe.servings} người</div>
          </div>
        )}

        {/* Nếu là món đi ăn, thêm một div trống để giữ layout hoặc có thể thêm giá */}
        {isDining && (
          <div className="mb-4 mt-auto">
            <p className="text-xs text-orange-500 font-bold">{recipe.price}</p>
          </div>
        )}

        <button 
          onClick={() => setIsDetailOpen(true)}
          className="w-full py-3 bg-gray-900 hover:bg-orange-500 text-white rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-2"
        >
          Chi tiết <ArrowRight size={14} />
        </button>
      </div>

      <RecipeDetailModal 
        isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)}
        recipe={recipe} selectedIngredients={selectedIngredients}
        allIngredients={allIngredients} points={points} 
        isFavorite={isFavorite} onToggleFavorite={onToggleFavorite}
        onCookSuccess={onCookSuccess}
      />
    </div>
  );
};

export default RecipeCard;