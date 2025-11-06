// Datos de ejemplo para repuestos de automóviles
const productsData = [
    {
        id: 1,
        name: "Filtro de Aceite Original",
        description: "Filtro de aceite para motor, alta durabilidad",
        category: "motor",
        type: "terminado",
        cost: 8.50,
        price: 15.99,
        stock: 45,
        minStock: 10,
        date: "2024-01-15"
    },
    {
        id: 2,
        name: "Pastillas de Freno Delanteras",
        description: "Juego de pastillas para frenos delanteros",
        category: "frenos",
        type: "terminado",
        cost: 25.00,
        price: 45.99,
        stock: 3,
        minStock: 5,
        date: "2024-01-10"
    },
    {
        id: 3,
        name: "Aceite Motor 5W-30 Sintético",
        description: "Aceite sintético de alto rendimiento",
        category: "motor",
        type: "terminado",
        cost: 12.00,
        price: 24.99,
        stock: 28,
        minStock: 15,
        date: "2024-01-18"
    },
    {
        id: 4,
        name: "Servicio de Cambio de Aceite",
        description: "Incluye mano de obra y filtro",
        category: "motor",
        type: "servicio",
        cost: 5.00,
        price: 35.00,
        stock: 0,
        minStock: 0,
        date: "2024-01-05"
    },
    {
        id: 5,
        name: "Amortiguadores Delanteros",
        description: "Par de amortiguadores para suspensión",
        category: "suspension",
        type: "terminado",
        cost: 45.00,
        price: 89.99,
        stock: 8,
        minStock: 4,
        date: "2024-01-12"
    },
    {
        id: 6,
        name: "Batería 12V 60Ah",
        description: "Batería de arranque, libre mantenimiento",
        category: "electrico",
        type: "terminado",
        cost: 65.00,
        price: 119.99,
        stock: 15,
        minStock: 5,
        date: "2024-01-20"
    },
    {
        id: 7,
        name: "Kit Mantenimiento Básico",
        description: "Incluye aceite, filtros y mano de obra",
        category: "motor",
        type: "combo",
        cost: 30.00,
        price: 79.99,
        stock: 12,
        minStock: 3,
        date: "2024-01-08"
    },
    {
        id: 8,
        name: "Bujías Iridium",
        description: "Juego de 4 bujías de alto rendimiento",
        category: "motor",
        type: "terminado",
        cost: 15.00,
        price: 32.99,
        stock: 0,
        minStock: 8,
        date: "2024-01-22"
    }
];

class AutoPartsManager {
    constructor() {
        this.products = [...productsData];
        this.filteredProducts = [...productsData];
        this.currentCategory = 'all';
        this.currentSort = 'name';
        this.searchTerm = '';
        this.nextId = this.products.length + 1;
        this.movements = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderProducts();
        this.loadSampleMovements();
    }

    initializeElements() {
        // Elementos DOM principales
        this.productsGrid = document.getElementById('productsGrid');
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortFilter = document.getElementById('sortFilter');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.addProductBtn = document.getElementById('addProductBtn');
        this.quickEntryBtn = document.getElementById('quickEntryBtn');
        this.notificationsBtn = document.getElementById('notificationsBtn');
        this.profileBtn = document.getElementById('profileBtn');
        this.menuItems = document.querySelectorAll('.sidebar .menu-item');
        this.tabs = document.querySelectorAll('.top-bar .tab');
        
        // Elementos del modal de producto
        this.productModal = document.getElementById('productModal');
        this.productForm = document.getElementById('productForm');
        this.modalTitle = document.getElementById('modalTitle');
        this.closeModal = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        // Elementos del modal de entrada
        this.entryModal = document.getElementById('entryModal');
        this.entryForm = document.getElementById('entryForm');
        this.entryProduct = document.getElementById('entryProduct');
        this.closeEntryModal = document.getElementById('closeEntryModal');
        this.cancelEntryBtn = document.getElementById('cancelEntryBtn');
    }

