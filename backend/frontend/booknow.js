const API_BASE = 'http://localhost:3000/api';

const serviceCards = document.querySelectorAll(".service-card");
const bookingSection = document.getElementById("booking-section");
const selectedServiceText = document.getElementById("selected-service");
const nextBtn = document.getElementById("next-btn");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const backBtn = document.getElementById("backbtn");
const box = document.getElementById("details");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("contact");
const confirmBtn = document.getElementById("confirmbtn");

// Global variables
let selectedService = null;
let services = [];
let userToken = null;
let userInfo = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadServices();
    setMinDate();
});

// Update the checkAuth function in booknow.js
function checkAuth() {
    userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    userToken = localStorage.getItem('token');
    
    if (!userInfo.id || !userToken) {
        // SAVE CURRENT PAGE as return URL
        localStorage.setItem('returnUrl', 'booknow.html');
        
        alert('Please login first to book a service');
        window.location.href = 'signin.html';
        return;
    }
    
    // Pre-fill user details
    if (nameInput) nameInput.value = userInfo.name || '';
    if (emailInput) emailInput.value = userInfo.email || '';
}


// Set minimum date
function setMinDate() {
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Load services from backend
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE}/services`);
        const result = await response.json();
        services = result;
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Find service by category
function findServiceByCategory(category) {
    const categoryMap = {
        'Icebath': 'ice bath',
        'Jacuzzi': 'jacuzzi', 
        'Steambath': 'steam bath'
    };
    
    const searchCategory = categoryMap[category] || category.toLowerCase();
    return services.find(service => 
        service.category.toLowerCase() === searchCategory && service.isActive
    );
}

serviceCards.forEach(card => {
    card.addEventListener("click", () => {
        const serviceType = card.dataset.service;
        
        selectedService = findServiceByCategory(serviceType);
        
        if (!selectedService && serviceType !== 'combo') {
            alert('Service not available');
            return;
        }
        
        localStorage.setItem("selectedService", serviceType);
        history.pushState({}, "", `?service=${serviceType}`);
        
        showBooking(serviceType);
    });
});

function showBooking(service) {
    selectedServiceText.textContent = `Booking for: ${service}`;
    if (selectedService) {
        selectedServiceText.textContent += ` - ₹${selectedService.price}`;
    }
    bookingSection.style.display = "block";
    bookingSection.scrollIntoView({ behavior: "smooth" });
}

nextBtn.addEventListener("click", () => {
    if (!dateInput.value || !timeInput.value) {
        alert('Please select date and time');
        return;
    }
    box.style.display = "block";
    box.scrollIntoView({ behavior: "smooth" });
});

// Form validation for date/time
function checkDateTimeForm() {
    const allFilled = timeInput.value.trim() !== "" && dateInput.value.trim() !== "";
    nextBtn.disabled = !allFilled;
}

[dateInput, timeInput].forEach(input => {
    input.addEventListener("input", checkDateTimeForm);
});

backBtn.addEventListener("click", () => {
    box.style.display = "none";
});

// Form validation for details
function checkDetailsForm() {
    const allFilled = 
        emailInput.value.trim() !== "" &&
        nameInput.value.trim() !== "" &&
        phoneInput.value.trim() !== "";
    
    confirmBtn.disabled = !allFilled;
}

[nameInput, emailInput, phoneInput].forEach(input => {
    input.addEventListener("input", checkDetailsForm);
});

// Handle booking confirmation
confirmBtn.addEventListener("click", async () => {
    if (!selectedService || !userToken) {
        alert('Please select a service and login');
        return;
    }
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';
    
    try {
        // Create time slot format
        const time = timeInput.value;
        const [hours, minutes] = time.split(':');
        const endHour = parseInt(hours);
        const endMinute = parseInt(minutes) + 30;
        
        let endHourFinal = endHour;
        let endMinuteFinal = endMinute;
        
        if (endMinute >= 60) {
            endHourFinal = endHour + 1;
            endMinuteFinal = endMinute - 60;
        }
        
        const timeSlot = `${time}-${endHourFinal.toString().padStart(2, '0')}:${endMinuteFinal.toString().padStart(2, '0')}`;
        
        const bookingData = {
            serviceId: selectedService._id,
            bookingDate: dateInput.value,
            timeSlot: timeSlot,
            customerDetails: {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value
            }
        };
        
        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`Booking confirmed! Your booking ID is: ${result.data.booking_id}`);
            
            // Reset form
            bookingSection.style.display = "none";
            box.style.display = "none";
            dateInput.value = '';
            timeInput.value = '';
            
            // Redirect option
            const viewBookings = confirm('Would you like to view your bookings?');
            if (viewBookings) {
                // Redirect to homepage and show dashboard
                window.location.href = 'homepage.html?showDashboard=true';
            } else {
                // Redirect to homepage
                window.location.href = 'homepage.html';
            }
        } else {
            throw new Error(result.message || 'Booking failed');
        }
        
    } catch (error) {
        console.error('Booking error:', error);
        alert(`Booking failed: ${error.message}`);
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm';
    }
});
