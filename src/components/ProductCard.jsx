
function ProductCard({
  product,
  onAddToCart,
  onEdit,
  onDelete,
}) {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <p className="product-rating">
          ⭐ {product.rating}
        </p>

        <h3 className="product-price">
          ₱
          {product.price.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </h3>

        <p className="product-stock">
          Stock: {product.quantity}
        </p>

        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
          disabled={product.quantity <= 0}
        >
          {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>

        <div className="product-management-actions">
          <button
            className="edit-product-btn"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>

          <button
            className="delete-product-btn"
            onClick={() => onDelete(product.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

