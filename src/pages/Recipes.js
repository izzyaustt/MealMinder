import '../styles/Recipes.css';
import React, { useState } from 'react';
import Hamburger from '../components/Hamburger.js';

// Component for the Saved Recipes content
const SavedRecipesContent = () => (
    <div className="tab-content">
        <div className="saved-list">
            {/* Map over your saved recipe data here */}
            <p className="placeholder-item">Placeholder Recipe 1: Chicken Stir-fry</p>
            <p className="placeholder-item">Placeholder Recipe 2: Tomato Soup</p>
        </div>
    </div>
);

// Component for the AI Recipe Generator content
const AIRecipeGeneratorContent = () => {
    const [prompt, setPrompt] = useState('');
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder for AI Generation API call
    const generateRecipe = () => {
        if (!prompt) return;

        setIsLoading(true);
        setRecipe(null);
        
        // --- TODO: Add Gemini API call for recipe generation here ---
        
        // Simulate an API call delay
        setTimeout(() => {
            const mockRecipe = {
                title: "Mock AI Recipe: Quick Bread",
                ingredients: ["2 cups flour", "1 cup milk", "1 egg", "1 tsp baking powder"],
                instructions: "Mix wet and dry ingredients separately, then combine. Bake at 375°F for 30 minutes."
            };
            setRecipe(mockRecipe);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="tab-content generator-content">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: I have leftover rice, chicken, and broccoli. Make me a dinner idea."
            />
            <button 
                onClick={generateRecipe} 
                disabled={isLoading || !prompt}
                className="generate-button"
            >
                {isLoading ? 'Generating...' : 'Generate Recipe'}
            </button>
            
            {recipe && (
                <div className="recipe-output">
                    <h3>{recipe.title}</h3>
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        {recipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)}
                    </ul>
                    <p><strong>Instructions:</strong> {recipe.instructions}</p>
                    <button className="save-button">Save Recipe</button>
                </div>
            )}
        </div>
    );
};


const Recipes = () => {

    const [toggleState, setToggleState] = useState(1); //changes state

    const toggleTab = (index) => {
        setToggleState(index);
    }

  return (    
    <div>
        <Hamburger />
        <div className="container">
            {/* Tab Buttons */}
            <div className="bloc-tabs">
                <div 
                    className={toggleState === 1 ? "tabs active-tabs" : "tabs"} 
                    onClick={() => toggleTab(1)}>Saved</div>
                <div className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(2)}>Generate</div>

                
            </div>

            <div className="content-tabs">

                {/* Tab Content (Conditional Rendering) */}
                <div className={toggleState === 1 ? "content active-content" : "content"}>
                    
                    <h>test</h>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Recipes