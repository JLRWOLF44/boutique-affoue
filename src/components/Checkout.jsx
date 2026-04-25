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

    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    alert("Commande envoyée ! Version test.");
    console.log("Client :", formData);
    console.log("Panier :", cart);
  }

  return (
    <div className={styles.checkout}>
      <button type="button" className={styles.backButton} onClick={goBack}>
        ← Retour au panier
      </button>

      <h2 className={styles.title}>Finaliser ma commande</h2>

      <div className={styles.layout}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h3>Informations client</h3>

          <div className={styles.formGrid}>
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="postalCode"
              placeholder="Code postal"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />

            <textarea
              name="address"
              placeholder="Adresse complète"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              className={styles.fullWidth}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Valider la commande
          </button>
        </form>

        <aside className={styles.summaryCard}>
          <h3>Récapitulatif</h3>

          {cart.length === 0 ? (
            <p className={styles.empty}>Votre panier est vide.</p>
          ) : (
            <>
              <div className={styles.items}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <img src={item.image} alt={item.name} />

                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>
                        {item.quantity} × {item.price} €
                      </p>
                    </div>

                    <strong>{item.quantity * item.price} €</strong>
                  </div>
                ))}
              </div>

              <div className={styles.total}>
                <span>Total</span>
                <strong>{totalPrice} €</strong>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}