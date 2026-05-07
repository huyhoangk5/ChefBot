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

  const isDining = !!recipe.price || !!recipe.restaurant;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all group relative flex flex-col h-full hover:scale-105 duration-300">
      <div className="relative h-48 overflow-hidden">
        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
          className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all z-10 shadow-lg ${isFavorite ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' : 'bg-white/90 text-gray-500 hover:text-orange-500'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {showEditDelete && (
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl text-gray-700 hover:bg-blue-500 hover:text-white transition-all shadow-lg">
              <Edit size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl text-gray-700 hover:bg-red-500 hover:text-white transition-all shadow-lg">
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {recipe.required_ingredients && recipe.required_ingredients.length > 0 && !isDining && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm">
            <p className="text-xs font-black uppercase">
              Khớp {matchCount}/{recipe.required_ingredients.length}
            </p>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-extrabold text-gray-800 text-lg leading-tight uppercase tracking-tight">{recipe.name}</h3>
          {points > 0 && (
            <div className="flex items-center gap-1 text-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-1.5 rounded-xl border border-orange-200">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-black">{points}</span>
            </div>
          )}
        </div>

        {!isDining && (
          <div className="flex items-center gap-6 text-gray-500 font-bold text-xs uppercase mb-4 mt-auto">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {recipe.cookingTime ? `${recipe.cookingTime} phút` : '30-45p'}
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} /> {recipe.servings} người
            </div>
          </div>
        )}

        {isDining && (
          <div className="mb-4 mt-auto">
            <p className="text-sm text-orange-600 font-bold bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-2 rounded-xl border border-orange-200">{recipe.price}</p>
          </div>
        )}

        <button 
          onClick={() => setIsDetailOpen(true)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-black text-sm uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
        >
          Chi tiết <ArrowRight size={16} />
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