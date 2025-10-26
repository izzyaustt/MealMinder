import '../styles/Fridge.css';
import React, { useState, useEffect, useMemo } from 'react';
import Hamburger from '../components/Hamburger.jsx';
import { useInventoryData } from '../Frontend/Hooks/useInventoryData.js';
import { addInventoryItem } from '../Frontend/inventoryApi.js';

const DUMMY_FOOD_DATA = [
  { id: 1, name: 'Milk', quantity: 1, expiryDate: '2025-11-01' },
  { id: 2, name: 'Eggs', quantity: 12, expiryDate: '2025-10-28' },
  { id: 3, name: 'Apples', quantity: 5, expiryDate: '2025-11-15' },
  { id: 4, name: 'Spinach', quantity: 1, expiryDate: '2025-10-26' },
];

const Fridge = () => {
  const { inventory, userId, isAuthReady } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expiry'); // 'expiry' or 'alphabetical'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    expiryDate: ''
  });

  // Use real Firebase data instead of dummy data
  const foodItems = inventory;

  const calculateDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAndSortedItems = useMemo(() => {
    let currentItems = [...foodItems];

    // Apply Search Filter
    if (searchTerm) {
        currentItems = currentItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply Sorting
    currentItems.sort((a, b) => {
        if (sortBy === 'alphabetical') {
            return a.name.localeCompare(b.name);
        }
        // Default and 'expiry' sort
        const daysA = calculateDaysRemaining(a.expiryDate);
        const daysB = calculateDaysRemaining(b.expiryDate);
        return daysA - daysB; // Sort ascending (closest to expiry first)
    });

    return currentItems;
  }, [foodItems, searchTerm, sortBy]);

  // 5. Handlers
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!userId || !newItem.name || !newItem.expiryDate) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const itemData = {
                itemName: newItem.name,
                quantity: parseInt(newItem.quantity),
                expiryDate: new Date(newItem.expiryDate)
            };
            
            await addInventoryItem(userId, itemData);
            
            // Reset form and close modal
            setNewItem({ name: '', quantity: 1, expiryDate: '' });
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

  return (    
    <div className="fridge-page"> 
        <Hamburger /> 
        <h1 className="title">Your Fridge</h1>

        <div className="controls-wrapper"> 
            <div className="add-item-section">
                <button 
                    className="add-item-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Food Item
                </button>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="filter-bar">
              <label htmlFor="sort-select">Sort By:</label>
                <select id="sort-select" value={sortBy} onChange={handleSortChange}>
                    <option value="expiry">Expiration Date (Soonest First)</option>
                    <option value="alphabetical">Item Name (A-Z)</option>
                </select>
            </div>
        </div>
      
        <div className="display-foods">
            <div className="list-header item-columns">
                <div className="item-column item-name-col"><strong>Item</strong></div>
                <div className="item-column item-quantity-col"><strong>Qty</strong></div>
                <div className="item-column item-expiry-col"><strong>Days Left</strong></div>
            </div>
            <hr/>
            {filteredAndSortedItems.length > 0 ? (
                filteredAndSortedItems.map(item => (
                    <div 
                        key={item.id} 
                        className={`food-item ${calculateDaysRemaining(item.expiryDate) < 3 ? 'expiring-soon' : ''}`}
                    >
                        <div className="item-columns"> 
                            {/* Column 1: Item Name */}
                            <div className="item-column item-name-col">
                                <strong>{item.name}</strong>
                            </div>

                            {/* Column 2: Quantity */}
                            <div className="item-column item-quantity-col">
                                {item.quantity}
                            </div>

                            {/* Column 3: Days Remaining / Expiry Status */}
                            <div className="item-column item-expiry-col">
                                {calculateDaysRemaining(item.expiryDate) <= 0 ? (
                                    <span className="expired">EXPIRED!</span>
                                ) : (
                                    <span>{calculateDaysRemaining(item.expiryDate)} days</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{textAlign: 'center', padding: '20px'}}>No items found. Try uploading a receipt!</p>
            )}
        </div>

        {/* Add Food Item Modal */}
        {showAddForm && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Add Food Item</h2>
                    <form onSubmit={handleAddItem}>
                        <div className="form-group">
                            <label htmlFor="name">Item Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newItem.name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Milk, Apples, Bread"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date:</label>
                            <input
                                type="date"
                                id="expiryDate"
                                name="expiryDate"
                                value={newItem.expiryDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </button>
                            <button type="submit">
                                Add Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}

export default Fridge
