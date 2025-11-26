// Tema claro/oscuro
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

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