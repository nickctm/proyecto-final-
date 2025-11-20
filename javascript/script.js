// Datos de ejemplo para el dashboard
const dashboardData = {
    sales: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Ventas',
                data: [55000, 62000, 58000, 67000, 72000, 67000],
                borderColor: '#4b1f47',
                backgroundColor: 'rgba(75, 31, 71, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Compras',
                data: [32000, 38000, 35000, 42000, 45000, 41000],
                borderColor: '#34694a',
                backgroundColor: 'rgba(52, 105, 74, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    distribution: {
        labels: ['Repuestos Motor', 'Llantas', 'Accesorios', 'Otros'],
        datasets: [{
            data: [35, 25, 15, 25],
            backgroundColor: [
                '#4b1f47',
                '#34694a',
                '#C77F5B',
                '#4A90A4'
            ],
            borderWidth: 0
        }]
    }
};

class DashboardManager {
    constructor() {
        this.salesChart = null;
        this.distributionChart = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initCharts();
    }

    initializeElements() {
        // Elementos DOM principales
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.notificationsBtn = document.getElementById('notificationsBtn');
        this.profileBtn = document.getElementById('profileBtn');
        this.menuItems = document.querySelectorAll('.sidebar .menu-item');
    }

    setupEventListeners() {
        // Modo oscuro
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Gestión del menú lateral
        this.menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMenuItemClick(e.currentTarget);
            });
        });

        // Botones de acción
        this.notificationsBtn.addEventListener('click', () => this.showNotifications());
        this.profileBtn.addEventListener('click', () => this.showProfile());
    }

    initCharts() {
        // Gráfico de ventas
        const salesCtx = document.getElementById('salesChart').getContext('2d');
        this.salesChart = new Chart(salesCtx, {
            type: 'line',
            data: dashboardData.sales,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Gráfico de distribución
        const distributionCtx = document.getElementById('distributionChart').getContext('2d');
        this.distributionChart = new Chart(distributionCtx, {
            type: 'doughnut',
            data: dashboardData.distribution,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                },
                cutout: '60%'
            }
        });
    }

    handleMenuItemClick(clickedItem) {
        this.menuItems.forEach(item => {
            item.classList.remove('active', 'bottom-active');
        });
        
        clickedItem.classList.add('active');
        
        // Aquí puedes agregar lógica para cambiar entre páginas
        const menuText = clickedItem.textContent.trim();
        console.log(`Menú cambiado a: ${menuText}`);
        
        // Ejemplo: Redirigir a la página correspondiente
        if (menuText === 'Productos') {
            // window.location.href = 'productos.html';
            alert('Redirigiendo a Gestión de Productos');
        }
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const icon = this.darkModeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.textContent = 'light_mode';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.textContent = 'dark_mode';
            localStorage.setItem('darkMode', 'disabled');
        }
        
        // Actualizar colores de los gráficos
        this.updateChartColors();
    }

    updateChartColors() {
        // Actualizar colores de gráficos según el modo
        if (this.salesChart) {
            this.salesChart.update();
        }
        if (this.distributionChart) {
            this.distributionChart.update();
        }
    }

    showNotifications() {
        const notifications = [
            { type: 'warning', message: 'Stock bajo: Pastillas de freno delanteras (3 unidades)' },
            { type: 'info', message: 'Nuevo pedido recibido: Cliente Taller Martínez' },
            { type: 'success', message: 'Entrada de inventario registrada: Filtros de aceite' }
        ];
        
        let message = 'Notificaciones:\n\n';
        notifications.forEach((notif, index) => {
            message += `${index + 1}. ${notif.message}\n`;
        });
        
        alert(message);
    }

    showProfile() {
        alert('Perfil de usuario - Funcionalidad en desarrollo');
    }

    checkDarkModePreference() {
        const darkModePreference = localStorage.getItem('darkMode');
        if (darkModePreference === 'enabled') {
            document.body.classList.add('dark-mode');
            this.darkModeToggle.querySelector('i').textContent = 'light_mode';
        }
    }

    init() {
        this.checkDarkModePreference();
        console.log('Dashboard inicializado');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const dashboardManager = new DashboardManager();
    dashboardManager.init();
});