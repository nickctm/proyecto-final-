// Gestión de la página de productos
class ProductsManager {
    constructor() {
        this.products = [
            {
                code: 'FLT-001',
                name: 'Filtro de Aceite Premium',
                category: 'filtros',
                type: 'antes',
                price: 25,
                stock: 145,
                supplier: 'AutoParts SA',
                status: 'active'
            },
            {
                code: 'FRN-002',
                name: 'Pastillas de Freno Delanteras',
                category: 'frenos',
                type: 'sans',
                price: 85,
                stock: 12,
                supplier: 'Brembo',
                status: 'active'
            },
            {
                code: 'ACT-003',
                name: 'Aceite Motor 10W-40',
                category: 'lubricantes',
                type: 'antes',
                price: 45,
                stock: 89,
                supplier: 'Castrol',
                status: 'active'
            },
            {
                code: 'LLT-004',
                name: 'Llanta 185/65 R15',
                category: 'llantas',
                type: 'sans',
                price: 180,
                stock: 24,
                supplier: 'Michelin',
                status: 'active'
            },
            {
                code: 'BAT-005',
                name: 'Batería 12V 45Ah',
                category: 'electricos',
                type: 'sans',
                price: 220,
                stock: 8,
                supplier: 'Bosch',
                status: 'active'
            },
            {
                code: 'CDN-006',
                name: 'Cadena de Transmisión',
                category: 'transmision',
                type: 'mate',
                price: 95,
                stock: 18,
                supplier: 'DID',
                status: 'active'
            }
        ];

        this.filteredProducts = [...this.products];
        this.currentCategory = 'all';
        this.currentStatus = 'all';
        this.searchTerm = '';

        this.initializeElements();
        this.setupEventListeners();
        this.updateProductsCount();
    }

    initializeElements() {
        // Elementos DOM principales
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.addProductBtn = document.getElementById('addProductBtn');
        this.filterBtn = document.getElementById('filterBtn');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.notificationsBtn = document.getElementById('notificationsBtn');
        this.profileBtn = document.getElementById('profileBtn');
        
        // Elementos del modal
        this.productModal = document.getElementById('productModal');
        this.productForm = document.getElementById('productForm');
        this.closeModal = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
    }

