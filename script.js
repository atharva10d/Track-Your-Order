document.addEventListener('DOMContentLoaded', function() {
    const orderIdInput = document.getElementById('orderId');
    const trackButton = document.getElementById('trackButton');
    const orderStatusDiv = document.getElementById('orderStatus');
    const darkModeButton = document.getElementById('darkModeButton');
    const patternCanvas = document.getElementById('patternCanvas');
    const ctx = patternCanvas.getContext('2d');

    const indianFirstNames = ["Aarav", "Aditi", "Aryan", "Deepika", "Divya", "Karan", "Priya", "Rahul", "Riya", "Vikram"];
    const indianLastNames = ["Kumar", "Sharma", "Verma", "Singh", "Gupta", "Patel", "Joshi", "Reddy", "Das", "Yadav"];
    const indianCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
    const indianStates = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh"];
    const indianPinCodes = ["110001", "400001", "560001", "600001", "700001", "500001", "411001", "380001", "302001", "226001"];
    const indianLocationsLatLong = {
        "Delhi": { lat: 28.65, lng: 77.23 },
        "Mumbai": { lat: 19.07, lng: 72.87 },
        "Bangalore": { lat: 12.97, lng: 77.59 },
        "Chennai": { lat: 13.08, lng: 80.27 },
        "Kolkata": { lat: 22.57, lng: 88.36 },
        "Hyderabad": { lat: 17.38, lng: 78.49 },
        "Pune": { lat: 18.52, lng: 73.85 },
        "Ahmedabad": { lat: 23.02, lng: 72.57 },
        "Jaipur": { lat: 26.91, lng: 75.78 },
        "Lucknow": { lat: 26.85, lng: 80.94 }
    };

    const electronicsItems = ["Smartphone", "Laptop", "Wireless Headphones", "Smartwatch", "Tablet", "Bluetooth Speaker", "Power Bank", "USB Cable", "Charger"];
    const clothingItems = ["T-Shirt", "Jeans", "Shirt", "Dress", "Socks", "Underwear", "Jacket", "Sweater", "Shoes"];
    const homeGoodsItems = ["Coffee Mug", "Bed Sheets", "Pillow", "Towel Set", "Kitchen Utensils", "Storage Box", "Photo Frame", "Candle", "Plant Pot"];
    const bookItems = ["Fiction Novel", "Mystery Book", "Cookbook", "Biography", "Self-Help Book", "Science Fiction", "History Book", "Children's Book"];
    const itemCategories = {
        "Electronics": { items: electronicsItems, priceRange: { min: 500, max: 50000 } },
        "Clothing": { items: clothingItems, priceRange: { min: 200, max: 5000 } },
        "Home Goods": { items: homeGoodsItems, priceRange: { min: 50, max: 2000 } },
        "Books": { items: bookItems, priceRange: { min: 100, max: 1500 } }
    };

    function getRandomIndianName() {
        const firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
        const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
        return `${firstName} ${lastName}`;
    }
    function getRandomIndianAddress(city) {
        const cityIndex = indianCities.indexOf(city);
        const state = indianStates[cityIndex];
        const pinCode = indianPinCodes[cityIndex];
        const streetNumber = Math.floor(Math.random() * 100) + 1;
        const streetName = ["Main Road", "Cross Road", "Linking Road", "Temple Road"][Math.floor(Math.random() * 4)];
        const areaName = ["Sector", "Layout", "Colony", "Nagar"][Math.floor(Math.random() * 4)] + " " + Math.floor(Math.random() * 20) + " ";
        return `${streetNumber}, ${streetName}, ${areaName}, ${city}, ${state} - ${pinCode}`;
    }

    function getRandomItemFromCategory(categoryName) {
        const category = itemCategories[categoryName];
        const items = category.items;
        return items[Math.floor(Math.random() * items.length)];
    }

    function generateRandomOrderItems() {
        const numItems = Math.floor(Math.random() * 5) + 1;
        const selectedItems = [];
        let totalPrice = 0;

        const categories = Object.keys(itemCategories);
        for (let i = 0; i < numItems; i++) {
            const categoryName = categories[Math.floor(Math.random() * categories.length)];
            const item = getRandomItemFromCategory(categoryName);
            selectedItems.push(item);
            const priceRange = itemCategories[categoryName].priceRange;
            const itemPrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
            totalPrice += itemPrice;
        }
        return { items: selectedItems, amount: totalPrice };
    }


    const ordersData = [];
    for (let i = 1; i <= 100; i++) {
        const orderId = `ORD${String(i).padStart(2, '0')}`;
        const cityName = indianCities[i % indianCities.length];
        const orderItemsData = generateRandomOrderItems();
        const order = {
            orderId: orderId,
            userName: getRandomIndianName(),
            address: getRandomIndianAddress(cityName),
            items: orderItemsData.items,
            amount: orderItemsData.amount.toFixed(2),
            deliveryStatuses: [
                { location: "Order Placed", date: "2025-03-17", status: "Placed" },
                { location: `Processing in ${cityName} Warehouse`, date: "2025-03-18", status: "Processing" },
                { location: `Shipped from ${cityName} Warehouse`, date: "2025-03-19", status: "Shipped" },
                { location: `In Transit - ${cityName} Hub`, date: "2025-03-20", status: "In Transit" },
                { location: `Out for Delivery in ${cityName}`, date: "2025-03-21", status: "Out for Delivery" },
                { location: `Delivered in ${cityName}`, date: "2025-03-22", status: "Delivered" }
            ],
            currentStatusIndex: Math.floor(Math.random() * 4),
            city: cityName
        };
        ordersData.push(order);
    }

    trackButton.addEventListener('click', function() {
        const orderId = orderIdInput.value.trim().toUpperCase();
        orderStatusDiv.innerHTML = '';
        if (!orderId) {
            orderStatusDiv.innerHTML = '<p class="error-message">Please enter your Order ID.</p>';
            return;
        }
        const order = ordersData.find(order => order.orderId === orderId);
        if (order) {
            const currentStatus = order.deliveryStatuses[order.currentStatusIndex];
            let orderDetailsHTML = `
                <div class="order-details">
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Customer Name:</strong> ${order.userName}</p>
                    <p><strong>Delivery Address:</strong><br>${order.address.split(', ').join('<br>')}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
            `;
            order.items.forEach(item => {
                orderDetailsHTML += `<li>${item}</li>`;
            });
            orderDetailsHTML += `
                    </ul>
                    <p><strong>Total Amount:</strong> ₹${order.amount}</p>
                </div>
                <hr>
                <h3>Current Status</h3>
                <p><strong>Status:</strong> ${currentStatus.status}</p>
                <p><strong>Location:</strong> ${currentStatus.location}</p>
                <p><strong>Estimated Delivery Date:</strong> ${currentStatus.date}</p>
            `;
            const progressPercentage = ((order.currentStatusIndex + 1) / order.deliveryStatuses.length) * 100;
            orderDetailsHTML += `
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                </div>
                <p><strong>Delivery Progress:</strong> ${currentStatus.status} (${(progressPercentage).toFixed(0)}%)</p>
            `;
            const mapLocation = indianLocationsLatLong[order.city];
            if (mapLocation) {
                const mapLink = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d241928.6534197072!2d${mapLocation.lng}!3d${mapLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1709955600000!5w768`;
                orderDetailsHTML += `
                    <div class="map-link">
                        <p><strong>Track on Map:</strong></p>
                        <iframe width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${mapLink}"></iframe>
                    </div>
                `;
            } else {
                orderDetailsHTML += `<p class="map-link">Map location not available for ${order.city}.</p>`;
            }
            orderStatusDiv.innerHTML = orderDetailsHTML;
            if (order.currentStatusIndex < order.deliveryStatuses.length - 1) {
                order.currentStatusIndex++;
            }
        } else {
            orderStatusDiv.innerHTML = '<p class="error-message">Order ID not found. Please check your order ID.</p>';
        }
        orderIdInput.value = '';
    });

    darkModeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    patternCanvas.width = window.innerWidth;
    patternCanvas.height = window.innerHeight;
    let drawing = false;
    let points = [];

    function handleMousemove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (drawing) {
            points.push({x: mouseX, y: mouseY});
        }
    }

    window.addEventListener('mousedown', () => {
        drawing = true;
        points = [];
    });
    window.addEventListener('mouseup', () => drawing = false);
    window.addEventListener('mousemove', handleMousemove);


    window.addEventListener('resize', function() {
        patternCanvas.width = window.innerWidth;
        patternCanvas.height = window.innerHeight;
    });

    function drawPattern() {
        ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = document.body.classList.contains('dark-mode') ? getComputedStyle(document.documentElement).getPropertyValue('--cursor-pattern-color-dark-mode').trim() : getComputedStyle(document.documentElement).getPropertyValue('--cursor-pattern-color').trim();

        if (points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                const midPoint = {
                    x: (points[i].x + points[i-1].x) / 2,
                    y: (points[i].y + points[i-1].y) / 2
                };
                ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, midPoint.x, midPoint.y);
            }
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.stroke();
        }


        requestAnimationFrame(drawPattern);
    }

    drawPattern();
});