import '../styles/Fridge.css';
import React, { useState, useEffect, useMemo } from 'react';
import Hamburger from '../components/Hamburger.js';

const DUMMY_FOOD_DATA = [
  { id: 1, name: 'Milk', quantity: 1, expiryDate: '2025-11-01' },
  { id: 2, name: 'Eggs', quantity: 12, expiryDate: '2025-10-28' },
  { id: 3, name: 'Apples', quantity: 5, expiryDate: '2025-11-15' },
  { id: 4, name: 'Spinach', quantity: 1, expiryDate: '2025-10-26' },
];

const Fridge = () => {

  const [foodItems, setFoodItems] = useState([]); // All items from the backend
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expiry'); // 'expiry' or 'alphabetical'

  useEffect(() => {
    // In a real app, you'd fetch data for the logged-in user here
    // const token = localStorage.getItem('userToken');
    // fetch('/api/user/fridge', { headers: { 'Authorization': `Bearer ${token}` } })
    // .then(res => res.json()).then(data => setFoodItems(data));

    // For now, use dummy data
    setFoodItems(DUMMY_FOOD_DATA);
  }, []);

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

  return (    
    // 2. Wrap the entire page content with a class for layout
    <div className="fridge-page"> 
        <Hamburger /> 
        <h1 className="title">Your Fridge</h1>

        {/* 3. Controls Wrapper for side-by-side search/filter */}
        <div className="controls-wrapper"> 
            
            {/* Search Bar */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <label htmlFor="sort-select">Sort By:</label>
                <select id="sort-select" value={sortBy} onChange={handleSortChange}>
                    <option value="expiry">Expiration Date (Soonest First)</option>
                    <option value="alphabetical">Item Name (A-Z)</option>
                </select>
            </div>
        </div>
      
        {/* 4. Display Foods Box - This will now be centered by .fridge-page */}
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
    </div>
  );
}

export default Fridge
