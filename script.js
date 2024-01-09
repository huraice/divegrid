// Sample data with coordinates
const locations = [
    { name: 'Vembayam', lat: 8.656230, lon: 76.940777 },
    // { name: 'Location 2', lat: 40.7128, lon: -74.0060 },
    // Add more locations as needed
];

// Initialize the map
const map = L.map('map').setView([8, 75], 3);

// Add a tile layer to the map (you can use other providers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add markers for each location
locations.forEach(location => {
    L.marker([location.lat, location.lon]).addTo(map)
        .bindPopup(location.name);
});
