export const restaurants = [
    {
      id: 1,
      name: "Mama's African Kitchen",
      thumbnail: "/images/kitchen.jpg",
      cuisineType: "West African",
      rating: 4.5,
      address: "123 Main St, Cityville",
      openingHours: "10:00 AM - 10:00 PM",
      location: { lat: 40.7128, lng: -74.0060 },
      menu: [
        { id: 101, name: "Jollof Rice", price: 12.99, description: "Spicy West African rice dish" },
        { id: 102, name: "Pap and Chakalaka", price: 9.99, description: "Traditional South African cornmeal porridge with spicy vegetable relish" },
        { id: 103, name: "Fufu and Egusi Soup", price: 14.99, description: "Cassava dough with melon seed soup" }
      ]
    },
    {
      id: 2,
      name: "Savannah Grill",
      thumbnail: "/images/kitchen1.jpg",
      cuisineType: "African Fusion",
      rating: 4.2,
      address: "456 Oak Ave, Townsburg",
      openingHours: "11:00 AM - 11:00 PM",
      location: { lat: 40.7305, lng: -73.9925 },
      menu: [
        { id: 201, name: "Bobotie", price: 14.99, description: "South African curried meat dish" },
        { id: 202, name: "Suya Kebabs", price: 11.99, description: "Spicy grilled meat skewers" },
        { id: 203, name: "Peanut Stew", price: 13.99, description: "Creamy West African peanut soup" }
      ]
    },
    {
      id: 3,
      name: "Ethiopian Delights",
      thumbnail: "/images/kitchen2.jpg",
      cuisineType: "Ethiopian",
      rating: 4.7,
      address: "789 Spice Lane, Flavortown",
      openingHours: "11:30 AM - 9:30 PM",
      location: { lat: 40.7589, lng: -73.9851 },
      menu: [
        { id: 301, name: "Doro Wat", price: 15.99, description: "Spicy chicken stew" },
        { id: 302, name: "Injera Platter", price: 18.99, description: "Assorted dishes served on sourdough flatbread" },
        { id: 303, name: "Kitfo", price: 16.99, description: "Minced raw beef seasoned with spiced butter" }
      ]
    },
    {
      id: 4,
      name: "Moroccan Oasis",
      thumbnail: "/images/kitchen3.jpeg",
      cuisineType: "Moroccan",
      rating: 4.4,
      address: "101 Medina Way, Casablanca",
      openingHours: "12:00 PM - 10:00 PM",
      location: { lat: 40.7484, lng: -73.9857 },
      menu: [
        { id: 401, name: "Tagine", price: 17.99, description: "Slow-cooked stew with vegetables and meat" },
        { id: 402, name: "Couscous Royale", price: 19.99, description: "Steamed semolina with vegetables and meat" },
        { id: 403, name: "Pastilla", price: 15.99, description: "Sweet and savory meat pie" }
      ]
    },
    {
      id: 5,
      name: "Nile River Cafe",
      thumbnail: "/images/kitchen4.jpg",
      cuisineType: "Egyptian",
      rating: 4.3,
      address: "202 Pyramid St, Alexandria",
      openingHours: "10:30 AM - 9:00 PM",
      location: { lat: 40.7549, lng: -73.9840 },
      menu: [
        { id: 501, name: "Koshari", price: 11.99, description: "Lentils, rice, and pasta with tomato sauce" },
        { id: 502, name: "Ful Medames", price: 9.99, description: "Stewed fava beans with olive oil" },
        { id: 503, name: "Molokhia", price: 13.99, description: "Jute leaf stew with chicken" }
      ]
    },
    {
      id: 6,
      name: "Senegalese Flavors",
      thumbnail: "/images/kitchen5.webp",
      cuisineType: "Senegalese",
      rating: 4.6,
      address: "303 Dakar Drive, Beachside",
      openingHours: "11:00 AM - 10:30 PM",
      location: { lat: 40.7282, lng: -74.0776 },
      menu: [
        { id: 601, name: "Thieboudienne", price: 16.99, description: "Fish and rice dish with vegetables" },
        { id: 602, name: "Yassa Chicken", price: 15.99, description: "Marinated chicken with onion sauce" },
        { id: 603, name: "Mafe", price: 14.99, description: "Meat stew with peanut sauce" }
      ]
    },
    {
      id: 7,
      name: "Zanzibar Spice House",
      thumbnail: "/images/kitchen7.jpg",
      cuisineType: "East African",
      rating: 4.5,
      address: "404 Spice Island Rd, Seaside",
      openingHours: "12:00 PM - 9:30 PM",
      location: { lat: 40.7429, lng: -73.9887 },
      menu: [
        { id: 701, name: "Pilau", price: 13.99, description: "Spiced rice with meat and vegetables" },
        { id: 702, name: "Coconut Bean Soup", price: 10.99, description: "Creamy soup with kidney beans" },
        { id: 703, name: "Octopus Curry", price: 18.99, description: "Tender octopus in coconut curry sauce" }
      ]
    },
    {
      id: 8,
      name: "Safari Bites",
      thumbnail: "/images/kitchen8.jpeg",
      cuisineType: "Pan-African",
      rating: 4.1,
      address: "505 Jungle Ave, Wildtown",
      openingHours: "11:30 AM - 10:00 PM",
      location: { lat: 40.7580, lng: -73.9855 },
      menu: [
        { id: 801, name: "Nyama Choma", price: 19.99, description: "Kenyan-style roasted meat" },
        { id: 802, name: "Pap and Chakalaka", price: 11.99, description: "South African cornmeal with spicy vegetable relish" },
        { id: 803, name: "Samosas", price: 8.99, description: "Crispy pastries with savory filling" }
      ]
    },
    {
      id: 9,
      name: "Maghreb Nights",
      thumbnail: "/images/kitchen9.jpg",
      cuisineType: "North African",
      rating: 4.4,
      address: "606 Atlas St, Mountainview",
      openingHours: "5:00 PM - 11:00 PM",
      location: { lat: 40.7484, lng: -73.9857 },
      menu: [
        { id: 901, name: "Couscous Royale", price: 18.99, description: "Steamed semolina with vegetables and meat" },
        { id: 902, name: "Shakshuka", price: 13.99, description: "Eggs poached in tomato sauce" },
        { id: 903, name: "Merguez Sausages", price: 14.99, description: "Spicy lamb sausages" }
      ]
    },
    {
      id: 10,
      name: "Tropical Tastes",
      thumbnail: "/images/kitchen10.jpg",
      cuisineType: "East African",
      rating: 4.3,
      address: "707 Palm Tree Lane, Coastville",
      openingHours: "10:00 AM - 9:00 PM",
      location: { lat: 40.7549, lng: -73.9840 },
      menu: [
        { id: 1001, name: "Ugali and Sukuma Wiki", price: 12.99, description: "Cornmeal dish with sautéed greens" },
        { id: 1002, name: "Coconut Curry Fish", price: 16.99, description: "Fresh fish in creamy coconut sauce" },
        { id: 1003, name: "Mandazi", price: 7.99, description: "East African fried bread" }
      ]
    },
    {
      id: 11,
      name: "Sahara Nights",
      thumbnail: "/images/kitchen11.jpeg",
      cuisineType: "North African",
      rating: 4.6,
      address: "808 Desert Rd, Oasisburg",
      openingHours: "4:00 PM - 11:30 PM",
      location: { lat: 40.7282, lng: -74.0776 },
      menu: [
        { id: 1101, name: "Lamb Tagine", price: 19.99, description: "Slow-cooked lamb with apricots and almonds" },
        { id: 1102, name: "Harira Soup", price: 11.99, description: "Hearty Moroccan soup" },
        { id: 1103, name: "Bessara", price: 9.99, description: "Fava bean dip with olive oil" }
      ]
    },
    {
      id: 12,
      name: "Cape Town Corner",
      thumbnail: "/images/kitchen12.jpeg",
      cuisineType: "South African",
      rating: 4.2,
      address: "909 Table Mountain Blvd, Bayview",
      openingHours: "11:00 AM - 10:00 PM",
      location: { lat: 40.7429, lng: -73.9887 },
      menu: [
        { id: 1201, name: "Bunny Chow", price: 14.99, description: "Curry served in a hollowed-out bread loaf" },
        { id: 1202, name: "Boerewors Roll", price: 10.99, description: "Grilled sausage in a roll" },
        { id: 1203, name: "Malva Pudding", price: 8.99, description: "Sweet spongy dessert with apricot jam" }
      ]
    }
  ];