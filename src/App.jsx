import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Favorites from "./components/Favorites";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import Admin from "./components/Admin";

import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [page, setPage] = useState("shop");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("");
  const [isAdminConnected, setIsAdminConnected] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/admin") {
      setPage("admin");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
  if (page === "shop") {
    fetchProducts();
  }
}, [page]);

  useEffect(() => {
  async function checkAdminSession() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      setIsAdminConnected(false);
      return;
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", data.session.user.id)
      .single();

    setIsAdminConnected(!!adminData);
  }

  checkAdminSession();
}, [page]);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_sold", false);

    if (error) {
      console.error(error);
    } else {
      setProducts(data || []);
    }

    setLoadingProducts(false);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setPage("product");
  }

  function openCategory(category) {
    setCurrentCategory(category);
    setPage("category");
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
    window.history.pushState({}, "", "/");
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const dynamicCategories = [
    ...new Set(products.map((p) => p.category?.trim()).filter(Boolean)),
  ];

  const categoryProducts = products.filter(
    (product) => product.category === currentCategory
  );

  if (page === "admin") {
    return (
      <div className="container">
        <Admin goBack={goToShop} />
      </div>
    );
  }

  return (
    <div className="container">
      <Header
        page={page}
        setPage={setPage}
        totalItems={cart.length}
        totalFavorites={favorites.length}
        categories={dynamicCategories}
        openCategory={openCategory}
        search={search}
        setSearch={setSearch}
        handleSearchSubmit={handleSearchSubmit}
      />
      {isAdminConnected && page !== "admin" && (
  <button
    className="adminReturnButton"
    onClick={() => {
      setPage("admin");
      window.history.pushState({}, "", "/admin");
    }}
  >
    Retour admin
  </button>
)}

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

      {page === "category" && (
        <>
          <button onClick={goToShop}>← Retour</button>

          <h2>{currentCategory}</h2>

          <div className="products">
            {categoryProducts.length === 0 ? (
              <p>Aucun produit</p>
            ) : (
              categoryProducts.map((product) => (
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

      {page === "product" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          addToCart={addToCart}
          goBack={goToShop}
        />
      )}

      {page === "cart" && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          goToCheckout={() => setPage("checkout")}
        />
      )}

      {page === "favorites" && (
        <Favorites
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          openProduct={openProduct}
        />
      )}

      {page === "checkout" && (
        <Checkout cart={cart} goBack={() => setPage("cart")} />
      )}

     {page === "auth" && (
  <Auth
    goToShop={goToShop}
    goToAdmin={() => {
      setPage("admin");
      window.history.pushState({}, "", "/admin");
    }}
  />
)}
    </div>
  );
}