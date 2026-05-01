import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";

import Cart from "./components/Cart";
import Favorites from "./components/Favorites";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import Admin from "./components/Admin";

import { supabase } from "./lib/supabaseClient";
import ProductDetail from "./components/ProductDetail";

export default function App() {
  const [page, setPage] = useState("shop");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("");

  // 🔥 PRODUITS SUPABASE
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 🔥 ROUTE /admin
  useEffect(() => {
    if (window.location.pathname === "/admin") {
      setPage("admin");
    }
  }, []);

  // 🔥 FETCH PRODUITS
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_sold", false);

    if (error) {
      console.error("Erreur produits :", error);
    } else {
      setProducts(data);
    }

    setLoadingProducts(false);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setPage("product");
  }

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function toggleFavorite(product) {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === product.id);

      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }

      return [...prev, product];
    });
  }

  function goToShop() {
    setPage("shop");
    setSelectedProduct(null);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <Header
        page={page}
        setPage={setPage}
        totalItems={cart.length}
        totalFavorites={favorites.length}
        search={search}
        setSearch={setSearch}
        handleSearchSubmit={handleSearchSubmit}
      />

      {/* 🛍️ BOUTIQUE */}
      {page === "shop" && (
        <>
          <h2>Ma boutique</h2>

          <div className="products">
            {loadingProducts ? (
              <p>Chargement...</p>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  openProduct={openProduct}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* 📄 PRODUIT */}
      {page === "product" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          addToCart={addToCart}
          goBack={goToShop}
        />
      )}

      {/* 🛒 PANIER */}
      {page === "cart" && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          goToCheckout={() => setPage("checkout")}
        />
      )}

      {/* ❤️ FAVORIS */}
      {page === "favorites" && (
        <Favorites
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          openProduct={openProduct}
        />
      )}

      {/* 💳 CHECKOUT */}
      {page === "checkout" && (
        <Checkout cart={cart} goBack={() => setPage("cart")} />
      )}

      {/* 🔐 AUTH */}
      {page === "auth" && <Auth goToShop={goToShop} />}

      {/* 🔥 ADMIN */}
      {page === "admin" && <Admin goBack={goToShop} />}
    </div>
  );
}