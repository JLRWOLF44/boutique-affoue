import { useState } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import Cart from "./components/cart";
import { products } from "./data/products";

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [page, setPage] = useState("shop");

  function addToCart(product) {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }

  function increaseQuantity(productId) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const filteredProducts =
    selectedCategory === "Toutes"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <div className="container">
      <Header page={page} setPage={setPage} totalItems={totalItems} />

      {page === "shop" && (
        <>
          <h2>Ma boutique</h2>

          <div>
            <button onClick={() => setSelectedCategory("Toutes")}>Toutes</button>
            <button onClick={() => setSelectedCategory("Robe")}>Robe</button>
            <button onClick={() => setSelectedCategory("Veste")}>Veste</button>
            <button onClick={() => setSelectedCategory("Pull")}>Pull</button>
            <button onClick={() => setSelectedCategory("Accessoire")}>
              Accessoire
            </button>
          </div>

          <div className="products">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </>
      )}

      {page === "cart" && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          totalPrice={totalPrice}
        />
      )}
    </div>
  );
}