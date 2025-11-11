import { useEffect, useState } from 'react';

const defaultValues = {
  name: '',
  description: ''
};

const CategoryForm = ({ initialValues, onSubmit, formId = 'category-form' }) => {
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
    <form
      id={formId}
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="form-group">
        <label htmlFor="categoryName">Name</label>
        <input
          id="categoryName"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="categoryDescription">Description</label>
        <textarea
          id="categoryDescription"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
        />
      </div>
    </form>
  );
};

export default CategoryForm;

