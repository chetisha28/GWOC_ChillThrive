const API_BASE = 'http://localhost:3000/api';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeHomepage();
    
    // Check if we should show dashboard (from booking redirect)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showDashboard') === 'true') {
        // Small delay to ensure auth section is loaded
        setTimeout(() => {
            showDashboard();
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 100);
    }
});

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const authSection = document.getElementById('auth-section');
    
    if (token && user.id) {
        // User is logged in - show profile dropdown with user avatar
        authSection.innerHTML = `
            <div class="profile-dropdown">
                    <a href="#" onclick="showDashboard(); closeProfileDropdown();" class="dropdown-item">
                <div class="profile-icon" onclick="toggleProfileDropdown()">
                    <img src="images/profile-avatar.png" alt="Profile" class="profile-avatar">
                </div>
                <div class="profile-dropdown-menu" id="profile-dropdown-menu">
                </div>
                </a>
            </div>
        `;
        
        // Load user stats in background but don't show dashboard
        loadUserStats();
    } else {
        // User is not logged in
        authSection.innerHTML = `
            <a href="login.html" class="login">Sign In / Sign Up</a>
        `;
    }
}

function showDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('user-name').textContent = user.name || 'User';
    document.getElementById('user-dashboard').style.display = 'block';
    document.body.classList.add('dashboard-active');
    
    // Scroll to dashboard
    document.getElementById('user-dashboard').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function hideDashboard() {
    document.getElementById('user-dashboard').style.display = 'none';
    document.body.classList.remove('dashboard-active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadUserStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/bookings/my`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const bookings = result.data || [];
            
            const now = new Date();
            const upcoming = bookings.filter(booking => 
                new Date(booking.bookingDate) >= now && booking.status !== 'cancelled'
            );
            const completed = bookings.filter(booking => 
                new Date(booking.bookingDate) < now && booking.status !== 'cancelled'
            );
            
            document.getElementById('total-bookings').textContent = bookings.length;
            document.getElementById('upcoming-bookings').textContent = upcoming.length;
            document.getElementById('completed-bookings').textContent = completed.length;
        }
    } catch (error) {
        console.error('Error loading user stats:', error);
    }
}

