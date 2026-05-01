import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styles from "./AdminProducts.module.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    color: "",
    price: "",
    image: "",
    images: "",
    size: "",
    category: "Robe",
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

    if (!error) setProducts(data);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const imageList = form.images
      ? form.images.split(",").map((img) => img.trim()).filter(Boolean)
      : [form.image];

    const newProduct = {
      name: form.name,
      brand: form.brand,
      color: form.color,
      price: Number(form.price),
      image: form.image,
      images: imageList,
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
      console.error(error);
      alert("Erreur lors de l'ajout du produit.");
      return;
    }

    setProducts((prev) => [data, ...prev]);

    setForm({
      name: "",
      brand: "",
      color: "",
      price: "",
      image: "",
      images: "",
      size: "",
      category: "Robe",
      condition: "Très bon état",
      description: "",
    });

    alert("Produit ajouté !");
  }

  return (
    <div className={styles.wrapper}>
      <h2>Gestion des produits</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom du produit" value={form.name} onChange={handleChange} required />
        <input name="brand" placeholder="Marque" value={form.brand} onChange={handleChange} />
        <input name="color" placeholder="Couleur" value={form.color} onChange={handleChange} />
        <input name="price" type="number" placeholder="Prix" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image principale URL" value={form.image} onChange={handleChange} required />
        <textarea name="images" placeholder="Autres images séparées par une virgule" value={form.images} onChange={handleChange} />
        <input name="size" placeholder="Taille" value={form.size} onChange={handleChange} />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Robe">Robe</option>
          <option value="Veste">Veste</option>
          <option value="Pull">Pull</option>
          <option value="Accessoire">Accessoire</option>
        </select>

        <select name="condition" value={form.condition} onChange={handleChange}>
          <option value="Neuf">Neuf</option>
          <option value="Comme neuf">Comme neuf</option>
          <option value="Très bon état">Très bon état</option>
          <option value="Bon état">Bon état</option>
        </select>

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <button type="submit">Ajouter le produit</button>
      </form>

      <div className={styles.list}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <img src={product.image} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>{product.category} · {product.size}</p>
              <strong>{product.price} €</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}