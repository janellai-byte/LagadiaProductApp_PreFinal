
import { useState } from "react";

function AddProductForm({ onAddProduct }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !name.trim() ||
      !category.trim() ||
      price === "" ||
      quantity === "" ||
      Number(price) <= 0 ||
      Number(quantity) < 0
    ) {
      alert("Please enter valid product details.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      quantity: Number(quantity),
      image: image.trim() || "https://placehold.co/600x400?text=Product",
      description: description.trim() || "No description available.",
      specification: "Not specified",
      rating: 5,
    };

    onAddProduct(newProduct);

    setName("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setImage("");
    setDescription("");

    alert("Product added successfully!");
  }

  return (
    <section className="add-product-section">
      <h2>Add New Product</h2>
      <p className="form-description">
        Enter the details of the product you want to add.
      </p>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <label>
          Product Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter product name"
            required
          />
        </label>

        <label>
          Category
          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. Electronics"
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
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="0.00"
              required
            />
          </label>

          <label>
            Quantity
            <input
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="0"
              required
            />
          </label>
        </div>

        <label>
          Image URL
          <input
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder="https://example.com/product.jpg"
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your product"
            rows="3"
          />
        </label>

        <button className="add-to-cart-btn" type="submit">
          Add Product
        </button>
      </form>
    </section>
  );
}

export default AddProductForm;
