// Admin.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import styles from "./Admin.module.css"; // Créez ce fichier CSS Module

export default function Admin({ goBack }) {
  const [activeTab, setActiveTab] = useState("list"); // "list" ou "add"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image_url: ""
  });

  // Charger les produits au montage
  useEffect(() => {
    if (activeTab === "list") {
      fetchProducts();
    }
  }, [activeTab]);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const { error } = await supabase.from("products").insert([
      {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
        is_sold: false
      }
    ]);

    if (error) {
      console.error("Erreur d'ajout:", error);
      alert("Erreur lors de l'ajout du produit");
    } else {
      alert("Produit ajouté avec succès !");
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        image_url: ""
      });
      setActiveTab("list");
      fetchProducts();
    }
  }

  async function deleteProduct(productId) {
    if (!confirm("Supprimer ce produit ?")) return;
    
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Erreur:", error);
    } else {
      fetchProducts();
    }
  }

  function handleInputChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <button onClick={goBack} className={styles.backButton}>
          ← Retour à la boutique
        </button>
        <h1>Administration</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "list" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("list")}
        >
          📦 Liste des produits
        </button>
        <button
          className={`${styles.tab} ${activeTab === "add" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Ajouter un produit
        </button>
      </div>

      {activeTab === "add" && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Ajouter un nouveau produit</h2>
          
          <div className={styles.formGroup}>
            <label>Nom du produit *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Ex: T-shirt vintage"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Prix (€) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Description du produit..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Catégorie</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Ex: Vêtements, Accessoires, etc."
            />
          </div>

          <div className={styles.formGroup}>
            <label>URL de l'image</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Ajouter le produit
          </button>
        </form>
      )}

      {activeTab === "list" && (
        <div className={styles.list}>
          <h2>Gestion des produits</h2>
          
          {loading ? (
            <p>Chargement...</p>
          ) : products.length === 0 ? (
            <p>Aucun produit trouvé</p>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                  )}
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p className={styles.price}>{product.price}€</p>
                    <p className={styles.category}>{product.category}</p>
                    <p className={styles.description}>
                      {product.description?.substring(0, 100)}...
                    </p>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className={styles.deleteButton}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}