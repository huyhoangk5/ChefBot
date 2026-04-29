import React, { useState, useMemo, useRef, useEffect } from 'react';
import data from './data/data.json';
import IngredientCard from './components/Pantry/IngredientCard';
import RecipeCard from './components/Recipe/RecipeCard';
import { Search, Heart, X, ShoppingCart, PackageOpen, Utensils, Star, Plus, BookOpen, Filter } from 'lucide-react';
import RecipeModal from './components/Common/RecipeModal';
import RecipeDetailModal from './components/Common/RecipeDetailModal';
import CreateRecipeModal from './components/UGC/CreateRecipeModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AnimatePresence, motion } from 'framer-motion';
import logoChefbot from '/images/logo_chefbot.png?url';

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('suggested');
  const [directViewRecipe, setDirectViewRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mode, setMode] = useState('cook');
  const [selectedDiningCategory, setSelectedDiningCategory] = useState("Tất cả");
  
  // === BỔ SUNG: state cho bộ lọc ===
  const [servingCount, setServingCount] = useState(1);
  const [preferenceFilter, setPreferenceFilter] = useState('all'); // 'all', 'favorites', 'mostPoints'
  const [isLoading, setIsLoading] = useState(false);

  const [userRecipes, setUserRecipes] = useLocalStorage('chefbot-user-recipes', []);
  const [customIngredients, setCustomIngredients] = useLocalStorage('chefbot-custom-ingredients', []);
  const [customCategories, setCustomCategories] = useLocalStorage('chefbot-custom-categories', []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const [shoppingList, setShoppingList] = useLocalStorage('chefbot-shopping', []);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);
  const [recipePoints, setRecipePoints] = useLocalStorage('chefbot-points', {});
  const [favorites, setFavorites] = useLocalStorage('chefbot-favorites', []);
  const [toast, setToast] = useState({ show: false, message: '' });

  const searchRef = useRef(null);

  const allCategories = useMemo(() => [...data.categories, ...customCategories], [customCategories]);
  const allIngredients = useMemo(() => [...data.ingredients, ...customIngredients], [customIngredients]);

  const diningRecipes = data.diningRecipes || [];
  const diningCategories = data.diningCategories || ["Tất cả", "Đồ chay", "Món mặn", "Đồ khô", "Nước giải khát", "Đồ ngọt"];

  const filteredDining = useMemo(() => {
    if (selectedDiningCategory === "Tất cả") return diningRecipes;
    return diningRecipes.filter(item => item.category === selectedDiningCategory);
  }, [selectedDiningCategory, diningRecipes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allRecipes = useMemo(() => [...data.recipes, ...userRecipes], [userRecipes]);
  const allFavoriteRecipes = useMemo(() => [...allRecipes, ...diningRecipes], [allRecipes, diningRecipes]);

  const sortedUserRecipes = useMemo(() => {
    return [...userRecipes].sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav !== bFav) return bFav - aFav;
      const aPoints = recipePoints[a.id] || 0;
      const bPoints = recipePoints[b.id] || 0;
      if (aPoints !== bPoints) return bPoints - aPoints;
      return a.name.localeCompare(b.name, 'vi');
    });
  }, [userRecipes, favorites, recipePoints]);

  // Effect loading khi thay đổi bộ lọc
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedIngredients, servingCount, preferenceFilter]);

  // === SỬA LẠI HÀM suggestedRecipes ===
  const suggestedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];
    
    // Bước 1: Lọc theo nguyên liệu và số người ăn
    let filtered = allRecipes.filter(r => 
      r.required_ingredients && 
      r.required_ingredients.some(id => selectedIngredients.includes(id)) &&
      (r.servings >= servingCount)
    );
    
    // Bước 2: Áp dụng bộ lọc sở thích
    if (preferenceFilter === 'favorites') {
      filtered = filtered.filter(r => favorites.includes(r.id));
    } else if (preferenceFilter === 'mostPoints') {
      filtered = [...filtered].sort((a, b) => (recipePoints[b.id] || 0) - (recipePoints[a.id] || 0));
    } else {
      // Mặc định: sắp xếp theo độ khớp nguyên liệu
      filtered = filtered.sort((a, b) => {
        const matchA = a.required_ingredients.filter(id => selectedIngredients.includes(id)).length;
        const matchB = b.required_ingredients.filter(id => selectedIngredients.includes(id)).length;
        return matchB - matchA;
      });
    }
    return filtered;
  }, [selectedIngredients, allRecipes, servingCount, preferenceFilter, favorites, recipePoints]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const matchedIngredients = allIngredients
      .filter(i => i.name.toLowerCase().includes(query))
      .map(i => ({ type: 'ingredient', item: i }));

    const matchedCookRecipes = allRecipes
      .filter(r => r.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const isFavA = favorites.includes(a.id) ? 1 : 0;
        const isFavB = favorites.includes(b.id) ? 1 : 0;
        if (isFavB !== isFavA) return isFavB - isFavA;
        const pointsA = recipePoints[a.id] || 0;
        const pointsB = recipePoints[b.id] || 0;
        if (pointsB !== pointsA) return pointsB - pointsA;
        return a.name.localeCompare(b.name, 'vi');
      })
      .map(r => ({ type: 'recipe', item: r, subtype: 'cook' }));

    const matchedDiningRecipes = diningRecipes
      .filter(r => r.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const isFavA = favorites.includes(a.id) ? 1 : 0;
        const isFavB = favorites.includes(b.id) ? 1 : 0;
        if (isFavB !== isFavA) return isFavB - isFavA;
        const pointsA = recipePoints[a.id] || 0;
        const pointsB = recipePoints[b.id] || 0;
        if (pointsB !== pointsA) return pointsB - pointsA;
        return a.name.localeCompare(b.name, 'vi');
      })
      .map(r => ({ type: 'recipe', item: r, subtype: 'dine' }));

    return [...matchedIngredients, ...matchedCookRecipes, ...matchedDiningRecipes];
  }, [searchQuery, favorites, recipePoints, allRecipes, allIngredients, diningRecipes]);

  const filteredIngredients = useMemo(() => {
    const list = activeTab === "Tất cả"
      ? [...allIngredients]
      : allIngredients.filter(item => item.category === activeTab);
    return list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [activeTab, allIngredients]);

  const addCustomIngredient = (name, category) => {
    const newId = `custom_ing_${Date.now()}`;
    const newIng = {
      id: newId,
      name,
      category,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
    };
    setCustomIngredients(prev => [...prev, newIng]);
    return newId;
  };

  const addCustomCategory = (categoryName) => {
    if (!categoryName.trim()) return;
    if (allCategories.includes(categoryName)) return;
    setCustomCategories(prev => [...prev, categoryName]);
  };

  const handleCookLogic = (recipe) => {
    const currentPoints = recipePoints[recipe.id] || 0;
    const newPoints = currentPoints + 1;
    setRecipePoints(prev => ({ ...prev, [recipe.id]: newPoints }));

    if (newPoints === 5 && !favorites.includes(recipe.id)) {
      setFavorites(prev => [...prev, recipe.id]);
      setToast({ show: true, message: `Món ${recipe.name} đã thành món tủ! ❤️` });
    } else {
      setToast({ show: true, message: `Đã tích +1 điểm cho món ${recipe.name}!` });
    }

    if (recipe.required_ingredients && recipe.required_ingredients.length > 0) {
      const missingIds = recipe.required_ingredients.filter(id => !selectedIngredients.includes(id));
      if (missingIds.length > 0) {
        const missingItems = missingIds.map(id => allIngredients.find(ing => ing.id === id));
        setShoppingList(prev => {
          const existingIds = prev.map(item => item.id);
          const uniqueNewItems = missingItems.filter(item => item && !existingIds.includes(item.id));
          return [...prev, ...uniqueNewItems];
        });
      }
    }
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleEatOut = (recipe) => {
    const currentPoints = recipePoints[recipe.id] || 0;
    const newPoints = currentPoints + 1;
    setRecipePoints(prev => ({ ...prev, [recipe.id]: newPoints }));

    if (newPoints === 5 && !favorites.includes(recipe.id)) {
      setFavorites(prev => [...prev, recipe.id]);
      setToast({ show: true, message: `Món ${recipe.name} đã vào danh sách yêu thích! ❤️` });
    } else {
      setToast({ show: true, message: `Đã +1 điểm cho món ${recipe.name}!` });
    }
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSaveUserRecipe = (newRecipe) => {
    setUserRecipes(prev => [newRecipe, ...prev]);
    setToast({ show: true, message: 'Đã lưu công thức vào sổ tay của bạn! 📖' });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleUpdateUserRecipe = (updatedRecipe) => {
    setUserRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    setToast({ show: true, message: `Đã cập nhật món "${updatedRecipe.name}"` });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const confirmDelete = (recipeId, recipeName) => {
    if (window.confirm(`Xóa món "${recipeName}"?`)) {
      setUserRecipes(prev => prev.filter(r => r.id !== recipeId));
      setToast({ show: true, message: `Đã xóa "${recipeName}"` });
      setTimeout(() => setToast({ show: false, message: '' }), 2000);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const displayedRecipes = useMemo(() => {
    if (modalMode === 'favorites') return allFavoriteRecipes.filter(r => favorites.includes(r.id));
    if (modalMode === 'user') return sortedUserRecipes;
    return suggestedRecipes;
  }, [modalMode, favorites, suggestedRecipes, sortedUserRecipes, allFavoriteRecipes]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-0 left-0 right-0 z-[200] flex justify-center px-4 pointer-events-none">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm pointer-events-auto">
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white sticky top-0 z-[100] shadow-sm px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <img src={logoChefbot} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-800 hidden md:block uppercase tracking-tighter">Chef<span className="text-orange-500">bot</span></h1>
          </div>

          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <Search size={18} />
              </div>
              <input 
                type="text" placeholder="Tìm món ăn..."
                className="w-full pl-11 pr-14 py-3 bg-white rounded-2xl border-2 border-black focus:ring-4 focus:ring-orange-500/10 font-bold transition-all placeholder:text-gray-400"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setShowSearchDropdown(true)}
                className="absolute right-2 p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors active:scale-90"
              >
                <Search size={18} />
              </button>
            </div>
            
            <AnimatePresence>
              {showSearchDropdown && searchQuery.trim() !== "" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-black overflow-hidden z-[110]">
                  <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, idx) => (
                        <button key={idx} onClick={() => {
                          if (result.type === 'ingredient') {
                            if (!selectedIngredients.includes(result.item.id)) setSelectedIngredients(p => [...p, result.item.id]);
                          } else {
                            setDirectViewRecipe(result.item);
                          }
                          setSearchQuery(""); setShowSearchDropdown(false);
                        }} className="w-full flex items-center gap-4 p-4 hover:bg-orange-50 text-left border-b border-gray-100 last:border-none">
                          <img src={result.item.image} className="w-11 h-11 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                              {result.item.name}
                              {result.type === 'recipe' && (recipePoints[result.item.id] > 0) && (
                                <span className="flex items-center text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-lg">
                                  <Star size={10} fill="currentColor" className="mr-0.5" />
                                  {recipePoints[result.item.id]}
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                {result.item.id?.toString().startsWith('user-') ? 'Món của tôi' : 
                                 (result.subtype === 'dine' ? 'Món ăn ngoài' : 
                                 (result.type === 'recipe' ? 'Món nấu tại nhà' : 'Nguyên liệu'))}
                              </p>
                              {result.type === 'recipe' && favorites.includes(result.item.id) && (
                                <Heart size={10} fill="#f97316" className="text-orange-500" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-400 text-sm mb-4">Chefbot chưa có món "{searchQuery}"</p>
                        <button 
                          onClick={() => { setIsCreateModalOpen(true); setShowSearchDropdown(false); }}
                          className="w-full py-3 bg-orange-100 text-orange-600 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2"
                        >
                          <Plus size={14} /> Tự tạo công thức ngay
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <button onClick={() => { setModalMode('user'); setIsModalOpen(true); }} className="relative p-2 sm:p-3 hover:bg-orange-50 rounded-2xl transition-all">
              <BookOpen size={24} className={userRecipes.length > 0 ? "text-gray-800" : "text-gray-300"} />
              {userRecipes.length > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-black min-w-[18px] h-4.5 flex items-center justify-center rounded-full border-2 border-white px-1">
                  {userRecipes.length}
                </span>
              )}
            </button>

            <button onClick={() => { setModalMode('favorites'); setIsModalOpen(true); }} className="relative p-2 sm:p-3 hover:bg-orange-50 rounded-2xl transition-all">
              <Heart size={24} className={favorites.length > 0 ? "text-orange-500" : "text-gray-300"} fill={favorites.length > 0 ? "currentColor" : "none"} />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-black min-w-[18px] h-4.5 flex items-center justify-center rounded-full border-2 border-white px-1">
                  {favorites.length}
                </span>
              )}
            </button>

            <button onClick={() => setIsShoppingOpen(true)} className="relative p-2 sm:p-3 hover:bg-orange-50 rounded-2xl transition-all">
              <ShoppingCart size={24} className="text-gray-700" />
              {shoppingList.length > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black min-w-[18px] h-4.5 flex items-center justify-center rounded-full border-2 border-white px-1">
                  {shoppingList.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
          <button
            onClick={() => setMode('cook')}
            className={`text-lg font-black uppercase tracking-wide pb-2 transition-all ${
              mode === 'cook'
                ? 'text-orange-500 border-b-4 border-orange-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🍳 Nấu ăn tại nhà
          </button>
          <button
            onClick={() => setMode('dine')}
            className={`text-lg font-black uppercase tracking-wide pb-2 transition-all ${
              mode === 'dine'
                ? 'text-orange-500 border-b-4 border-orange-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🍽️ Đi ăn ngoài
          </button>
        </div>

        {mode === 'cook' ? (
          <>
            {/* Bộ lọc số người và sở thích */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-600">Số người ăn:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={servingCount}
                  onChange={(e) => setServingCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl text-center font-bold"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={preferenceFilter}
                  onChange={(e) => setPreferenceFilter(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold bg-white"
                >
                  <option value="all">Tất cả món</option>
                  <option value="favorites">Yêu thích</option>
                  <option value="mostPoints">Nhiều điểm nhất</option>
                </select>
              </div>
            </div>

            {/* Danh mục nguyên liệu */}
            <div className="mb-8">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                <button
                  onClick={() => setActiveTab("Tất cả")}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap border-2 transition-all text-center ${
                    activeTab === "Tất cả"
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}
                >
                  Tất cả
                </button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap border-2 transition-all text-center ${
                      activeTab === cat
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                        : 'bg-white text-gray-400 border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => {
                    const newCat = prompt("Nhập tên loại nguyên liệu mới:");
                    if (newCat && !allCategories.includes(newCat)) addCustomCategory(newCat);
                  }}
                  className="px-4 py-2.5 rounded-2xl font-bold text-sm border-2 border-dashed border-orange-300 bg-orange-50 text-orange-600 flex items-center justify-center gap-1 hover:bg-orange-100 transition-all"
                >
                  <Plus size={16} /> <span className="hidden sm:inline">Thêm loại</span>
                </button>
              </div>
            </div>

            {filteredIngredients.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {filteredIngredients.map(item => (
                  <IngredientCard key={item.id} ingredient={item} isSelected={selectedIngredients.includes(item.id)} onToggle={(id) => setSelectedIngredients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-gray-100">
                <PackageOpen className="text-gray-200 mx-auto mb-4" size={48} />
                <p className="text-gray-400 font-bold uppercase tracking-widest">Không có dữ liệu</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {diningCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedDiningCategory(cat)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap border-2 transition-all text-center ${
                      selectedDiningCategory === cat
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                        : 'bg-white text-gray-400 border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDining.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  selectedIngredients={[]}
                  allIngredients={[]}
                  recipePoints={recipePoints}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onCookSuccess={handleEatOut}
                  showEditDelete={false}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <button 
        onClick={() => { setEditingRecipe(null); setIsCreateModalOpen(true); }}
        className="sm:hidden fixed bottom-28 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl z-40 flex items-center justify-center active:scale-90 transition-transform"
      >
        <Plus size={28} />
      </button>

      <AnimatePresence>
        {isShoppingOpen && (
          <div className="fixed inset-0 z-[200]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShoppingOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white p-6 sm:p-8 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Giỏ <span className="text-orange-500">đi chợ</span></h2>
                <button onClick={() => setIsShoppingOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {shoppingList.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                    <span className="flex-1 font-bold text-gray-700">{item.name}</span>
                    <button onClick={() => setShoppingList(prev => prev.filter(i => i.id !== item.id))} className="text-gray-300 hover:text-red-500 transition-colors"><X size={18}/></button>
                  </div>
                ))}
                {shoppingList.length === 0 && <p className="text-center text-gray-400 mt-20 font-bold italic">Bạn chưa thêm nguyên liệu nào...</p>}
              </div>
              {shoppingList.length > 0 && (
                <button onClick={() => setShoppingList([])} className="mt-8 w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98]">Xóa tất cả</button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 flex justify-center pointer-events-none">
        {mode === 'cook' && (
          <button onClick={() => { setModalMode('suggested'); setIsModalOpen(true); }} className="px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all pointer-events-auto bg-orange-500 text-white shadow-orange-200 active:scale-95">
            {selectedIngredients.length === 0 ? "Chọn nguyên liệu để nấu" : `Gợi ý món ăn (${suggestedRecipes.length})`}
          </button>
        )}
      </div>

      <RecipeModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        recipes={displayedRecipes} modalMode={modalMode} 
        selectedIngredients={selectedIngredients} allIngredients={allIngredients} 
        recipePoints={recipePoints} favorites={favorites}
        onToggleFavorite={toggleFavorite} onCookSuccess={handleCookLogic}
        onEditRecipe={(recipe) => { setEditingRecipe(recipe); setIsCreateModalOpen(true); }}
        onDeleteRecipe={confirmDelete}
        onCreateNew={() => { setEditingRecipe(null); setIsCreateModalOpen(true); }}
      />

      <CreateRecipeModal 
        isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setEditingRecipe(null); }}
        onSave={handleSaveUserRecipe} onUpdate={handleUpdateUserRecipe}
        editingRecipe={editingRecipe}
        allIngredients={allIngredients} customIngredients={customIngredients}
        onAddCustomIngredient={addCustomIngredient}
        allCategories={allCategories}
      />

      <RecipeDetailModal 
        isOpen={!!directViewRecipe} onClose={() => setDirectViewRecipe(null)}
        recipe={directViewRecipe} selectedIngredients={selectedIngredients}
        allIngredients={allIngredients} points={directViewRecipe ? (recipePoints[directViewRecipe.id] || 0) : 0} 
        isFavorite={directViewRecipe ? favorites.includes(directViewRecipe.id) : false}
        onToggleFavorite={toggleFavorite} onCookSuccess={directViewRecipe?.price ? handleEatOut : handleCookLogic}
      />
    </div>
  );
}

export default App;