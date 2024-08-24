import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import "./RestaurantListingPage.css";

const RestaurantListingPage = () => {
  const { ecoMode } = useEcom();
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('https://food-delivery-c1lp.onrender.com/api/restaurants')
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setRestaurants([]);
        }
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]);
      });
  }, []);

  const filteredRestaurants = Array.isArray(restaurants) ? restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className={`restaurant-listing-101 ${ecoMode ? 'eco-mode-101' : ''}`}>
      <h1 className="page-title-101">African Cuisine Explorer</h1>
      <div className="search-container-101">
        <input
          type="text"
          placeholder="Search restaurants or cuisines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-101"
        />
      </div>
      <div className="restaurant-grid-101">
        {filteredRestaurants.map(restaurant => (
          <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className="restaurant-card-101">
            <div className="card-image-container-101">
              <img
                src={`https://food-delivery-c1lp.onrender.com${restaurant.image}`}
                alt={restaurant.name}
                className="restaurant-thumbnail-101"
              />
              <div className="rating-badge-101">{restaurant.rating}</div>
            </div>
            <div className="restaurant-info-101">
              <h2>{restaurant.name}</h2>
              <p className="cuisine-type-101">{restaurant.cuisineType}</p>
              <p className="address-101">{restaurant.address}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantListingPage;