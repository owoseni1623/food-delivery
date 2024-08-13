// src/component/ResData/ResData.js

export const resData = [
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
        { id: 101, name: "Jollof Rice", price: 480, description: "Spicy West African rice dish", image: "/images/Jollof rice.webp" },
        { id: 102, name: "Pap and Chakalaka", price: 400, description: "Traditional South African cornmeal porridge with spicy vegetable relish", image: "/images/Pap and Chakalaka.avif" },
        { id: 103, name: "Fufu and Egusi Soup", price: 640, description: "Cassava dough with melon seed soup", image: "/images/fufu-egusi.jpeg" },
        { id: 104, name: "Suya", price: 550, description: "Spicy grilled meat skewers", image: "/images/suya.jpeg" }
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
        { id: 201, name: "Bobotie", price: 780, description: "South African curried meat dish", image: "/images/bobotie.jpeg" },
        { id: 202, name: "Peanut Stew", price: 765, description: "Creamy West African peanut soup", image: "/images/Peanut Stew.jpeg" },
        { id: 203, name: "Sadza", price: 670, description: "Zimbabwean cornmeal staple", image: "/images/Sadza.jpg" },
        { id: 204, name: "Braai Platter", price: 679, description: "Assorted grilled meats South African style", image: "/images/Braai Platter.webp" }
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
        { id: 301, name: "Doro Wat", price: 560, description: "Spicy Ethiopian chicken stew", image: "/images/Doro Wat.jpg" },
        { id: 302, name: "Injera Platter", price: 565, description: "Assorted dishes served on sourdough flatbread", image: "/images/Injera Platter.jpg" },
        { id: 303, name: "Kitfo", price: 530, description: "Ethiopian-style minced raw beef seasoned with spiced butter", image: "/images/Kitfo.jpg" },
        { id: 304, name: "Tibs", price: 555, description: "Sautéed meat and vegetables", image: "/images/Tibs.jpg" }
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
        { id: 401, name: "Tagine", price: 700, description: "Moroccan slow-cooked stew with vegetables and meat", image: "/images/Tagine.jpeg" },
        { id: 402, name: "Couscous Royale", price: 755, description: "Steamed semolina with vegetables and meat", image: "/images/Couscous Royale.webp" },
        { id: 403, name: "Pastilla", price: 750, description: "Moroccan sweet and savory meat pie", image: "/images/Pastilla.jpg" },
        { id: 404, name: "Harira", price: 770, description: "Traditional Moroccan soup", image: "/images/Sadza.jpg" }
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
        { id: 501, name: "Koshari", price: 350, description: "Egyptian lentils, rice, and pasta with tomato sauce", image: "/images/koshari1.jpeg" },
        { id: 502, name: "Ful Medames", price: 355, description: "Egyptian stewed fava beans with olive oil", image: "/images/Ful Medames.jpg" },
        { id: 503, name: "Molokhia", price: 380, description: "Egyptian jute leaf stew with chicken", image: "/images/Molokhia.png" },
        { id: 504, name: "Mahshi", price: 375, description: "Stuffed vegetables with rice and herbs", image: "/images/Mahshi.jpg" }
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
        { id: 601, name: "Thieboudienne", price: 290, description: "Senegalese fish and rice dish with vegetables", image: "/images/Thieboudienne1.jpeg" },
        { id: 602, name: "Yassa Chicken", price: 295, description: "Senegalese marinated chicken with onion sauce", image: "/images/Yassa Chicken.jpg" },
        { id: 603, name: "Mafe", price: 300, description: "Senegalese meat stew with peanut sauce", image: "/images/Mafe1.webp" },
        { id: 604, name: "Accara", price: 350, description: "Black-eyed pea fritters", image: "/images/Accara.jpeg" }
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
        { id: 701, name: "Pilau", price: 605, description: "Zanzibar spiced rice with meat and vegetables", image: "/images/Pilau.jpg" },
        { id: 702, name: "Coconut Bean Soup", price: 630, description: "Zanzibari creamy soup with kidney beans", image: "/images/Coconut Bean Soup.webp" },
        { id: 703, name: "Octopus Curry", price: 645, description: "Zanzibari tender octopus in coconut curry sauce", image: "/images/Octopus Curry.avif" },
        { id: 704, name: "Mchuzi wa Samaki", price: 600, description: "Tanzanian fish curry", image: "/images/Mchuzi wa Samaki.jpeg" }
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
        { id: 801, name: "Nyama Choma", price: 610, description: "Kenyan-style roasted meat", image: "/images/Nyama Choma.jpg" },
        { id: 802, name: "Ugali", price: 650, description: "East African cornmeal staple", image: "/images/Ugali.webp" },
        { id: 803, name: "Sukuma Wiki", price: 600, description: "Kenyan collard greens with tomatoes", image: "/images/Sukuma Wiki.jpg" },
        { id: 804, name: "Irio", price: 690, description: "Kenyan mashed peas and potato dish", image: "/images/Irio.jpg" }
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
        { id: 901, name: "Shakshuka", price: 500, description: "North African eggs poached in tomato sauce", image: "/images/Shakshuka1.jpg" },
        { id: 902, name: "Merguez Sausages", price: 550, description: "North African spicy lamb sausages", image: "/images/Merguez Sausages.jpg" },
        { id: 903, name: "Brik", price: 555, description: "Tunisian thin pastry with egg filling", image: "/images/Brik.jpg" },
        { id: 904, name: "Chakchouka", price: 580, description: "Algerian vegetable stew", image: "/images/Chakchouka.jpg" }
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
        { id: 1001, name: "Ugali and Sukuma Wiki", price: 430, description: "Kenyan cornmeal dish with sautéed greens", image: "/images/Ugali and Sukuma Wiki.jpg" },
        { id: 1002, name: "Coconut Curry Fish", price: 459, description: "East African fresh fish in creamy coconut sauce", image: "/images/Coconut Curry Fish.webp" },
        { id: 1003, name: "Mandazi", price: 470, description: "East African fried bread", image: "/images/Mandazi.jpg" },
        { id: 1004, name: "Kachumbari", price: 465, description: "East African tomato and onion salad", image: "/images/Kachumbari.jpg" }
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
        { id: 1101, name: "Lamb Tagine", price: 380, description: "Moroccan slow-cooked lamb with apricots and almonds", image: "/images/Lamb Tagine.jpeg" },
        { id: 1102, name: "Harira Soup", price: 359, description: "Hearty Moroccan soup", image: "/images/Harira Soup.jpg" },
        { id: 1103, name: "Bessara", price: 345, description: "Moroccan fava bean dip with olive oil", image: "/images/Bessara.jpg" },
        { id: 1104, name: "Zaalouk", price: 360, description: "Moroccan eggplant and tomato dip", image: "/images/Zaalouk.jpg" }
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
        { id: 1201, name: "Bunny Chow", price: 450, description: "South African curry served in a hollowed-out bread loaf", image: "/images/Bunny Chow.jpeg" },
        { id: 1202, name: "Boerewors Roll", price: 455, description: "South African grilled sausage in a roll", image: "/images/Boerewors Roll.webp" },
        { id: 1203, name: "Malva Pudding", price: 480, description: "South African sweet spongy dessert with apricot jam", image: "/images/Malva Pudding.jpg" },
        { id: 1204, name: "Chakalaka", price: 485, description: "South African spicy vegetable relish", image: "/images/Chakalaka.jpeg" }
      ]
    }
];
