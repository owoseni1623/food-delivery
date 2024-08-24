import React, { useState } from "react";
import { useEcom } from "../../Context/EcomContext";
import { useAuth } from "../../Context/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./MenuPage.css";

const MenuPage = () => {
  const { addToCart, ecoMode, menuData, loading, error, fetchMenuData } = useEcom();
  const { isLoggedIn } = useAuth();
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "https://food-delivery-api-rcff.onrender.com";

  const openModal = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const filledStars = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star022 ${i <= filledStars ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const renderRating = (rating) => {
    return (
      <>
        {renderStars(rating)} {rating ? `(${rating.toFixed(1)})` : ''}
      </>
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiUrl}/uploads/${imagePath.split('/').pop()}`;
  };

  const handleAddToCart = (food) => {
    if (isLoggedIn) {
      const itemToAdd = {
        ...food,
        id: food._id,
        image: getImageUrl(food.image)
      };
      addToCart(itemToAdd);
      toast.success(`${food.name} added to cart`, {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchMenuData}>Try Again</button>
      </div>
    );
  }

  if (!menuData || menuData.length === 0) {
    return <div>No menu items available.</div>;
  }

  return (
    <div className={`menu-page022 ${ecoMode ? 'eco-mode022' : ''}`}>
      <ToastContainer />
      <h1 className="title022">Menu Page</h1>
      {isLoggedIn && (
        <button onClick={() => setIsAddingItem(!isAddingItem)} className="add-item-btn022">
          {isAddingItem ? 'Cancel' : 'Add New Item'}
        </button>
      )}
      
      <div className="food-grid022">
        {menuData.map((food) => (
          <div key={food._id} className="food-card022">
            <img src={getImageUrl(food.image)} alt={food.name} onClick={() => openModal(food)} />
            <h3>{food.name}</h3>
            <p>{food.description}</p>
            <p className="price022">₦{food.price}</p>
            <p className="rating022">
              Rating: {renderRating(food.rating || 3.5)}
            </p>
            <button onClick={() => handleAddToCart(food)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedFood && (
        <div className="modal022">
          <div className="modal-content022">
            <span className="close022" onClick={closeModal}>&times;</span>
            <img src={getImageUrl(selectedFood.image)} alt={selectedFood.name} />
            <h2>{selectedFood.name}</h2>
            <p>{selectedFood.description}</p>
            <p className="price022">₦{selectedFood.price}</p>
            <p className="rating022">
              Rating: {renderRating(selectedFood.rating || 3.5)}
            </p>
            <button onClick={() => {
              handleAddToCart(selectedFood);
              closeModal();
            }}>Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;