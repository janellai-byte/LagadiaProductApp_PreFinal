
import { useState } from "react";
import { initialProducts } from "./data/products";
import ProductCard from "./components/ProductCard";
import AddProductForm from "./components/AddProductForm";
import "./App.css";

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  function addProduct(newProduct) {
    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);
  }

  function editProduct(product) {
    setEditingProduct({ ...product });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveEditedProduct(event) {
    event.preventDefault();

    if (
      !editingProduct.name.trim() ||
      !editingProduct.category.trim() ||
      !Number.isFinite(Number(editingProduct.price)) ||
      Number(editingProduct.price) <= 0 ||
      !Number.isInteger(Number(editingProduct.quantity)) ||
      Number(editingProduct.quantity) < 0
    ) {
      alert("Please enter valid product details.");
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              ...editingProduct,
              name: editingProduct.name.trim(),
              category: editingProduct.category.trim(),
              price: Number(editingProduct.price),
              quantity:
                Number(editingProduct.quantity) -
                (cart.find((item) => item.id === product.id)?.quantity || 0),
            }
          : product
      )
    );

    setEditingProduct(null);
    alert("Product updated successfully!");
  }

  function deleteProduct(productId) {
    const product = products.find((item) => item.id === productId);

    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== productId)
    );

    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );

    if (editingProduct?.id === productId) {
      setEditingProduct(null);
    }
  }

  function addToCart(product) {
    if (product.quantity <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  function changeCartQuantity(productId, amount) {
    const product = products.find((item) => item.id === productId);
    const cartItem = cart.find((item) => item.id === productId);

    if (!product || !cartItem) return;

    if (amount > 0 && product.quantity <= 0) {
      alert("No more stock available.");
      return;
    }

    if (amount < 0 && cartItem.quantity <= 1) {
      removeFromCart(productId);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - amount }
          : item
      )
    );

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
    );
  }

  function removeFromCart(productId) {
    const cartItem = cart.find((item) => item.id === productId);

    if (!cartItem) return;

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + cartItem.quantity }
          : item
      )
    );

    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your products and shopping cart</p>
        </div>

        <div className="cart-count">🛒 Cart: {totalItems}</div>
      </header>

      <main className="main-content">
        {editingProduct && (
          <section className="add-product-section">
            <h2>Edit Product</h2>
            <p className="form-description">
              Update the details of this product.
            </p>

            <form
              className="add-product-form"
              onSubmit={saveEditedProduct}
            >
              <label>
                Product Name
                <input
                  value={editingProduct.name}
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: event.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Category
                <input
                  value={editingProduct.category}
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: event.target.value,
                    })
                  }
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Price (₱)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(event) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Stock Quantity
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editingProduct.quantity}
                    onChange={(event) =>
                      setEditingProduct({
                        ...editingProduct,
                        quantity: event.target.value,
                      })
                    }
                    required
                  />
                </label>
              </div>

              <label>
                Image URL
                <input
                  type="url"
                  value={editingProduct.image || ""}
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Description
                <textarea
                  rows="3"
                  value={editingProduct.description || ""}
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: event.target.value,
                    })
                  }
                />
              </label>

              <button className="add-to-cart-btn" type="submit">
                Save Changes
              </button>

              <button
                className="cancel-edit-btn"
                type="button"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </form>
          </section>
        )}

        <section className="products-section">
          <div className="section-heading">
            <div>
              <h2>Our Products</h2>
              <p>Browse our available products ({filteredProducts.length})</p>
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter products by category"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onEdit={editProduct}
                onDelete={deleteProduct}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p>No products found in this category.</p>
          )}
        </section>

        <AddProductForm onAddProduct={addProduct} />

        <section className="cart-section">
          <h2>Shopping Cart</h2>

          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-details">
                    <strong>{item.name}</strong>
                    <p>
                      ₱
                      {item.price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      × {item.quantity}
                    </p>
                  </div>

                  <div className="cart-actions">
                    <button
                      onClick={() => changeCartQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => changeCartQuantity(item.id, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-total">
                <span>Total</span>
                <strong>
                  ₱
                  {total.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Product Management App</p>
      </footer>
    </div>
  );
}

export default App;