async function showMyBookings() {
    const bookingsSection = document.getElementById('bookings-section');
    const bookingsContainer = document.getElementById('bookings-container');
    
    if (bookingsSection.style.display === 'block') {
        bookingsSection.style.display = 'none';
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/bookings/my`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const bookings = result.data || [];
            
            if (bookings.length === 0) {
                bookingsContainer.innerHTML = '<div class="no-bookings">No bookings found. <a href="booknow.html">Book your first session!</a></div>';
            } else {
                bookingsContainer.innerHTML = bookings.map(booking => `
                    <div class="booking-card ${getBookingStatusClass(booking)}">
                        <div class="booking-header">
                            <h4>${booking.service?.name || 'Service'}</h4>
                            <span class="booking-status ${booking.status}">${booking.status}</span>
                        </div>
                        <div class="booking-details">
                            <p><strong>Date:</strong> ${formatDate(booking.bookingDate)}</p>
                            <p><strong>Time:</strong> ${booking.timeSlot}</p>
                            <p><strong>Price:</strong> ₹${booking.service?.price || 'N/A'}</p>
                            <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
                        </div>
                        ${booking.status === 'confirmed' && new Date(booking.bookingDate) > new Date() ? 
                            `<button class="btn btn-danger btn-sm" onclick="cancelBooking('${booking._id}')">Cancel Booking</button>` : 
                            ''
                        }
                    </div>
                `).join('');
            }
            
            bookingsSection.style.display = 'block';
            // Scroll to bookings section
            bookingsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            bookingsContainer.innerHTML = '<div class="error">Error loading bookings. Please try again.</div>';
            bookingsSection.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsContainer.innerHTML = '<div class="error">Network error. Please check your connection.</div>';
        bookingsSection.style.display = 'block';
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Booking cancelled successfully!');
            showMyBookings(); // Refresh bookings
            loadUserStats(); // Refresh stats
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to cancel booking');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Network error. Please try again.');
    }
}

function getBookingStatusClass(booking) {
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    
    if (booking.status === 'cancelled') return 'cancelled';
    if (bookingDate < now) return 'completed';
    return 'upcoming';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    window.location.reload();
}

function initializeHomepage() {
    // Your existing homepage JavaScript
    const text = "Welcome to Chill Thrive.";
    const speed = 100;
    let index = 0;

    function type() {
        if (index < text.length) {
            document.getElementById("typing").textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();

    const icebath = document.querySelector(".icebath-card");
    if (icebath) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    icebath.classList.add('flip');
                } else {
                    icebath.classList.remove('flip');
                }
            },
            {
                threshold: 0.5
            }
        );
        observer.observe(icebath);
    }

    const jacuzzi = document.querySelector(".Jacuzzi-card");
    if (jacuzzi) {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    jacuzzi.classList.add('flip');
                } else {
                    jacuzzi.classList.remove('flip');
                }
            },
            {
                threshold: 0.5
            }
        );
        obs.observe(jacuzzi);
    }

    const steambath = document.querySelector(".steambath-card");
    if (steambath) {
        const obse = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    steambath.classList.add('flip');
                } else {
                    steambath.classList.remove('flip');
                }
            },
            {
                threshold: 0.5
            }
        );
        obse.observe(steambath);
    }

    const combo = document.querySelector(".combo-card");
    if (combo) {
        const obser = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    combo.classList.add('flip');
                } else {
                    combo.classList.remove('flip');
                }
            },
            {
                threshold: 0.5
            }
        );
        obser.observe(combo);
    }

    function equalizeCardHeights() {
        const cards = document.querySelectorAll(
            '.icebath-card, .Jacuzzi-card, .steambath-card, .combo-card'
        );

        if (cards.length === 0) return;

        let maxHeight = 0;
        cards.forEach(card => {
            card.style.height = 'auto';
        });

        cards.forEach(card => {
            const front = card.querySelector('.card-image');
            const back = card.querySelector('.card-content');

            const frontHeight = front ? front.scrollHeight : 0;
            const backHeight = back ? back.scrollHeight : 0;

            const cardHeight = Math.max(frontHeight, backHeight);
            maxHeight = Math.max(maxHeight, cardHeight);
        });

        cards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }

    window.addEventListener('load', equalizeCardHeights);
    window.addEventListener('resize', equalizeCardHeights);

    const button = document.getElementById("btn");
    const box = document.getElementById("why-description");

    if (button && box) {
        button.addEventListener("click", () => {
            if (box.style.display === "none") {
                box.style.display = "block";

            const cards= document.querySelectorAll(".why-card");
            cards.forEach(card=> card.classList.remove("show"));

            setTimeout(() => {
                cards.forEach(card => card.classList.add("show"));
            }, 100);
        } else {
            whyDesc.style.display="none";
        }
        });
    }
}

// Make toggleMenu available globally
function toggleMenu() {
    document.querySelector(".hb").classList.toggle("show");
}

// Profile dropdown functions
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown-menu');
    dropdown.classList.toggle('show');
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeOnClickOutside(event) {
        if (!event.target.closest('.profile-dropdown')) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeOnClickOutside);
        }
    });
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown-menu');
    dropdown.classList.remove('show');
}

async function addReview() {
    const names = document.getElementById("names").value.trim();
    const review = document.getElementById("review").value.trim();
    const rating = document.getElementById("rating").value;

    if (!names || !review || !rating) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: names,
                review: review,
                rating: parseInt(rating)
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Thank you for your review! Your feedback has been submitted successfully.');
            
            // Clear the form
            document.getElementById("names").value = '';
            document.getElementById("review").value = '';
            document.getElementById("rating").value = '5';
        } else {
            alert(result.message || 'Failed to submit review');
        }
    } catch (error) {
        console.error('Review submission error:', error);
        alert('Network error. Please try again.');
    }
}