    setupEventListeners() {
        // Búsqueda en tiempo real
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterProducts();
        });

        // Filtros
        this.categoryFilter.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.filterProducts();
        });

        this.statusFilter.addEventListener('change', (e) => {
            this.currentStatus = e.target.value;
            this.filterProducts();
        });

        // Botones principales
        this.addProductBtn.addEventListener('click', () => this.openProductModal());
        this.filterBtn.addEventListener('click', () => this.toggleAdvancedFilters());

        // Gestión de modal
        this.closeModal.addEventListener('click', () => this.closeProductModal());
        this.cancelBtn.addEventListener('click', () => this.closeProductModal());
        this.productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));

        // Cerrar modal al hacer clic fuera
        this.productModal.addEventListener('click', (e) => {
            if (e.target === this.productModal) this.closeProductModal();
        });

        // Botones de acción
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        this.notificationsBtn.addEventListener('click', () => this.showNotifications());
        this.profileBtn.addEventListener('click', () => this.showProfile());

        // Event listeners para botones de acción en la tabla
        this.setupTableEventListeners();
    }

    setupTableEventListeners() {
        // Botones de editar
        document.querySelectorAll('.icon-btn.primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = e.target.closest('tr');
                const code = row.querySelector('.code-cell').textContent;
                this.editProduct(code);
            });
        });

        // Botones de desactivar
        document.querySelectorAll('.icon-btn.warning').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = e.target.closest('tr');
                const code = row.querySelector('.code-cell').textContent;
                this.toggleProductStatus(code);
            });
        });

        // Botones de estado
        document.querySelectorAll('.icon-btn.success').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = e.target.closest('tr');
                const code = row.querySelector('.code-cell').textContent;
                this.showProductDetails(code);
            });
        });
    }

    filterProducts() {
        let filtered = [...this.products];

        // Aplicar filtro de búsqueda
        if (this.searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.code.toLowerCase().includes(this.searchTerm) ||
                product.supplier.toLowerCase().includes(this.searchTerm)
            );
        }

        // Aplicar filtro de categoría
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(product => 
                product.category === this.currentCategory
            );
        }

        // Aplicar filtro de estado
        if (this.currentStatus !== 'all') {
            if (this.currentStatus === 'low-stock') {
                filtered = filtered.filter(product => product.stock < 20);
            } else {
                filtered = filtered.filter(product => product.status === this.currentStatus);
            }
        }

        this.filteredProducts = filtered;
        this.updateProductsCount();
    }

    updateProductsCount() {
        const countElement = document.querySelector('.section-title');
        if (countElement) {
            countElement.textContent = `Lista de Productos (${this.filteredProducts.length})`;
        }
    }

    openProductModal() {
        this.productModal.classList.add('active');
    }

    closeProductModal() {
        this.productModal.classList.remove('active');
        this.productForm.reset();
    }

    handleProductSubmit(e) {
        e.preventDefault();
        
        const newProduct = {
            code: document.getElementById('productCode').value,
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            type: document.getElementById('productType').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            supplier: document.getElementById('productSupplier').value,
            description: document.getElementById('productDescription').value,
            status: 'active'
        };

        this.addProduct(newProduct);
        this.closeProductModal();
    }

    addProduct(product) {
        this.products.push(product);
        this.filterProducts();
        this.showNotification('Producto agregado correctamente', 'success');
        
        // En una implementación real, aquí actualizarías la tabla
        console.log('Producto agregado:', product);
    }

    editProduct(code) {
        const product = this.products.find(p => p.code === code);
        if (product) {
            // Llenar el modal con los datos del producto
            document.getElementById('productCode').value = product.code;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productType').value = product.type;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productSupplier').value = product.supplier;
            document.getElementById('productDescription').value = product.description || '';
            
            this.openProductModal();
        }
    }

    toggleProductStatus(code) {
        const product = this.products.find(p => p.code === code);
        if (product) {
            product.status = product.status === 'active' ? 'inactive' : 'active';
            this.showNotification(`Producto ${product.status === 'active' ? 'activado' : 'desactivado'}`, 'info');
            
            // En una implementación real, aquí actualizarías la interfaz
            console.log('Estado cambiado:', product);
        }
    }

    showProductDetails(code) {
        const product = this.products.find(p => p.code === code);
        if (product) {
            const details = `
Detalles del Producto:

Código: ${product.code}
Nombre: ${product.name}
Categoría: ${this.getCategoryName(product.category)}
Tipo: ${product.type}
Precio: $${product.price}
Stock: ${product.stock} unidades
Proveedor: ${product.supplier}
Estado: ${product.status === 'active' ? 'Activo' : 'Inactivo'}
${product.description ? `Descripción: ${product.description}` : ''}
            `;
            alert(details);
        }
    }

    getCategoryName(category) {
        const categories = {
            'filtros': 'Filtros',
            'frenos': 'Frenos',
            'lubricantes': 'Lubricantes',
            'llantas': 'Llantas',
            'electricos': 'Eléctricos',
            'transmision': 'Transmisión'
        };
        return categories[category] || category;
    }

    toggleAdvancedFilters() {
        // Implementar filtros avanzados
        this.showNotification('Funcionalidad de filtros avanzados en desarrollo', 'info');
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
        const lowStockProducts = this.products.filter(p => p.stock < 20);
        
        let message = 'Notificaciones:\n\n';
        
        if (lowStockProducts.length > 0) {
            message += 'STOCK BAJO:\n';
            lowStockProducts.forEach(p => {
                message += `• ${p.name} (${p.stock} unidades)\n`;
            });
        } else {
            message += 'No hay notificaciones en este momento';
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

    init() {
        this.checkDarkModePreference();
        console.log('Gestión de productos inicializada');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const productsManager = new ProductsManager();
    productsManager.init();
});