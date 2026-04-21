import { useState, useEffect } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import { products } from "./data/products";

export default function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [page, setPage] = useState("shop");
  const [currentCategory, setCurrentCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previousPage, setPreviousPage] = useState("shop");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

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

  function toggleFavorite(product) {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  }

  function clearCart() {
    setCart([]);
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

  function openCategory(category) {
    setCurrentCategory(category);
    setPage("category");
  }

  function goBackToShop() {
    setCurrentCategory("");
    setSearch("");
    setPage("shop");
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setPreviousPage(page);
    setPage("product");
  }

  function goBackFromProduct() {
    setPage(previousPage);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();

    const value = search.trim().toLowerCase();

    if (value === "robe" || value === "robes") {
      openCategory("Robe");
    } else if (value === "veste" || value === "vestes") {
      openCategory("Veste");
    } else if (value === "pull" || value === "pulls") {
      openCategory("Pull");
    } else if (value === "accessoire" || value === "accessoires") {
      openCategory("Accessoire");
    } else {
      alert("Catégorie non trouvée. Essaie : robe, veste, pull ou accessoire.");
    }
  }

  function goToCheckout() {
    setPage("checkout");
  }

  function goBackToCart() {
    setPage("cart");
  }

  function goBackFromAuth() {
    setPage("shop");
  }

  const categoryProducts = products.filter(
    (product) => product.category === currentCategory
  );

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalFavorites = favorites.length;

  return (
    <div className="container">
      <Header
        page={page}
        setPage={setPage}
        totalItems={totalItems}
        totalFavorites={totalFavorites}
        openCategory={openCategory}
        search={search}
        setSearch={setSearch}
        handleSearchSubmit={handleSearchSubmit}
      />

      {page === "shop" && (
        <>
          <h2>Ma boutique</h2>

          <div className="products">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                openProduct={openProduct}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            ))}
          </div>
        </>
      )}

      {page === "category" && (
        <>
          <button onClick={goBackToShop}>Retour</button>
          <h2>{currentCategory}</h2>

          <div className="products">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                openProduct={openProduct}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            ))}
          </div>
        </>
      )}

      {page === "favorites" && (
        <>
          <h2>Mes favoris</h2>

          {favorites.length === 0 ? (
            <p>Aucun favori pour le moment.</p>
          ) : (
            <div className="products">
              {favorites.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  openProduct={openProduct}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              ))}
            </div>
          )}
        </>
      )}

      {page === "product" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          addToCart={addToCart}
          goBack={goBackFromProduct}
        />
      )}

      {page === "cart" && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          totalPrice={totalPrice}
          clearCart={clearCart}
          goToCheckout={goToCheckout}
        />
      )}

      {page === "checkout" && (
        <Checkout
          cart={cart}
          totalPrice={totalPrice}
          goBack={goBackToCart}
        />
      )}

      {page === "auth" && <Auth goToShop={goBackFromAuth} />}
    </div>
  );
}