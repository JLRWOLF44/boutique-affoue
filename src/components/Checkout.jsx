import { useState } from "react";
import styles from "./Checkout.module.css";

export default function Checkout({ cart, totalPrice, goBack }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Commande envoyée ! (version test)");
    console.log("Client :", formData);
    console.log("Panier :", cart);
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.backButton} onClick={goBack}>
        Retour au panier
      </button>

      <h2 className={styles.title}>Finaliser la commande</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Récapitulatif</h3>

        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <div className={styles.summaryBox}>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>
                  {item.quantity} x {item.price} €
                </p>
                <p>Sous-total : {item.quantity * item.price} €</p>
              </div>
            ))}

            <p className={styles.total}>Total : {totalPrice} €</p>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informations client</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <input
              className={styles.input}
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              className={styles.input}
              type="text"
              name="lastName"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              className={styles.input}
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              className={`${styles.input} ${styles.fullWidth}`}
              name="address"
              placeholder="Adresse complète"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              required
            />

            <input
              className={styles.input}
              type="text"
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <input
              className={styles.input}
              type="text"
              name="postalCode"
              placeholder="Code postal"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.button} type="submit">
            Valider la commande
          </button>
        </form>
      </div>
    </div>
  );
}