import React, { useEffect, useMemo, useState } from "react";

const RECIPE_DATA = [
  { id: 1, name: "Creamy Garlic Pasta", category: "Dinner", time: "20 min", difficulty: "Easy", ingredients: ["Pasta", "Milk", "Garlic", "Parmesan"], image: "🍝" },
  { id: 2, name: "Chicken Stir-Fry", category: "Dinner", time: "25 min", difficulty: "Medium", ingredients: ["Chicken", "Broccoli", "Soy Sauce"], image: "🍗" },
  { id: 3, name: "Tomato Soup & Grilled Cheese", category: "Lunch", time: "25 min", difficulty: "Easy", ingredients: ["Canned Tomatoes", "Bread", "Cheddar Cheese"], image: "🍅" },
  { id: 4, name: "Berry Yogurt Parfait", category: "Breakfast", time: "10 min", difficulty: "Easy", ingredients: ["Yogurt", "Berries", "Granola"], image: "🥣" },
  { id: 5, name: "Beef Tacos", category: "Dinner", time: "30 min", difficulty: "Medium", ingredients: ["Ground Beef", "Tortillas", "Lettuce", "Cheese"], image: "🌮" },
  { id: 6, name: "Veggie Fried Rice", category: "Dinner", time: "20 min", difficulty: "Easy", ingredients: ["Rice", "Eggs", "Carrots", "Peas", "Soy Sauce"], image: "🍚" },
  { id: 7, name: "Chocolate Chip Cookies", category: "Desserts", time: "35 min", difficulty: "Easy", ingredients: ["Flour", "Sugar", "Butter", "Chocolate Chips"], image: "🍪" },
  { id: 8, name: "Lemon Garlic Salmon", category: "Dinner", time: "25 min", difficulty: "Easy", ingredients: ["Salmon", "Lemon", "Garlic", "Olive Oil"], image: "🐟" },
  { id: 9, name: "Veggie Omelette", category: "Breakfast", time: "15 min", difficulty: "Easy", ingredients: ["Eggs", "Cheese", "Bell Peppers", "Spinach"], image: "🍳" },
  { id: 10, name: "Banana Smoothie", category: "Breakfast", time: "5 min", difficulty: "Easy", ingredients: ["Banana", "Milk", "Yogurt"], image: "🍌" },
  { id: 11, name: "Chicken Alfredo", category: "Dinner", time: "30 min", difficulty: "Medium", ingredients: ["Chicken", "Pasta", "Milk", "Parmesan"], image: "🍝" },
  { id: 12, name: "Grilled Cheese Sandwich", category: "Lunch", time: "10 min", difficulty: "Easy", ingredients: ["Bread", "Cheddar Cheese", "Butter"], image: "🥪" },
  { id: 13, name: "Peanut Butter Toast", category: "Breakfast", time: "5 min", difficulty: "Easy", ingredients: ["Bread", "Peanut Butter"], image: "🍞" },
  { id: 14, name: "Rice Bowl", category: "Lunch", time: "20 min", difficulty: "Easy", ingredients: ["Rice", "Chicken", "Vegetables"], image: "🍚" },
  { id: 15, name: "Turkey Sandwich", category: "Lunch", time: "10 min", difficulty: "Easy", ingredients: ["Bread", "Turkey", "Lettuce", "Cheese"], image: "🥪" },
  { id: 16, name: "Chicken Noodle Soup", category: "Dinner", time: "40 min", difficulty: "Medium", ingredients: ["Chicken", "Noodles", "Carrots", "Celery"], image: "🍲" },
  { id: 17, name: "Pancakes", category: "Breakfast", time: "20 min", difficulty: "Easy", ingredients: ["Flour", "Milk", "Eggs", "Butter"], image: "🥞" },
  { id: 18, name: "French Toast", category: "Breakfast", time: "15 min", difficulty: "Easy", ingredients: ["Bread", "Eggs", "Milk", "Cinnamon"], image: "🍞" },
  { id: 19, name: "Caesar Salad", category: "Lunch", time: "15 min", difficulty: "Easy", ingredients: ["Lettuce", "Chicken", "Parmesan", "Croutons"], image: "🥗" },
  { id: 20, name: "Mac and Cheese", category: "Dinner", time: "25 min", difficulty: "Easy", ingredients: ["Pasta", "Cheddar Cheese", "Milk", "Butter"], image: "🧀" },
  { id: 21, name: "Baked Potato", category: "Lunch", time: "45 min", difficulty: "Easy", ingredients: ["Potato", "Butter", "Cheese", "Sour Cream"], image: "🥔" },
  { id: 22, name: "Chicken Quesadilla", category: "Dinner", time: "20 min", difficulty: "Easy", ingredients: ["Tortillas", "Chicken", "Cheese", "Bell Peppers"], image: "🌯" },
  { id: 23, name: "Tuna Salad", category: "Lunch", time: "10 min", difficulty: "Easy", ingredients: ["Tuna", "Lettuce", "Mayo", "Celery"], image: "🥗" },
  { id: 24, name: "Egg Salad Sandwich", category: "Lunch", time: "15 min", difficulty: "Easy", ingredients: ["Eggs", "Bread", "Mayo", "Mustard"], image: "🥪" },
  { id: 25, name: "Spaghetti Marinara", category: "Dinner", time: "25 min", difficulty: "Easy", ingredients: ["Pasta", "Tomato Sauce", "Garlic", "Parmesan"], image: "🍝" },
  { id: 26, name: "Garlic Bread", category: "Snacks", time: "12 min", difficulty: "Easy", ingredients: ["Bread", "Butter", "Garlic", "Parsley"], image: "🥖" },
  { id: 27, name: "Fruit Salad", category: "Snacks", time: "10 min", difficulty: "Easy", ingredients: ["Apple", "Banana", "Berries", "Grapes"], image: "🍓" },
  { id: 28, name: "Loaded Nachos", category: "Snacks", time: "15 min", difficulty: "Easy", ingredients: ["Tortilla Chips", "Cheese", "Beans", "Salsa"], image: "🧀" },
  { id: 29, name: "Chicken Caesar Wrap", category: "Lunch", time: "15 min", difficulty: "Easy", ingredients: ["Tortillas", "Chicken", "Lettuce", "Parmesan"], image: "🌯" },
  { id: 30, name: "Breakfast Burrito", category: "Breakfast", time: "20 min", difficulty: "Medium", ingredients: ["Tortillas", "Eggs", "Cheese", "Potato"], image: "🌯" },
  { id: 31, name: "Meatball Subs", category: "Dinner", time: "30 min", difficulty: "Medium", ingredients: ["Bread", "Meatballs", "Tomato Sauce", "Cheese"], image: "🥖" },
  { id: 32, name: "Chicken Parmesan", category: "Dinner", time: "40 min", difficulty: "Medium", ingredients: ["Chicken", "Tomato Sauce", "Mozzarella", "Parmesan"], image: "🍗" },
  { id: 33, name: "Cheese Pizza", category: "Dinner", time: "25 min", difficulty: "Easy", ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil"], image: "🍕" },
  { id: 34, name: "Apple Cinnamon Oatmeal", category: "Breakfast", time: "10 min", difficulty: "Easy", ingredients: ["Oats", "Apple", "Cinnamon", "Milk"], image: "🥣" },
  { id: 35, name: "Avocado Toast", category: "Breakfast", time: "8 min", difficulty: "Easy", ingredients: ["Bread", "Avocado", "Eggs", "Lemon"], image: "🥑" },
  { id: 36, name: "Chicken Salad", category: "Lunch", time: "15 min", difficulty: "Easy", ingredients: ["Chicken", "Mayo", "Celery", "Lettuce"], image: "🥗" },
  { id: 37, name: "Vegetable Soup", category: "Dinner", time: "35 min", difficulty: "Easy", ingredients: ["Carrots", "Celery", "Potato", "Vegetable Broth"], image: "🍲" },
  { id: 38, name: "Shrimp Pasta", category: "Dinner", time: "25 min", difficulty: "Medium", ingredients: ["Shrimp", "Pasta", "Garlic", "Butter"], image: "🍤" },
  { id: 39, name: "BLT Sandwich", category: "Lunch", time: "10 min", difficulty: "Easy", ingredients: ["Bread", "Bacon", "Lettuce", "Tomato"], image: "🥪" },
  { id: 40, name: "Chocolate Mug Cake", category: "Desserts", time: "5 min", difficulty: "Easy", ingredients: ["Flour", "Sugar", "Cocoa Powder", "Milk"], image: "🍫" },
  { id: 41, name: "Brownies", category: "Desserts", time: "35 min", difficulty: "Easy", ingredients: ["Flour", "Sugar", "Cocoa Powder", "Eggs"], image: "🍫" },
  { id: 42, name: "Vanilla Cupcakes", category: "Desserts", time: "30 min", difficulty: "Medium", ingredients: ["Flour", "Sugar", "Eggs", "Butter"], image: "🧁" },
  { id: 43, name: "Strawberry Shortcake", category: "Desserts", time: "30 min", difficulty: "Medium", ingredients: ["Strawberries", "Flour", "Sugar", "Cream"], image: "🍰" },
  { id: 44, name: "Greek Salad", category: "Lunch", time: "15 min", difficulty: "Easy", ingredients: ["Lettuce", "Tomato", "Cucumber", "Feta"], image: "🥗" },
  { id: 45, name: "Chicken Fried Rice", category: "Dinner", time: "25 min", difficulty: "Easy", ingredients: ["Rice", "Chicken", "Eggs", "Soy Sauce"], image: "🍚" },
  { id: 46, name: "Bean Chili", category: "Dinner", time: "45 min", difficulty: "Medium", ingredients: ["Beans", "Tomato Sauce", "Onion", "Chili Powder"], image: "🌶️" },
  { id: 47, name: "Turkey Meatballs", category: "Dinner", time: "35 min", difficulty: "Medium", ingredients: ["Ground Turkey", "Eggs", "Breadcrumbs", "Tomato Sauce"], image: "🍝" },
  { id: 48, name: "Ham and Cheese Omelette", category: "Breakfast", time: "12 min", difficulty: "Easy", ingredients: ["Eggs", "Ham", "Cheese", "Milk"], image: "🍳" },
  { id: 49, name: "Caprese Sandwich", category: "Lunch", time: "10 min", difficulty: "Easy", ingredients: ["Bread", "Tomato", "Mozzarella", "Basil"], image: "🥪" },
  { id: 50, name: "Chicken Pot Pie", category: "Dinner", time: "50 min", difficulty: "Medium", ingredients: ["Chicken", "Carrots", "Peas", "Pie Crust"], image: "🥧" },
];

function Recipes({ items = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
  });

  const pantryIngredientText = items
    .map((item) => `${item.name} ${item.category}`)
    .join(" ")
    .toLowerCase();

  const recipeWithMatches = RECIPE_DATA.map((recipe) => {
    const matchedIngredients = recipe.ingredients.filter((ingredient) =>
      pantryIngredientText.includes(ingredient.toLowerCase())
    );

    return {
      ...recipe,
      matchedCount: matchedIngredients.length,
      canMake: matchedIngredients.length === recipe.ingredients.length,
    };
  });

  const filteredRecipes = useMemo(() => {
    return recipeWithMatches.filter((recipe) => {
      const matchesSearch = recipe.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        recipe.category === selectedCategory;

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "makeable" && recipe.canMake) ||
        (activeTab === "saved" && favorites.includes(recipe.id));

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [searchTerm, selectedCategory, activeTab, favorites, recipeWithMatches]);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory, searchTerm]);

  const toggleFavorite = (id) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((recipeId) => recipeId !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
  };

  const findMakeableRecipes = () => {
    setActiveTab("makeable");
    setCurrentPage(1);
  };

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <div className="recipes-title-row">
          <div className="recipes-icon">👨‍🍳</div>

          <div>
            <h1>Recipes</h1>
            <p>Discover recipes and make the most of what you have.</p>
          </div>
        </div>

        <div className="recipes-search-actions">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snacks</option>
            <option>Desserts</option>
          </select>
        </div>
      </div>

      <div className="recipes-tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All Recipes
        </button>

        <button
          className={activeTab === "makeable" ? "active" : ""}
          onClick={() => setActiveTab("makeable")}
        >
          Makeable
        </button>

        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      <div className="recipes-layout">
        <aside className="recipes-sidebar">
          <h3>Categories</h3>

          {[
            "All Categories",
            "Breakfast",
            "Lunch",
            "Dinner",
            "Snacks",
            "Desserts",
          ].map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              <span>{category}</span>
              <small>
                {
                  recipeWithMatches.filter(
                    (recipe) =>
                      category === "All Categories" ||
                      recipe.category === category
                  ).length
                }
              </small>
            </button>
          ))}

          <div className="cook-card">
            <div>🥘</div>
            <h4>Cook with what you have</h4>
            <p>Get recipe ideas based on the ingredients in your pantry.</p>
            <button onClick={findMakeableRecipes}>Find Recipes</button>
          </div>
        </aside>

        <section className="recipes-content">
          <div className="recipes-section-title">
            <h2>
              {activeTab === "makeable"
                ? "Recipes You Can Make"
                : activeTab === "saved"
                ? "Saved Recipes"
                : "Recommended for You"}
            </h2>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h2>No recipes found</h2>
              <button className="empty-btn" onClick={() => setActiveTab("all")}>
                Browse recipes
              </button>
            </div>
          ) : (
            <>
              <div className="recipe-card-grid">
                {paginatedRecipes.map((recipe) => (
                  <div className="recipe-card" key={recipe.id}>
                    <div className="recipe-image">
                      <span>{recipe.image}</span>

                      <button
                        className={
                          favorites.includes(recipe.id)
                            ? "favorite-btn active"
                            : "favorite-btn"
                        }
                        onClick={() => toggleFavorite(recipe.id)}
                      >
                        ♥
                      </button>
                    </div>

                    <div className="recipe-info">
                      <h3>{recipe.name}</h3>

                      <p className="recipe-meta">
                        ⏱ {recipe.time} · {recipe.difficulty}
                      </p>

                      <p className="recipe-uses">
                        Uses: {recipe.ingredients.join(", ")}
                      </p>

                      <div className="recipe-bottom-row">
                        <span>
                          {recipe.matchedCount}/{recipe.ingredients.length}{" "}
                          ingredients
                        </span>

                        {recipe.canMake && <strong>Can Make</strong>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="recipe-pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Recipes;