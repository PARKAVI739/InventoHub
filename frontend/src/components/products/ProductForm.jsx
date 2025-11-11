import { useEffect, useState } from 'react';

const defaultValues = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  category: ''
};

const ProductForm = ({ initialValues, categories = [], onSubmit, formId = 'product-form' }) => {
  const [form, setForm] = useState({ ...defaultValues, ...(initialValues || {}) });

  useEffect(() => {
    if (initialValues) {
      setForm({ ...defaultValues, ...initialValues });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form id={formId} className="form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category || null
      });
    }}>
      <div className="form-group">
        <label htmlFor="productName">Name</label>
        <input
          id="productName"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="productDescription">Description</label>
        <textarea
          id="productDescription"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="productPrice">Price</label>
          <input
            id="productPrice"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productQuantity">Quantity</label>
          <input
            id="productQuantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="productCategory">Category</label>
        <select
          id="productCategory"
          name="category"
          value={form.category || ''}
          onChange={handleChange}
        >
          <option value="">Unassigned</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default ProductForm;