    setupEventListeners() {
        // Búsqueda en tiempo real
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterAndRenderProducts();
        });

        // Filtro por categoría
        this.categoryFilter.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.filterAndRenderProducts();
        });

        // Ordenamiento
        this.sortFilter.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortProducts();
            this.renderProducts();
        });

        // Modo oscuro
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Botones principales
        this.addProductBtn.addEventListener('click', () => this.openProductModal());
        this.quickEntryBtn.addEventListener('click', () => this.openEntryModal());

        // Gestión de modales
        this.closeModal.addEventListener('click', () => this.closeProductModal());
        this.cancelBtn.addEventListener('click', () => this.closeProductModal());
        this.productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));

        this.closeEntryModal.addEventListener('click', () => this.closeEntryModal());
        this.cancelEntryBtn.addEventListener('click', () => this.closeEntryModal());
        this.entryForm.addEventListener('submit', (e) => this.handleEntrySubmit(e));

        // Cerrar modales al hacer clic fuera
        this.productModal.addEventListener('click', (e) => {
            if (e.target === this.productModal) this.closeProductModal();
        });
        this.entryModal.addEventListener('click', (e) => {
            if (e.target === this.entryModal) this.closeEntryModal();
        });

        // Gestión del menú lateral
        this.menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMenuItemClick(e.currentTarget);
            });
        });

        // Gestión de pestañas
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTabClick(e.currentTarget);
            });
        });

        // Botones de acción
        this.notificationsBtn.addEventListener('click', () => this.showNotifications());
        this.profileBtn.addEventListener('click', () => this.showProfile());
    }

    filterAndRenderProducts() {
        let filteredProducts = [...this.products];

        // Aplicar filtro de búsqueda
        if (this.searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(this.searchTerm) || 
                product.description.toLowerCase().includes(this.searchTerm)
            );
        }

        // Aplicar filtro de categoría
        if (this.currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.currentCategory
            );
        }

        this.filteredProducts = filteredProducts;
        this.sortProducts();
        this.renderProducts();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch(this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'stock':
                    return a.stock - b.stock;
                case 'price':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });
    }

    renderProducts() {
        if (this.filteredProducts.length === 0) {
            this.productsGrid.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                    <i class="material-icons" style="font-size: 4rem; color: var(--color-text-light); margin-bottom: 1rem;">search_off</i>
                    <h3 style="color: var(--color-text-light); margin-bottom: 0.5rem;">No se encontraron repuestos</h3>
                    <p style="color: var(--color-text-light);">Intenta ajustar tus filtros de búsqueda</p>
                </div>
            `;
            return;
        }

        this.productsGrid.innerHTML = this.filteredProducts.map(product => {
            const stockStatus = this.getStockStatus(product);
            const badgeClass = this.getBadgeClass(product.type);
            const typeText = this.getTypeText(product.type);
            
            return `
                <div class="product-card ${stockStatus === 'low' ? 'low-stock' : ''} ${stockStatus === 'out' ? 'out-of-stock' : ''}" data-id="${product.id}">
                    <div class="card-icon">
                        <i class="material-icons">${this.getCategoryIcon(product.category)}</i>
                    </div>
                    <div class="card-details">
                        <h3 class="product-name">
                            ${product.name}
                            <span class="product-badge ${badgeClass}">${typeText}</span>
                        </h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-meta">
                            <span class="product-tag ${this.getStockTagClass(stockStatus)}">
                                Stock: ${product.stock}
                            </span>
                            <span class="product-tag price">
                                Venta: $${product.price.toFixed(2)}
                            </span>
                            <span class="product-tag cost">
                                Costo: $${product.cost.toFixed(2)}
                            </span>
                            <span class="product-tag">
                                ${this.getCategoryName(product.category)}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Añadir event listeners a las tarjetas de producto
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-id');
                const product = this.filteredProducts.find(p => p.id == productId);
                this.showProductDetails(product);
            });
        });
    }

    getStockStatus(product) {
        if (product.stock === 0) return 'out';
        if (product.stock <= product.minStock) return 'low';
        return 'normal';
    }

    getStockTagClass(stockStatus) {
        switch(stockStatus) {
            case 'low': return 'low-stock';
            case 'out': return 'no-stock';
            default: return 'stock';
        }
    }

    getCategoryIcon(category) {
        const icons = {
            'motor': 'engineering',
            'frenos': 'stop_circle',
            'suspension': 'settings',
            'electrico': 'power',
            'transmision': 'settings_input_component',
            'carroceria': 'car_repair'
        };
        return icons[category] || 'build';
    }

    getCategoryName(category) {
        const categories = {
            'motor': 'Motor',
            'frenos': 'Frenos',
            'suspension': 'Suspensión',
            'electrico': 'Eléctrico',
            'transmision': 'Transmisión',
            'carroceria': 'Carrocería'
        };
        return categories[category] || category;
    }

    getBadgeClass(type) {
        const classes = {
            'terminado': 'badge-terminado',
            'servicio': 'badge-servicio',
            'combo': 'badge-combo'
        };
        return classes[type] || '';
    }

    getTypeText(type) {
        const texts = {
            'terminado': 'Producto',
            'servicio': 'Servicio',
            'combo': 'Combo'
        };
        return texts[type] || type;
    }

    showProductDetails(product) {
        const stockStatus = this.getStockStatus(product);
        let statusText = 'Stock Normal';
        let statusColor = '#10b981';
        
        if (stockStatus === 'low') {
            statusText = 'Stock Bajo';
            statusColor = '#f59e0b';
        } else if (stockStatus === 'out') {
            statusText = 'Sin Stock';
            statusColor = '#ef4444';
        }

        const details = `
Detalles del Repuesto:

Nombre: ${product.name}
Descripción: ${product.description}
Categoría: ${this.getCategoryName(product.category)}
Tipo: ${this.getTypeText(product.type)}

Precio de Venta: $${product.price.toFixed(2)}
Costo: $${product.cost.toFixed(2)}
Margen: $${(product.price - product.cost).toFixed(2)} (${((product.price - product.cost) / product.cost * 100).toFixed(1)}%)

Stock Actual: ${product.stock}
Stock Mínimo: ${product.minStock}
Estado: ${statusText}

Última Actualización: ${new Date(product.date).toLocaleDateString()}
        `;

        alert(details);
    }

    openProductModal() {
        this.modalTitle.textContent = 'Agregar Nuevo Repuesto';
        this.productForm.reset();
        this.productModal.classList.add('active');
        document.getElementById('productDate').value = new Date().toISOString().split('T')[0];
    }

    closeProductModal() {
        this.productModal.classList.remove('active');
    }

    openEntryModal() {
        this.populateEntryProducts();
        this.entryModal.classList.add('active');
    }

    closeEntryModal() {
        this.entryModal.classList.remove('active');
        this.entryForm.reset();
    }

    populateEntryProducts() {
        this.entryProduct.innerHTML = '<option value="">Buscar producto...</option>';
        this.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Stock: ${product.stock})`;
            this.entryProduct.appendChild(option);
        });
    }

    handleProductSubmit(e) {
        e.preventDefault();
        
        const newProduct = {
            id: this.nextId++,
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            category: document.getElementById('productCategory').value,
            type: document.getElementById('productType').value,
            cost: parseFloat(document.getElementById('productCost').value),
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            minStock: parseInt(document.getElementById('productMinStock').value),
            date: new Date().toISOString().split('T')[0]
        };

        this.addProduct(newProduct);
        this.closeProductModal();
    }

    handleEntrySubmit(e) {
        e.preventDefault();
        
        const productId = parseInt(this.entryProduct.value);
        const quantity = parseInt(document.getElementById('entryQuantity').value);
        const cost = parseFloat(document.getElementById('entryCost').value);
        const notes = document.getElementById('entryNotes').value;

        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Actualizar stock y costo
            product.stock += quantity;
            product.cost = cost; // Actualizar costo
            
            // Registrar movimiento
            this.recordMovement('entrada', product, quantity, cost, notes);
            
            this.filterAndRenderProducts();
            this.showNotification(`Entrada registrada: ${quantity} unidades de ${product.name}`, 'success');
            this.closeEntryModal();
        }
    }

    addProduct(product) {
        this.products.push(product);
        this.filterAndRenderProducts();
        this.showNotification('Repuesto agregado correctamente', 'success');
    }

    recordMovement(type, product, quantity, cost, notes = '') {
        const movement = {
            id: this.movements.length + 1,
            type: type,
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            cost: cost,
            total: quantity * cost,
            date: new Date().toISOString(),
            notes: notes
        };
        
        this.movements.push(movement);
        this.updateStats();
    }

    updateStats() {
        // Actualizar estadísticas en tiempo real
        const totalProducts = this.products.length;
        const lowStockCount = this.products.filter(p => this.getStockStatus(p) === 'low').length;
        const outOfStockCount = this.products.filter(p => this.getStockStatus(p) === 'out').length;
        
        // Aquí podrías actualizar los elementos del DOM con las nuevas estadísticas
        console.log('Estadísticas actualizadas:', { totalProducts, lowStockCount, outOfStockCount });
    }

    loadSampleMovements() {
        // Cargar movimientos de ejemplo
        this.movements = [
            {
                id: 1,
                type: 'entrada',
                productId: 1,
                productName: 'Filtro de Aceite Original',
                quantity: 50,
                cost: 8.00,
                total: 400.00,
                date: '2024-01-15T10:30:00',
                notes: 'Proveedor: Repuestos SA'
            },
            {
                id: 2,
                type: 'salida',
                productId: 2,
                productName: 'Pastillas de Freno Delanteras',
                quantity: 2,
                cost: 25.00,
                total: 50.00,
                date: '2024-01-16T14:20:00',
                notes: 'Venta a cliente: Juan Pérez'
            }
        ];
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="material-icons">${type === 'success' ? 'check_circle' : 'info'}</i>
            <span>${message}</span>
        `;

        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-success)' : 
                        type === 'warning' ? 'var(--color-warning)' : 
                        type === 'error' ? 'var(--color-error)' : 'var(--color-primary)'};
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    handleMenuItemClick(clickedItem) {
        this.menuItems.forEach(item => {
            item.classList.remove('active', 'bottom-active');
        });
        
        clickedItem.classList.add('active');
        
        console.log(`Menú cambiado a: ${clickedItem.textContent.trim()}`);
    }

    handleTabClick(clickedTab) {
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        clickedTab.classList.add('active');
        
        // Filtrar productos por tipo según la pestaña
        const tabText = clickedTab.textContent;
        if (tabText === 'Productos Terminados') {
            this.currentCategory = 'all';
            this.filteredProducts = this.products.filter(p => p.type === 'terminado');
        } else if (tabText === 'Servicios') {
            this.currentCategory = 'all';
            this.filteredProducts = this.products.filter(p => p.type === 'servicio');
        } else if (tabText === 'Combos') {
            this.currentCategory = 'all';
            this.filteredProducts = this.products.filter(p => p.type === 'combo');
        } else {
            this.filterAndRenderProducts();
        }
        
        this.renderProducts();
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
    }

    showNotifications() {
        const lowStockProducts = this.products.filter(p => this.getStockStatus(p) === 'low');
        const outOfStockProducts = this.products.filter(p => this.getStockStatus(p) === 'out');
        
        let message = 'Alertas de Stock:\n\n';
        
        if (outOfStockProducts.length > 0) {
            message += 'SIN STOCK:\n';
            outOfStockProducts.forEach(p => {
                message += `• ${p.name}\n`;
            });
            message += '\n';
        }
        
        if (lowStockProducts.length > 0) {
            message += 'STOCK BAJO:\n';
            lowStockProducts.forEach(p => {
                message += `• ${p.name} (${p.stock} unidades)\n`;
            });
        }
        
        if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
            message = 'No hay alertas de stock en este momento';
        }
        
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
        this.updateStats();
        console.log('Sistema de gestión de repuestos inicializado');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const autoPartsManager = new AutoPartsManager();
    autoPartsManager.init();
});

// Añadir estilos de animación para las notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);