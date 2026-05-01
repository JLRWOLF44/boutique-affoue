import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styles from "./Admin.module.css";
import AdminProducts from "./AdminProducts";

export default function Admin({ goBack }) {
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session) {
        fetchOrders();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        fetchOrders();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération commandes :", error);
      return;
    }

    setOrders(data);
  }

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Erreur de connexion");
      console.error(error);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setOrders([]);
  }

  async function updateStatus(orderId, newStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Erreur lors du changement de statut");
      console.error(error);
      return;
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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
        <p>Commandes et produits</p>
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

    <div className={styles.adminInfo}>
      <p>
        Connecté en admin :
        <strong> {session.user.email}</strong>
      </p>
    </div>

    <section>
        <h3>Commandes reçues</h3>

        {orders.length === 0 ? (
          <p>Aucune commande pour le moment.</p>
        ) : (
          <div className={styles.orders}>
            {orders.map((order) => (
              <div key={order.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Commande #{order.id}</h3>
                  <span>
                    {new Date(order.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>

                <div className={styles.customer}>
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
                </div>

                <div className={styles.products}>
                  <h4>Articles</h4>

                  {order.cart?.map((item) => (
                    <div
                      key={`${order.id}-${item.id}`}
                      className={styles.item}
                    >
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} × {item.price} €
                      </span>
                    </div>
                  ))}
                </div>

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

                <div className={styles.total}>
                  <span>Total</span>
                  <strong>{order.total_price} €</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
<h3>Test formulaire produit</h3>
<AdminProducts />
      
    </div>
  );
}