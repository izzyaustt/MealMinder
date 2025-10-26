import React, { useState } from 'react';
import Hamburger from '../components/Hamburger.js'; 
import '../styles/Recipes.css';

// =================================================================
// DUMMY DATA
// =================================================================
const DUMMY_FRIDGE_INVENTORY = [
    { id: 'milk', name: 'Milk', quantity: '1' },
    { id: 'eggs', name: 'Eggs', quantity: '1' },
    { id: 'rice', name: 'Leftover White Rice', quantity: '4' },
    { id: 'chicken', name: 'Chicken Breast', quantity: '1' },
    { id: 'broccoli', name: 'Broccoli', quantity: '7' },
    { id: 'onion', name: 'Onion', quantity: '8' },
    { id: 'cheese', name: 'Cheddar Cheese', quantity: '3' },
];

const DUMMY_SAVED_RECIPES = [
    { 
        id: 1, 
        title: 'Onion Egg Scramble', 
        ingredients: [
            '2 tablespoons butter', 
            '1 small onion diced small', 
            '5 eggs scrambled with a fork', 
            'salt & pepper to taste', 
            'cheese optional'
        ],
        instructions: 'Melt the butter in a skillet heated to medium heat. Saute the diced onions in the skillet until...'
    },
];

// =================================================================
// HELPER FUNCTION TO PARSE MULTIPLE AI OUTPUTS
// =================================================================
const parseRawRecipesText = (rawText) => {
    const recipes = [];
    
    // 1. Split the text using strong delimiters (--- or numbered headings)
    const recipeBlocks = rawText.split(/\s*---\s*|\s*#\s*\d+\.\s*/).filter(block => block.trim().length > 0);

    // If initial split failed, try splitting by numbered titles
    if (recipeBlocks.length < 2) {
        const numberedBlocks = rawText.split(/(\d+\.\s*[^\n]+)/).filter(block => block.trim().length > 0);
        
        let currentBlock = '';
        const reassembledBlocks = [];
        for (const block of numberedBlocks) {
            if (block.match(/^\d+\.\s*[^\n]+/)) {
                if (currentBlock) {
                    reassembledBlocks.push(currentBlock);
                }
                currentBlock = block.trim();
            } else {
                currentBlock += block;
            }
        }
        if (currentBlock) {
             reassembledBlocks.push(currentBlock);
        }
        recipeBlocks.splice(0, recipeBlocks.length, ...reassembledBlocks);
    }
    
    // 2. Iterate and parse each block
    for (const block of recipeBlocks) {
        let currentRecipe = {
            title: 'Untitled Recipe',
            ingredients: [],
            instructions: 'Instructions could not be parsed.',
            rawText: block,
        };

        // A. Extract Title
        const titleMatch = block.match(/^(.*?)(?:\n|$)/);
        if (titleMatch && titleMatch[1].trim()) {
            currentRecipe.title = titleMatch[1].trim().replace(/^\d+\.\s*/, '');
        }

        // B. Extract Ingredients
        const ingredientsMatch = block.match(/(?:Ingredients Needed|Ingredients|INGREDIENTS):\s*([\s\S]*?)(?:\n\s*(?:Instructions|Step-by-Step Instructions|Instructions:|\n\s*\n|$))/i);
        if (ingredientsMatch && ingredientsMatch[1]) {
            currentRecipe.ingredients = ingredientsMatch[1].split('\n')
                .map(line => line.trim().replace(/^- |^\* |^\d+\. /g, '').trim())
                .filter(line => line.length > 0);
        }

        // C. Extract Instructions
        const instructionsMatch = block.match(/(?:Instructions|INSTRUCTIONS|Step-by-Step Instructions):\s*([\s\S]*)/i);
        if (instructionsMatch && instructionsMatch[1]) {
            currentRecipe.instructions = instructionsMatch[1].trim();
        }

        recipes.push(currentRecipe);
    }
    
    return recipes.length > 0 ? recipes : [{ title: "Parsing Failed", ingredients: ["See raw output for details."], instructions: rawText, rawText: rawText }];
};

// =================================================================
// SAVED RECIPES CONTENT
// =================================================================
const SavedRecipesContent = () => (
    <div className="tab-content saved-tab-content">
        <div className="saved-list">
            {DUMMY_SAVED_RECIPES.map(recipe => (
                <div key={recipe.id} className="recipe-card-box">
                    <div className="recipe-header-row">
                        <h3 className="recipe-title-text">{recipe.title}</h3>
                        <span className="arrow-icon">→</span>
                        <span className="edit-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#856B59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5l4 4L7.5 20H3v-4.5L16.5 3.5z"/></svg>
                        </span>
                    </div>

                    <p className="section-heading">Ingredients</p>
                    <ul className="recipe-ingredients">
                        {recipe.ingredients.map((ing, index) => <li key={index}>- {ing}</li>)}
                    </ul>

                    <p className="section-heading">Instructions</p>
                    <p className="recipe-instructions">
                        - {recipe.instructions}
                    </p>
                </div>
            ))}
        </div>
    </div>
);


// =================================================================
// AI RECIPE GENERATOR CONTENT
// =================================================================
const AIRecipeGeneratorContent = () => {
    
    const [selectedItems, setSelectedItems] = useState([]);
    const [recipes, setRecipes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // FIX: Restoring the missing function definition for handleItemToggle
    const handleItemToggle = (itemId) => {
        setSelectedItems(prevItems =>
            prevItems.includes(itemId)
                ? prevItems.filter(id => id !== itemId)
                : [...prevItems, itemId]
        );
    };

    // FIX: Restoring the missing function definition for getPromptItems
    const getPromptItems = () => {
        return DUMMY_FRIDGE_INVENTORY
            .filter(item => selectedItems.includes(item.id))
            .map(item => item.name);
    };

    const generateRecipe = async () => {
        const items = getPromptItems();
        if (items.length === 0) {
            setError("Please select at least one ingredient from your fridge.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setRecipes(null);
        
        try {
            const response = await fetch('http://localhost:5001/generate-recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: items }), 
            });
            
            const data = await response.json();

            if (!response.ok || data.error) {
                setError(`Failed to generate recipe: ${data.details?.message || data.error || 'Server error'}`);
                return;
            }
            
            const rawText = data.recipes;
            
            const parsedRecipes = parseRawRecipesText(rawText);
            setRecipes(parsedRecipes);
            
        } catch (err) {
            console.error("Fetch error:", err);
            setError(`Network error. Make sure the backend is running on http://localhost:5001. Details: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tab-content generator-content">
            
            <h3 className="generator-prompt-heading">Your Fridge Inventory</h3>
            <p>Select the ingredients you want to use to generate a recipe:</p>

            <div className="fridge-inventory-list">
                {DUMMY_FRIDGE_INVENTORY.map(item => (
                    <label key={item.id} className={`fridge-item-label ${selectedItems.includes(item.id) ? 'selected' : ''}`}>
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemToggle(item.id)} // Function is now defined
                            style={{marginRight: '8px'}}
                        />
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity" style={{color: '#888', fontSize: '0.9em', marginLeft: '10px'}}>({item.quantity})</span>
                    </label>
                ))}
            </div>

            <button 
                onClick={generateRecipe} 
                disabled={isLoading || selectedItems.length === 0}
                className="generate-button"
            >
                {isLoading ? 'Generating...' : `Generate Recipe with ${selectedItems.length} Item(s)`}
            </button>
            
            {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>⚠️ {error}</p>}

            {recipes && recipes.map((recipe, index) => (
                <div key={index} className="recipe-output recipe-card-box" style={{marginTop: '20px'}}>
                    <div className="recipe-header-row">
                        <h3 className="recipe-title-text">{recipe.title}</h3>
                    </div>
                    
                    <p className="section-heading">Ingredients</p>
                    <ul className="recipe-ingredients">
                        {recipe.ingredients.map((ing, ingIndex) => <li key={ingIndex}>- {ing}</li>)}
                    </ul>

                    <p className="section-heading">Instructions</p>
                    <p className="recipe-instructions" style={{ whiteSpace: 'pre-wrap' }}> 
                        {recipe.instructions}
                    </p>
                    <button className="save-button">Save Recipe</button>
                     
                    {recipe.rawText && (
                        <details style={{ marginTop: '15px', fontSize: '0.8em', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                            <summary>Show Raw AI Output (Recipe {index + 1})</summary>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>{recipe.rawText}</pre>
                        </details>
                    )}
                </div>
            ))}
        </div>
    );
};


// =================================================================
// RECIPE PAGE (Main Component)
// =================================================================
const RecipePage = () => {
    const [activeTab, setActiveTab] = useState('saved');

    return (
        <div className="recipe-page">
            <Hamburger />
            <h1 className="title">Recipes</h1>
            
            <div className="tab-container">
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        Saved
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
                        onClick={() => setActiveTab('generate')}
                    >
                        Generate
                    </button>
                </div>

                <div className="tab-content-wrapper">
                    {activeTab === 'saved' && <SavedRecipesContent />}
                    {activeTab === 'generate' && <AIRecipeGeneratorContent />}
                </div>
            </div>
        </div>
    );
};

export default RecipePage;