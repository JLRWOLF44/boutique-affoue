import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styles from "./AdminProducts.module.css";

export default function AdminProducts() {
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("add");

  const [form, setForm] = useState({
    name: "",
    brand: "",
    color: "",
    price: "",
    size: "",
    category: "",
    condition: "Très bon état",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur fetch products:", error);
      return;
    }

    setProducts(data || []);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      alert("Vous devez être connecté en admin.");
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${sessionData.session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Erreur upload image");
        return;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const newProduct = {
      name: form.name,
      brand: form.brand,
      color: form.color,
      price: Number(form.price),
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      size: form.size,
      category: form.category,
      condition: form.condition,
      description: form.description,
      is_sold: false,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error("Erreur ajout produit:", error);
      alert("Erreur ajout produit");
      return;
    }

    setProducts((prev) => [data, ...prev]);

    setForm({
      name: "",
      brand: "",
      color: "",
      price: "",
      size: "",
      category: "",
      condition: "Très bon état",
      description: "",
    });

    setImageFile(null);

    alert("Produit ajouté !");
  }

  async function markAsSold(productId) {
    const confirmSold = window.confirm(
      "Marquer ce produit comme vendu ? Il disparaîtra de la boutique."
    );

    if (!confirmSold) return;

    const { error } = await supabase
      .from("products")
      .update({ is_sold: true })
      .eq("id", productId);

    if (error) {
      console.error("Erreur produit vendu:", error);
      alert("Erreur lors du changement de statut.");
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, is_sold: true } : product
      )
    );
  }

  async function markAsAvailable(productId) {
    const { error } = await supabase
      .from("products")
      .update({ is_sold: false })
      .eq("id", productId);

    if (error) {
      console.error("Erreur remise en vente:", error);
      alert("Erreur lors de la remise en vente.");
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, is_sold: false } : product
      )
    );
  }

  async function deleteProduct(productId) {
    const confirmDelete = window.confirm(
      "Supprimer définitivement ce produit ?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Erreur suppression produit:", error);
      alert("Erreur lors de la suppression.");
      return;
    }

    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }

  return (
    <div className={styles.wrapper}>
      <h2>Gestion des produits</h2>

      <div className={styles.tabs}>
  <button onClick={() => setActiveTab("add")}>Ajouter un produit</button>
  <button onClick={() => setActiveTab("list")}>Voir les produits</button>
</div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nom du produit"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="brand"
          placeholder="Marque"
          value={form.brand}
          onChange={handleChange}
        />

        <input
          name="color"
          placeholder="Couleur"
          value={form.color}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Prix"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />

        <input
          name="size"
          placeholder="Taille"
          value={form.size}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Catégorie ex : Robe, Chaussures, Bijoux..."
          value={form.category}
          onChange={handleChange}
          required
        />

        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
        >
          <option value="Neuf">Neuf</option>
          <option value="Comme neuf">Comme neuf</option>
          <option value="Très bon état">Très bon état</option>
          <option value="Bon état">Bon état</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">Ajouter le produit</button>
      </form>

      <div className={styles.list}>
        {products.map((product) => (
          <div
            key={product.id}
            className={`${styles.card} ${
              product.is_sold ? styles.soldCard : ""
            }`}
          >
            <div className={styles.imageBox}>
              <img src={product.image} alt={product.name} />

              {product.is_sold && (
                <span className={styles.soldBadge}>Vendu</span>
              )}
            </div>

            <div className={styles.productInfo}>
              <h3>{product.name}</h3>

              <p>
                {product.category} · {product.size}
              </p>

              <strong>{product.price} €</strong>

              <div className={styles.actions}>
                {product.is_sold ? (
                  <button
                    type="button"
                    className={styles.availableButton}
                    onClick={() => markAsAvailable(product.id)}
                  >
                    Remettre en vente
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.soldButton}
                    onClick={() => markAsSold(product.id)}
                  >
                    Marquer vendu
                  </button>
                )}

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => deleteProduct(product.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}