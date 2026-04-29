import React from 'react';

const IngredientCard = ({ ingredient, isSelected, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(ingredient.id)}
      className={`relative cursor-pointer rounded-2xl p-2 transition-all duration-300 border-4 flex flex-col items-center group
        ${isSelected 
          ? 'border-orange-500 bg-orange-50 scale-95 shadow-inner' 
          : 'border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-orange-200 hover:scale-105'}`}
    >
      {/* Badge Checkmark */}
      {isSelected && (
        <div className="absolute top-1 right-1 bg-orange-500 text-white rounded-full p-1 shadow-lg z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full mb-2 border-2 border-gray-100">
        <img 
          src={ingredient.image} 
          alt={ingredient.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          loading="lazy"
        />
      </div>
      <span className={`text-xs sm:text-sm font-bold text-center ${isSelected ? 'text-orange-600' : 'text-gray-600'}`}>
        {ingredient.name}
      </span>
    </div>
  );
};

export default IngredientCard;