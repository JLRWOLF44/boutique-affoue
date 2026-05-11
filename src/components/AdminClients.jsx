import styles from "./AdminClients.module.css";

export default function AdminClients({ orders }) {
  const clientsMap = new Map();

  orders.forEach((order) => {
    const phone = order.phone || "sans-telephone";

    if (!clientsMap.has(phone)) {
      clientsMap.set(phone, {
        firstName: order.first_name,
        lastName: order.last_name,
        phone: order.phone,
        address: order.address,
        postalCode: order.postal_code,
        city: order.city,
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: order.created_at,
      });
    }

    const client = clientsMap.get(phone);

    client.ordersCount += 1;
    client.totalSpent += Number(order.total_price || 0);

    if (new Date(order.created_at) > new Date(client.lastOrderDate)) {
      client.lastOrderDate = order.created_at;
    }
  });

  const clients = Array.from(clientsMap.values());

  return (
    <div className={styles.wrapper}>
      <h2>Clients</h2>

      {clients.length === 0 ? (
        <p>Aucun client pour le moment.</p>
      ) : (
        <div className={styles.list}>
          {clients.map((client) => (
            <div key={client.phone} className={styles.card}>
              <h3>
                {client.firstName} {client.lastName}
              </h3>

              <p>{client.phone}</p>

              <p>
                {client.address}, {client.postalCode} {client.city}
              </p>

              <div className={styles.stats}>
                <span>{client.ordersCount} commande(s)</span>
                <strong>{client.totalSpent} €</strong>
              </div>

              <small>
                Dernière commande :{" "}
                {new Date(client.lastOrderDate).toLocaleDateString("fr-FR")}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}