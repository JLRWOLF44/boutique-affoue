import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  addToCart,
  openProduct,
  toggleFavorite,
  favorites,
}) {
  const isFavorite = favorites.some((item) => item.id === product.id);

  return (
    <div className={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 className={styles.title} onClick={() => openProduct(product)}>
          {product.name}
        </h3>

        <span
          onClick={() => toggleFavorite(product)}
          style={{ cursor: "pointer", fontSize: "20px" }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </span>
      </div>

      <img
        src={product.image}
        alt={product.name}
        className={styles.image}
        onClick={() => openProduct(product)}
      />

      <p>{product.price} €</p>

      <button
        className={styles.button}
        onClick={() => addToCart(product)}
      >
        Ajouter au panier
      </button>
    </div>
  );
}