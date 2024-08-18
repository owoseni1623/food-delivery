import React, { useState, useEffect } from "react";
import { useEcom } from "../../Context/EcomContext";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./MenuPage.css";

const MenuPage = () => {
  const { addToCart, ecoMode } = useEcom();
  const { isLoggedIn } = useAuth();
  const [menuData, setMenuData] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://food-delivery-api-rcff.onrender.com/api/menu/getAll');
      setMenuData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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

  const handleAddToCart = (food) => {
    if (isLoggedIn) {
      const itemToAdd = {
        ...food,
        id: food._id,
        image: `/uploads/${food.image}`
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('category', newItem.category);
    formData.append('image', imageFile);

    try {
      const response = await axios.post('https://roadrunner-food-ordering-api-4.onrender.com/api/menu/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setIsAddingItem(false);
      fetchMenuData();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={`menu-page022 ${ecoMode ? 'eco-mode022' : ''}`}>
      <ToastContainer />
      <h1 className="title022">Menu Page</h1>
      {isLoggedIn && (
        <button onClick={() => setIsAddingItem(!isAddingItem)} className="add-item-btn022">
          {isAddingItem ? "Cancel" : ""}
        </button>
      )}
      {isAddingItem && (
        <form onSubmit={handleSubmit} className="add-item-form022" encType="multipart/form-data">
          <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
          <input type="text" name="description" placeholder="Description" onChange={handleInputChange} required />
          <input type="number" name="price" placeholder="Price" onChange={handleInputChange} required />
          <input type="text" name="category" placeholder="Category" onChange={handleInputChange} required />
          <input type="file" name="image" onChange={handleFileChange} required />
          <button type="submit">Add Item</button>
        </form>
      )}
      <div className="food-grid022">
        {menuData.map((food) => (
          <div key={food._id} className="food-card022">
            <img src={`https://roadrunner-food-ordering-api-4.onrender.com/uploads/${food.image}`} alt={food.name} onClick={() => openModal(food)} />
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
            <img src={`https://roadrunner-food-ordering-api-4.onrender.com/uploads/${selectedFood.image}`} alt={selectedFood.name} />
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