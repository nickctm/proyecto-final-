
// Búsqueda
const searchInput = document.querySelector('.search-container input');
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        alert(`Buscando: "${this.value}"`);
        this.value = '';
    }
});

// Menú interactivo
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Menú pequeño interactivo
const menuItemsSmall = document.querySelectorAll('.menu-item-small');
menuItemsSmall.forEach(item => {
    item.addEventListener('click', function() {
        menuItemsSmall.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Gráfico de Ventas y Compras
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
    type: 'bar',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Ventas',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
            },
            {
                label: 'Compras',
                data: [8000, 12000, 10000, 18000, 15000, 22000],
                backgroundColor: '#2ecc71',
                borderColor: '#27ae60',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

// Gráfico de Distribución por Categoría
const categoryCtx = document.getElementById('categoryChart').getContext('2d');
const categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
        labels: ['Repuestos Motor', 'Llantas', 'Accesorios', 'Accesorios/Unicamientos', 'Otros'],
        datasets: [{
            data: [35, 25, 19, 20, 3],
            backgroundColor: [
                '#3498db',
                '#2ecc71',
                '#e74c3c',
                '#f39c12',
                '#9b59b6'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Sistema de estado global
const AppState = {
    currentTheme: localStorage.getItem('theme') || 'light',
    notifications: [],
    user: {
        name: 'Admin',
        role: 'Administrador del Sistema',
        lastLogin: new Date()
    }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadMockData();
});

function initializeApp() {
    // Cargar tema guardado
    if (AppState.currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    // Actualizar hora en tiempo real
    updateRealTime();
    setInterval(updateRealTime, 60000);
}

function setupEventListeners() {
    // Tema claro/oscuro mejorado
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Búsqueda con debounce
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Menús interactivos
    setupMenuInteractions();
    
    // Modal de notificaciones
    setupNotifications();
}

// Debounce para búsqueda
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length > 2) {
        // Simular búsqueda en base de datos
        console.log('Buscando:', searchTerm);
        // Aquí iría la llamada a la API
    }
}

function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    AppState.currentTheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', AppState.currentTheme);
    updateThemeIcon(isDarkMode);
}

function updateThemeIcon(isDarkMode) {
    const themeIcon = document.querySelector('#themeToggle i');
    if (isDarkMode) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

function setupMenuInteractions() {
    // Menú principal
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menuText = this.querySelector('.menu-text').textContent;
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Simular cambio de vista
            updateMainContent(menuText);
        });
    });
    
    // Menú pequeño
    const menuItemsSmall = document.querySelectorAll('.menu-item-small');
    menuItemsSmall.forEach(item => {
        item.addEventListener('click', function() {
            menuItemsSmall.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateMainContent(section) {
    // Aquí puedes cargar contenido dinámico según la sección
    console.log('Cambiando a sección:', section);
    // Ejemplo: fetch(`/api/${section}`).then(...)
}

function setupNotifications() {
    const notificationBtn = document.querySelector('.btn-notification');
    const modal = document.getElementById('notificationModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (notificationBtn && modal) {
        notificationBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

function updateRealTime() {
    const now = new Date();
    const timeElements = document.querySelectorAll('.current-time div');
    
    if (timeElements.length >= 3) {
        timeElements[0].textContent = `Última actualización: ${formatTime(now)}`;
        timeElements[1].textContent = now.toLocaleTimeString();
        timeElements[2].textContent = now.toLocaleDateString();
    }
}

function formatTime(date) {
    const diff = Math.floor((new Date() - date) / 60000); // diferencia en minutos
    if (diff < 1) return 'Hace unos segundos';
    if (diff === 1) return 'Hace 1 minuto';
    if (diff < 60) return `Hace ${diff} minutos`;
    
    const hours = Math.floor(diff / 60);
    if (hours === 1) return 'Hace 1 hora';
    if (hours < 24) return `Hace ${hours} horas`;
    
    const days = Math.floor(hours / 24);
    return `Hace ${days} días`;
}

function loadMockData() {
    // Datos de ejemplo para las gráficas
    const salesData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        sales: [12000, 19000, 15000, 25000, 22000, 30000],
        purchases: [8000, 12000, 10000, 18000, 15000, 22000]
    };
    
    updateCharts(salesData);
}

function updateCharts(data) {
    // Actualizar gráfica de ventas/compras
    if (window.salesChart) {
        window.salesChart.data.labels = data.labels;
        window.salesChart.data.datasets[0].data = data.sales;
        window.salesChart.data.datasets[1].data = data.purchases;
        window.salesChart.update();
    }
}

// Exportar funciones para uso global (si es necesario)
window.AppController = {
    toggleTheme,
    handleSearch,
    updateRealTime
};