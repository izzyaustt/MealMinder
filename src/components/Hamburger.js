import '../styles/Hamburger.css';
import Hamburger from 'hamburger-react'
import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

const MENU_ITEMS = [
  { name: 'Your Fridge', path: '/myfridge' },
  { name: 'Upload Receipt', path: '/upload' },
  { name: 'Recipes', path: '/recipes' },
];


const HamburgerNav = () => {

  const [isOpen, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (    
    <div>

        <div className="hamburger">
          <Hamburger toggled={isOpen} toggle={setOpen} color="#856B59"/>
        </div>

        {isOpen && (
            // Apply a class for styling (e.g., slide-in sidebar)
            <nav className="sidebar-menu"> 
                {MENU_ITEMS.map((item) => (
                    // 2. Use the Link component for navigation
                    <Link 
                        key={item.name} 
                        to={item.path}
                        className="menu-link"
                        onClick={handleLinkClick} // 3. Close the menu on click
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        )}
    </div>
  )
}

export default HamburgerNav