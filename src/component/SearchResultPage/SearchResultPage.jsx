import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import { useAuth } from "../../Context/AuthContext";
import { toast } from 'react-toastify';
import "./SearchResultPage.css";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchTerm = new URLSearchParams(location.search).get("q");
  const { addToCart, ecoMode } = useEcom();
  const { isLoggedIn } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchInput, setSearchInput] = useState(searchTerm || "");

  useEffect(() => {
    if (searchTerm) {
      fetchResults(searchTerm);
    }
  }, [searchTerm]);

  const fetchResults = (term) => {
    // Fetch restaurants
    fetch(`https://food-delivery-api-rcff.onrender.com/api/restaurants?search=${term}`)
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurants:', error));

    // Fetch menu items
    fetch(`https://food-delivery-api-rcff.onrender.com/api/menu?search=${term}`)
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Error fetching menu items:', error));
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart`, {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className={`search-results-page ${ecoMode ? 'eco-mode' : ''}`}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for restaurants or menu items"
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <h1>Search Results for "{searchTerm}"</h1>

      <section className="restaurants-section">
        <h2>Restaurants</h2>
        <div className="restaurant-grid">
          {restaurants.map(restaurant => (
            <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className="restaurant-card">
              <div className="card-image">
                <img src={`https://food-delivery-api-rcff.onrender.com${restaurant.image}`} alt={restaurant.name} />
              </div>
              <div className="card-content">
                <h3>{restaurant.name}</h3>
                <p className="cuisine-type">{restaurant.cuisineType}</p>
                <p className="rating">Rating: {restaurant.rating}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="menu-items-section">
        <h2>Menu Items</h2>
        <div className="menu-item-grid">
          {menuItems.map(item => (
            <div key={item._id} className="menu-item-card">
              <div className="card-image">
                <img src={`https://food-delivery-api-rcff.onrender.com/uploads/${item.image}`} alt={item.name} />
              </div>
              <div className="card-content">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <p className="price">₦{item.price}</p>
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchResultsPage;