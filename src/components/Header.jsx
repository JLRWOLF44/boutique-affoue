import styles from "./Header.module.css";

export default function Header({
  page,
  setPage,
  totalItems,
  totalFavorites,
}) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Boutique de ma femme</h1>

      <div className={styles.nav}>
        <button
          className={page === "shop" ? styles.active : styles.button}
          onClick={() => setPage("shop")}
        >
          Boutique
        </button>

        <button
          className={page === "favorites" ? styles.active : styles.button}
          onClick={() => setPage("favorites")}
        >
          Favoris ({totalFavorites})
        </button>

        <button
          className={page === "cart" ? styles.active : styles.button}
          onClick={() => setPage("cart")}
        >
          Panier ({totalItems})
        </button>

        <button
          className={page === "auth" ? styles.active : styles.button}
          onClick={() => setPage("auth")}
        >
          Connexion
        </button>
      </div>
    </header>
  );
}