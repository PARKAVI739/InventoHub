const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  }).format(value);

const formatDate = (date) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="empty-state">Loading products...</div>;
  }

  if (!products.length) {
    return <div className="empty-state">No products found. Start by adding a product.</div>;
  }

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <div className="cell-title">{product.name}</div>
                {product.description ? <small className="muted">{product.description}</small> : null}
              </td>
              <td>{product.category?.name || '—'}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{formatDate(product.updatedAt)}</td>
              <td>
                <div className="actions">
                  <button type="button" className="btn subtle" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button type="button" className="btn danger" onClick={() => onDelete(product)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;



