import { useState } from "react";
import styles from "./Checkout.module.css";
import { supabase } from "../lib/supabaseClient";

export default function Checkout({ cart, totalPrice, goBack }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [isSending, setIsSending] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    setIsSending(true);

    const order = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      cart: cart,
      total_price: totalPrice,
    };

    const { error } = await supabase.from("orders").insert([order]);

    setIsSending(false);

    if (error) {
      console.error("Erreur Supabase :", error);
      alert("Erreur lors de l'envoi de la commande.");
      return;
    }

    alert("Commande envoyée avec succès !");
    console.log("Commande enregistrée :", order);
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

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSending}
          >
            {isSending ? "Envoi en cours..." : "Valider la commande"}
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