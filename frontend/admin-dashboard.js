const API_BASE = 'http://localhost:3000/api';
let currentEditId = null;

// Check admin authentication
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadServices();
});

function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.id || user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'signin.html';
        return;
    }
    
    document.getElementById('admin-name').textContent = `Welcome, ${user.name}`;
}

// Load all services
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE}/services`);
        const services = await response.json();
        displayServices(services);
    } catch (error) {
        console.error('Error loading services:', error);
        alert('Error loading services');
    }
}

// Display services in grid
function displayServices(services) {
    const container = document.getElementById('services-container');
    
    if (services.length === 0) {
        container.innerHTML = '<p>No services found. Add your first service above.</p>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <h3>${service.name}</h3>
            <p><strong>Price:</strong> ₹${service.price}</p>
            <p><strong>Category:</strong> ${service.category}</p>
            <p><strong>Status:</strong> 
                <span class="${service.isActive ? 'status-active' : 'status-inactive'}">
                    ${service.isActive ? 'Active' : 'Inactive'}
                </span>
            </p>
            <div class="service-actions">
                <button class="btn btn-primary" onclick="editService('${service._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteService('${service._id}')">Delete</button>
                <button class="btn ${service.isActive ? 'btn-danger' : 'btn-success'}" 
                        onclick="toggleService('${service._id}', ${!service.isActive})">
                    ${service.isActive ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    `).join('');
}

// Handle form submission
document.getElementById('service-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('service-name').value;
    const price = document.getElementById('service-price').value;
    const category = document.getElementById('service-category').value;
    
    const serviceData = { name, price, category };
    
    try {
        const token = localStorage.getItem('token');
        let response;
        
        if (currentEditId) {
            // Update existing service
            response = await fetch(`${API_BASE}/services/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceData)
            });
        } else {
            // Create new service
            response = await fetch(`${API_BASE}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceData)
            });
        }
        
        if (response.ok) {
            alert(currentEditId ? 'Service updated successfully!' : 'Service added successfully!');
            resetForm();
            loadServices();
        } else {
            const error = await response.json();
            alert(error.message || 'Operation failed');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Network error occurred');
    }
});

// Edit service
async function editService(id) {
    try {
        const response = await fetch(`${API_BASE}/services/${id}`);
        const service = await response.json();
        
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-price').value = service.price;
        document.getElementById('service-category').value = service.category;
        
        currentEditId = id;
        document.getElementById('update-btn').classList.remove('hidden');
        document.getElementById('cancel-btn').classList.remove('hidden');
        document.querySelector('button[type="submit"]').classList.add('hidden');
        
    } catch (error) {
        console.error('Error loading service:', error);
        alert('Error loading service details');
    }
}

// Update service
document.getElementById('update-btn').addEventListener('click', function() {
    document.getElementById('service-form').dispatchEvent(new Event('submit'));
});

// Cancel edit
function cancelEdit() {
    resetForm();
}

// Reset form
function resetForm() {
    document.getElementById('service-form').reset();
    currentEditId = null;
    document.getElementById('update-btn').classList.add('hidden');
    document.getElementById('cancel-btn').classList.add('hidden');
    document.querySelector('button[type="submit"]').classList.remove('hidden');
}

// Delete service
async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/services/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Service deleted successfully!');
            loadServices();
        } else {
            const error = await response.json();
            alert(error.message || 'Delete failed');
        }
        
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('Network error occurred');
    }
}

// Toggle service active status
async function toggleService(id, isActive) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/services/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isActive })
        });
        
        if (response.ok) {
            alert(`Service ${isActive ? 'activated' : 'deactivated'} successfully!`);
            loadServices();
        } else {
            const error = await response.json();
            alert(error.message || 'Operation failed');
        }
        
    } catch (error) {
        console.error('Error toggling service:', error);
        alert('Network error occurred');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'signin.html';
}
