import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styles from "./Admin.module.css";
import AdminProducts from "./AdminProducts";
import AdminClients from "./AdminClients";

export default function Admin({ goBack }) {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPage, setAdminPage] = useState("orders");
  const [statusFilter, setStatusFilter] = useState("Toutes");
  const [resetDate, setResetDate] = useState(null);

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
      fetchDashboardSettings();
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

  async function fetchDashboardSettings() {
    const { data, error } = await supabase
      .from("dashboard_settings")
      .select("reset_date")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Erreur dashboard settings :", error);
      return;
    }

    setResetDate(data.reset_date);
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
    fetchDashboardSettings();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setOrders([]);
    setResetDate(null);
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

  async function resetDashboardStats() {
    const confirmReset = window.confirm(
      "Remettre les compteurs du dashboard à zéro ? Les commandes ne seront pas supprimées."
    );

    if (!confirmReset) return;

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("dashboard_settings")
      .update({ reset_date: now })
      .eq("id", 1);

    if (error) {
      console.error("Erreur reset dashboard :", error);
      alert("Erreur lors de la remise à zéro.");
      return;
    }

    setResetDate(now);
    alert("Compteurs remis à zéro !");
  }

  const filteredOrders =
    statusFilter === "Toutes"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const dashboardOrders = resetDate
    ? orders.filter(
        (order) => new Date(order.created_at) >= new Date(resetDate)
      )
    : orders;

  const totalRevenue = dashboardOrders.reduce(
    (total, order) => total + Number(order.total_price || 0),
    0
  );

  const soldProducts = dashboardOrders.reduce(
    (total, order) =>
      total +
      (order.cart?.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      ) || 0),
    0
  );

  function getStatusClass(status) {
    const cleanStatus = (status || "En attente").replace(/\s/g, "");
    return styles[cleanStatus] || "";
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

      <div className={styles.dashboard}>
        <div className={styles.statCard}>
          <h3>📦 Commandes</h3>
          <p>{dashboardOrders.length}</p>
        </div>

        <div className={styles.statCard}>
          <h3>💰 Chiffre d'affaires</h3>
          <p>{totalRevenue} €</p>
        </div>

        <div className={styles.statCard}>
          <h3>🛍️ Produits vendus</h3>
          <p>{soldProducts}</p>
        </div>
      </div>

      <button
        type="button"
        className={styles.resetStatsButton}
        onClick={resetDashboardStats}
      >
        Réinitialiser les compteurs
      </button>

      <div className={styles.adminTabs}>
        <button
          type="button"
          onClick={() => setAdminPage("orders")}
          className={adminPage === "orders" ? styles.activeTab : ""}
        >
          Commandes reçues
        </button>

        <button
          type="button"
          onClick={() => setAdminPage("products")}
          className={adminPage === "products" ? styles.activeTab : ""}
        >
          Gestion des produits
        </button>
      </div>

      <button
  type="button"
  onClick={() => setAdminPage("clients")}
  className={adminPage === "clients" ? styles.activeTab : ""}
>
  Clients
</button>

      {adminPage === "orders" && (
        <section>
          <h3>Commandes reçues</h3>

          <div className={styles.filters}>
            {[
              "Toutes",
              "En attente",
              "Confirmée",
              "Préparée",
              "Envoyée",
              "Terminée",
              "Annulée",
            ].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? styles.activeFilter : ""}
              >
                {status}
              </button>
            ))}
          </div>

          {orders.length === 0 ? (
            <p>Aucune commande pour le moment.</p>
          ) : filteredOrders.length === 0 ? (
            <p>Aucune commande avec ce statut.</p>
          ) : (
            <div className={styles.orders}>
              {filteredOrders.map((order) => (
                <div key={order.id} className={styles.card}>
                  <h3>Commande #{order.id}</h3>

                  <div
                    className={`${styles.statusBadge} ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status || "En attente"}
                  </div>

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
                    <label>Changer le statut :</label>

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
      )}

      {adminPage === "products" && <AdminProducts />}
      {adminPage === "clients" && <AdminClients orders={orders} />}
    </div>
  );
}