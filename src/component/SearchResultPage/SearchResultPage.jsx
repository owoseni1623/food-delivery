import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import { useAuth } from "../../Context/AuthContext";
import { toast } from 'react-toastify';
import "./SearchResultPage.css";

const SearchResultsPage = () => {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("q");
  const { addToCart, ecoMode } = useEcom();
  const { isLoggedIn } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch restaurants
    fetch(`https://food-delivery-api-rcff.onrender.com/api/restaurants?search=${searchTerm}`)
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurants:', error));

    // Fetch menu items
    fetch(`https://food-delivery-api-rcff.onrender.com/api/menu?search=${searchTerm}`)
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Error fetching menu items:', error));
  }, [searchTerm]);

  const handleAddToCart = (item) => {
    if (isLoggedIn) {
      addToCart(item);
      toast.success(`${item.name} added to cart`, {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.error("Please log in to add items to your cart.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={`search-results-page ${ecoMode ? 'eco-mode' : ''}`}>
      <h1>Search Results for "{searchTerm}"</h1>

      <h2>Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.map(restaurant => (
          <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className="restaurant-card">
            <img src={`https://food-delivery-api-rcff.onrender.com${restaurant.image}`} alt={restaurant.name} />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisineType}</p>
            <p>Rating: {restaurant.rating}</p>
          </Link>
        ))}
      </div>

      <h2>Menu Items</h2>
      <div className="menu-item-grid">
        {menuItems.map(item => (
          <div key={item._id} className="menu-item-card">
            <img src={`https://food-delivery-api-rcff.onrender.com/uploads/${item.image}`} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>₦{item.price}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;