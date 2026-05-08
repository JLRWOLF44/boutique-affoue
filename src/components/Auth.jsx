import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styles from "./Auth.module.css";

export default function Auth({ goToShop, goToAdmin }) {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (mode === "register") {
      alert("Inscription client non activée pour le moment.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert("Email ou mot de passe incorrect.");
      console.error(error);
      return;
    }

    const userId = data.user.id;

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .single();

    if (adminData) {
      alert("Connexion admin réussie !");
      goToAdmin();
    } else {
      alert("Connexion réussie !");
      goToShop();
    }
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={goToShop}>
        Retour
      </button>

      <h2 className={styles.title}>
        {mode === "login" ? "Connexion" : "Inscription"}
      </h2>

      <div className={styles.switch}>
        <button
          type="button"
          className={mode === "login" ? styles.active : ""}
          onClick={() => setMode("login")}
        >
          Connexion
        </button>

        <button
          type="button"
          className={mode === "register" ? styles.active : ""}
          onClick={() => setMode("register")}
        >
          Inscription
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className={styles.button} type="submit">
          {mode === "login" ? "Se connecter" : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}