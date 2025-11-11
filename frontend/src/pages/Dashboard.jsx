import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import Modal from '../components/Modal.jsx';
import ProductTable from '../components/products/ProductTable.jsx';
import ProductForm from '../components/products/ProductForm.jsx';
import CategoryForm from '../components/categories/CategoryForm.jsx';
import CategoryGrid from '../components/categories/CategoryGrid.jsx';

const createDefaultFilters = () => ({
  search: '',
  category: '',
  maxPrice: ''
});

const createDefaultModalState = () => ({
  type: null,
  payload: null,
  submitting: false
});

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [filters, setFilters] = useState(() => createDefaultFilters());
  const [draftFilters, setDraftFilters] = useState(() => createDefaultFilters());

  const [modal, setModal] = useState(() => createDefaultModalState());

  const greeting = useMemo(() => {
    if (!user) return 'Welcome back';
    const firstName = user.name.split(' ')[0];
    return `Welcome back, ${firstName}!`;
  }, [user]);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const { data } = await api.get('/categories');
      const payload = data?.data ?? data;
      if (!Array.isArray(payload)) {
        throw new Error('Invalid categories response');
      }
      setCategories(payload);
    } catch (error) {
      showToast(error.message || 'Failed to load categories', { type: 'error' });
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [showToast]);

  const fetchProducts = useCallback(async (page = 1, appliedFilters = filters) => {
    setProductsLoading(true);
    try {
      const params = {
        page,
        limit: 10
      };

      if (appliedFilters.search) params.search = appliedFilters.search;
      if (appliedFilters.category) params.category = appliedFilters.category;
      if (appliedFilters.maxPrice) params.maxPrice = appliedFilters.maxPrice;

      const { data } = await api.get('/products', { params });
      const payload = data?.data ?? data ?? {};
      const productList = Array.isArray(payload.products) ? payload.products : [];
      const paginationData = payload.pagination || {};
      setProducts(productList);
      setPagination((prev) => ({
        page: paginationData.page ?? prev.page,
        pages: paginationData.pages ?? prev.pages,
        total: paginationData.total ?? prev.total,
        limit: paginationData.limit ?? prev.limit
      }));
    } catch (error) {
      showToast(error.message || 'Failed to load products', { type: 'error' });
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(1, filters);
  }, [fetchProducts, filters]);

  const handleApplyFilters = () => {
    setFilters({ ...draftFilters });
  };

  const handleResetFilters = () => {
    setDraftFilters(createDefaultFilters());
    setFilters(createDefaultFilters());
  };

  const handleChangeDraftFilter = (event) => {
    const { name, value } = event.target;
    setDraftFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (type, payload = null) => {
    setModal({ type, payload, submitting: false });
  };

  const closeModal = () => {
    setModal(createDefaultModalState());
  };

  const handleCreateProduct = async (values) => {
    setModal((prev) => ({ ...prev, submitting: true }));
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        quantity: Number(values.quantity),
        category: values.category || undefined
      };
      await api.post('/products', payload);
      await fetchProducts(1, filters);
      showToast('Product added successfully', { type: 'success' });
      closeModal();
    } catch (error) {
      showToast(error.message || 'Failed to add product', { type: 'error' });
      setModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleUpdateProduct = async (values) => {
    setModal((prev) => ({ ...prev, submitting: true }));
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        quantity: Number(values.quantity),
        category: values.category || undefined
      };
      await api.put(`/products/${modal.payload._id}`, payload);
      await fetchProducts(pagination.page, filters);
      showToast('Product updated successfully', { type: 'success' });
      closeModal();
    } catch (error) {
      showToast(error.message || 'Failed to update product', { type: 'error' });
      setModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleDeleteProduct = async () => {
    setModal((prev) => ({ ...prev, submitting: true }));
    try {
      await api.delete(`/products/${modal.payload._id}`);
      const nextPage = Math.min(pagination.page, Math.ceil((pagination.total - 1) / pagination.limit) || 1);
      await fetchProducts(nextPage, filters);
      showToast('Product deleted successfully', { type: 'success' });
      closeModal();
    } catch (error) {
      showToast(error.message || 'Failed to delete product', { type: 'error' });
      setModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleCreateCategory = async (values) => {
    setModal((prev) => ({ ...prev, submitting: true }));
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || ''
      };
      await api.post('/categories', payload);
      await fetchCategories();
      showToast('Category created successfully', { type: 'success' });
      closeModal();
    } catch (error) {
      showToast(error.message || 'Failed to create category', { type: 'error' });
      setModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleUpdateCategory = async (values) => {
    setModal((prev) => ({ ...prev, submitting: true }));
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || ''
      };
      await api.put(`/categories/${modal.payload._id}`, payload);
      await fetchCategories();
      showToast('Category updated successfully', { type: 'success' });
      closeModal();
    } catch (error) {
      showToast(error.message || 'Failed to update category', { type: 'error' });
      setModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleDeleteCategory = async () => {
    setModal((prev) => ({ ...prev, submitting: true }));
    try {
      await api.delete(`/categories/${modal.payload._id}`);
      await fetchCategories();
      showToast('Category deleted successfully', { type: 'success' });
      closeModal();
    } catch (error) {
      showToast(error.message || 'Failed to delete category', { type: 'error' });
      setModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const renderModal = () => {
    if (!modal.type) {
      return null;
    }

    if (modal.type === 'product-create') {
      return (
        <Modal
          isOpen
          title="Add product"
          onClose={closeModal}
          footer={(
            <>
              <button type="button" className="btn subtle" onClick={closeModal} disabled={modal.submitting}>
                Cancel
              </button>
              <button type="submit" form="product-form" className="btn primary" disabled={modal.submitting}>
                {modal.submitting ? 'Saving...' : 'Create'}
              </button>
            </>
          )}
        >
          <ProductForm
            formId="product-form"
            categories={categories}
            onSubmit={handleCreateProduct}
          />
        </Modal>
      );
    }

    if (modal.type === 'product-edit') {
      return (
        <Modal
          isOpen
          title="Update product"
          onClose={closeModal}
          footer={(
            <>
              <button type="button" className="btn subtle" onClick={closeModal} disabled={modal.submitting}>
                Cancel
              </button>
              <button type="submit" form="product-form" className="btn primary" disabled={modal.submitting}>
                {modal.submitting ? 'Saving...' : 'Update'}
              </button>
            </>
          )}
        >
          <ProductForm
            formId="product-form"
            categories={categories}
            initialValues={{
              ...modal.payload,
              category: modal.payload?.category?._id || modal.payload?.category || ''
            }}
            onSubmit={handleUpdateProduct}
          />
        </Modal>
      );
    }

    if (modal.type === 'product-delete') {
      return (
        <Modal
          isOpen
          title="Delete product"
          onClose={closeModal}
          footer={(
            <>
              <button type="button" className="btn subtle" onClick={closeModal} disabled={modal.submitting}>
                Cancel
              </button>
              <button type="button" className="btn danger" onClick={handleDeleteProduct} disabled={modal.submitting}>
                {modal.submitting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        >
          <p>
            Are you sure you want to delete <strong>{modal.payload.name}</strong>? This action cannot be undone.
          </p>
        </Modal>
      );
    }

    if (modal.type === 'category-create') {
      return (
        <Modal
          isOpen
          title="Add category"
          onClose={closeModal}
          footer={(
            <>
              <button type="button" className="btn subtle" onClick={closeModal} disabled={modal.submitting}>
                Cancel
              </button>
              <button type="submit" form="category-form" className="btn primary" disabled={modal.submitting}>
                {modal.submitting ? 'Saving...' : 'Create'}
              </button>
            </>
          )}
        >
          <CategoryForm formId="category-form" onSubmit={handleCreateCategory} />
        </Modal>
      );
    }

    if (modal.type === 'category-edit') {
      return (
        <Modal
          isOpen
          title="Update category"
          onClose={closeModal}
          footer={(
            <>
              <button type="button" className="btn subtle" onClick={closeModal} disabled={modal.submitting}>
                Cancel
              </button>
              <button type="submit" form="category-form" className="btn primary" disabled={modal.submitting}>
                {modal.submitting ? 'Saving...' : 'Update'}
              </button>
            </>
          )}
        >
          <CategoryForm
            formId="category-form"
            initialValues={modal.payload}
            onSubmit={handleUpdateCategory}
          />
        </Modal>
      );
    }

    if (modal.type === 'category-delete') {
      return (
        <Modal
          isOpen
          title="Delete category"
          onClose={closeModal}
          footer={(
            <>
              <button type="button" className="btn subtle" onClick={closeModal} disabled={modal.submitting}>
                Cancel
              </button>
              <button type="button" className="btn danger" onClick={handleDeleteCategory} disabled={modal.submitting}>
                {modal.submitting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        >
          <p>
            Deleting <strong>{modal.payload.name}</strong> cannot be undone. Ensure no products are linked to this category.
          </p>
        </Modal>
      );
    }

    return null;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">IH</div>
          <div>
            <h1>InventoHub</h1>
            <p>Inventory at a glance</p>
          </div>
        </div>
        <nav className="nav">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={activeTab === 'products' ? 'active' : ''}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={activeTab === 'categories' ? 'active' : ''}
          >
            Categories
          </button>
          <button type="button" className="danger" onClick={logout}>
            Log Out
          </button>
        </nav>
      </aside>

      <main className="main">
        <header className="dashboard-header">
          <div>
            <h2>{greeting}</h2>
            <p>Let&apos;s keep your inventory organized.</p>
          </div>
          <div className="user-badge">
            <span>{user?.name}</span>
            <span className="role">{user?.role}</span>
          </div>
        </header>

        {activeTab === 'products' && (
        <section className="section">
          <div className="section-header">
            <div>
              <h3>Products</h3>
              <p>Track, filter, and update your stock in real time.</p>
            </div>
            <button type="button" className="btn primary" onClick={() => openModal('product-create')}>
              Add Product
            </button>
          </div>

          <div className="filters card">
            <div className="form-group">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                name="search"
                type="text"
                placeholder="Search products..."
                value={draftFilters.search}
                onChange={handleChangeDraftFilter}
              />
            </div>
            <div className="form-group">
              <label htmlFor="filterCategory">Category</label>
              <select
                id="filterCategory"
                name="category"
                value={draftFilters.category}
                onChange={handleChangeDraftFilter}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="maxPrice">Max price</label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                min="0"
                placeholder="No limit"
                value={draftFilters.maxPrice}
                onChange={handleChangeDraftFilter}
              />
            </div>
            <div className="actions">
              <button type="button" className="btn primary" onClick={handleApplyFilters}>
                Apply
              </button>
              <button type="button" className="btn subtle" onClick={handleResetFilters}>
                Reset
              </button>
            </div>
          </div>

          <section className="card">
            <ProductTable
              products={products}
              loading={productsLoading}
              onEdit={(product) => openModal('product-edit', product)}
              onDelete={(product) => openModal('product-delete', product)}
            />
            {pagination.pages > 1 ? (
              <div className="pagination">
                <button
                  type="button"
                  className="btn subtle"
                  onClick={() => fetchProducts(Math.max(1, pagination.page - 1), filters)}
                  disabled={pagination.page === 1 || productsLoading}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.pages} — {pagination.total} product
                  {pagination.total === 1 ? '' : 's'}
                </span>
                <button
                  type="button"
                  className="btn subtle"
                  onClick={() => fetchProducts(Math.min(pagination.pages, pagination.page + 1), filters)}
                  disabled={pagination.page === pagination.pages || productsLoading}
                >
                  Next
                </button>
              </div>
            ) : null}
          </section>
        </section>
        )}

        {activeTab === 'categories' && (
        <section className="section">
          <div className="section-header">
            <div>
              <h3>Categories</h3>
              <p>Organize products for faster discovery.</p>
            </div>
            <button type="button" className="btn primary" onClick={() => openModal('category-create')}>
              Add Category
            </button>
          </div>

          <section className="card">
            <CategoryGrid
              categories={categories}
              loading={categoriesLoading}
              onEdit={(category) => openModal('category-edit', category)}
              onDelete={(category) => openModal('category-delete', category)}
            />
          </section>
        </section>
        )}
      </main>

      {renderModal()}
    </div>
  );
};

export default DashboardPage;

