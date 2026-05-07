import React from 'react';

const IngredientCard = ({ ingredient, isSelected, onToggle }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', ingredient.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={() => onToggle(ingredient.id)}
      className={`relative cursor-grab active:cursor-grabbing rounded-3xl p-4 transition-all duration-300 border-3 flex flex-col items-center group hover:shadow-lg
        ${isSelected 
          ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 scale-95 shadow-lg shadow-orange-200' 
          : 'border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white'}`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-2 shadow-lg z-10 border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <div className="w-18 h-18 sm:w-22 sm:h-22 overflow-hidden rounded-2xl mb-3 border-3 border-gray-100 shadow-sm">
        <img 
          src={ingredient.image} 
          alt={ingredient.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <span className={`text-xs sm:text-sm font-bold text-center leading-tight ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>
        {ingredient.name}
      </span>
    </div>
  );
};

export default IngredientCard;