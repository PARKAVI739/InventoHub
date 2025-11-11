const CategoryGrid = ({ categories, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="empty-state">Loading categories...</div>;
  }

  if (!categories.length) {
    return (
      <div className="empty-state">
        No categories yet. Create your first category to begin.
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {categories.map((category) => (
        <div key={category._id} className="category-card">
          <h4>{category.name}</h4>
          <p>{category.description || 'No description provided.'}</p>
          <div className="actions">
            <button type="button" className="btn subtle" onClick={() => onEdit(category)}>
              Edit
            </button>
            <button type="button" className="btn danger" onClick={() => onDelete(category)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;



