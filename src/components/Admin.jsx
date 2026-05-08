import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styles from "./Admin.module.css";
import AdminProducts from "./AdminProducts";

export default function Admin({ goBack }) {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Erreur session :", error);
    }

    setSession(data.session);
    setLoadingSession(false);

    if (data.session) {
      fetchOrders();
    }
  }

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur commandes :", error);
      return;
    }

    setOrders(data || []);
  }

  async function handleLogin(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Erreur de connexion : vérifie ton email et ton mot de passe.");
      console.error(error);
      return;
    }

    setSession(data.session);
    fetchOrders();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setOrders([]);
  }

  async function updateStatus(orderId, newStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Erreur changement statut");
      console.error(error);
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }

  if (loadingSession) {
    return <p>Chargement admin...</p>;
  }

  if (!session) {
    return (
      <div className={styles.login}>
        <h2>Connexion admin</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Se connecter</button>
        </form>

        <button type="button" onClick={goBack}>
          Retour boutique
        </button>
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <div>
          <h2>Administration</h2>
          <p>Connecté : {session.user.email}</p>
        </div>

        <div>
          <button type="button" onClick={goBack}>
            Boutique
          </button>

          <button type="button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <section>
        <h3>Commandes reçues</h3>

        {orders.length === 0 ? (
          <p>Aucune commande pour le moment.</p>
        ) : (
          <div className={styles.orders}>
            {orders.map((order) => (
              <div key={order.id} className={styles.card}>
                <h3>Commande #{order.id}</h3>

                <p>
                  <strong>Client :</strong> {order.first_name}{" "}
                  {order.last_name}
                </p>

                <p>
                  <strong>Téléphone :</strong> {order.phone}
                </p>

                <p>
                  <strong>Adresse :</strong> {order.address},{" "}
                  {order.postal_code} {order.city}
                </p>

                <h4>Articles</h4>

                {order.cart?.map((item) => (
                  <p key={`${order.id}-${item.id}`}>
                    {item.name} x{item.quantity} — {item.price} €
                  </p>
                ))}

                <div className={styles.statusBox}>
                  <label>Statut :</label>

                  <select
                    value={order.status || "En attente"}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="Préparée">Préparée</option>
                    <option value="Envoyée">Envoyée</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>

                <strong>Total : {order.total_price} €</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <AdminProducts />
    </div>
  );
}