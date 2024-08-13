import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./RestaurantDetailsPage.css";

const RestaurantDetailsPage = () => {
    const { id } = useParams();
    const { ecoMode, addToCart } = useEcom();
    const [restaurant, setRestaurant] = useState(null);
    const [location, setLocation] = useState(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/restaurants/${id}`)
            .then(response => {
                if (!response.ok) {
                    console.error('Response not OK:', response.status, response.statusText);
                    throw new Error('Failed to fetch restaurant details');
                }
                return response.json();
            })
            .then(data => {
                console.log('Received restaurant data:', data);
                setRestaurant(data);
            })
            .catch(error => {
                console.error('Error fetching restaurant details:', error);
                setError(error.message);
            });
    }, [id]);

    if (error) {
        return <div className="error-102">Error: {error}</div>;
    }

    if (!restaurant) {
        return <div className="loading-102">Loading...</div>;
    }

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setIsLocationModalOpen(true);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setError("Unable to retrieve your location. Please try again.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    const closeLocationModal = () => setIsLocationModalOpen(false);

    const isOpenNow = () => {
        if (!restaurant.openingHours) return false;
    
        const parseTime = (timeStr) => {
            if (!timeStr) return null;
            timeStr = timeStr.toLowerCase().replace(/\s/g, '');
            const isPM = timeStr.includes('pm');
            const [hoursStr, minutesStr] = timeStr.replace(/[ap]m/, '').split(':');
            let hours = parseInt(hoursStr);
            const minutes = minutesStr ? parseInt(minutesStr) : 0;
    
            if (isNaN(hours) || isNaN(minutes)) return null;
            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
    
            return hours * 60 + minutes;
        };
    
        const [openTime, closeTime] = restaurant.openingHours.split('-').map(t => t.trim());
        
        const openMinutes = parseTime(openTime);
        const closeMinutes = parseTime(closeTime);
    
        if (openMinutes === null || closeMinutes === null) return false;
    
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
        if (closeMinutes > openMinutes) {
            return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
        } else {
            return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
        }
    };

    const openStatus = isOpenNow();
    const hoursClass = openStatus ? "open-now-102" : "closed-now-102";

    const handleAddToCart = (event, item) => {
        event.preventDefault();
        event.stopPropagation();
    
        addToCart({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        });
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {'★'.repeat(fullStars)}
                {hasHalfStar ? '½' : ''}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    const renderMenuItems = () => {
        return (
            <div className="menu-categories-container-102">
                {restaurant.menu.map((item) => (
                    <div key={item._id} className="menu-item-102">
                        <h3 className="category-title-102">{item.category}</h3>
                        <img src={`http://localhost:3000${item.image}`} alt={item.name} className="menu-item-image-102" />
                        <h4>{item.name}</h4>
                        <p className="item-description-102">{item.description}</p>
                        <p className="item-price-102">₦{item.price.toFixed(2)}</p>
                        <button onClick={(e) => handleAddToCart(e, item)} className="add-to-cart-102">Add to Cart</button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`restaurant-details-102 ${ecoMode ? 'eco-mode-102' : ''}`}>
            <div className="restaurant-header-102">
                <img
                    src={`http://localhost:3000${restaurant.image}`}
                    alt={restaurant.name}
                    className="restaurant-image-102"
                />
                <div className="restaurant-info-102">
                    <h1>{restaurant.name}</h1>
                    <p className="cuisine-type-102">{restaurant.cuisineType}</p>
                    <p className="rating-102">
                        <span className="star-rating">
                            {renderStars(restaurant.rating)}
                        </span>
                        <span className="numeric-rating">{restaurant.rating.toFixed(1)}</span>
                    </p>
                    <p className="address-102">{restaurant.address}</p>
                    <p className="hours-102">
                        <span className={hoursClass}>
                            {openStatus ? "Open" : "Closed"}
                        </span>
                        {" "}
                        <span>
                            ({restaurant.openingHours})
                        </span>
                    </p>
                </div>
            </div>

            <h2 className="menu-title-102">Menu</h2>
            {renderMenuItems()}

            <h2 className="location-title-102">Location</h2>
            <div className="location-container-102">
                <button onClick={getCurrentLocation} className="get-location-102">Get Current Location</button>
                {isLocationModalOpen && (
                    <div className="modal-overlay-102">
                        <div className="modal-content-102 location-modal-102">
                            <span className="close-button-102" onClick={closeLocationModal}>&times;</span>
                            <h2>Your Current Location</h2>
                            {location && (
                                <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ height: '300px', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[location.latitude, location.longitude]}>
                                        <Popup>Your current location</Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantDetailsPage;