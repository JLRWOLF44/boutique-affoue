import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  addToCart,
  openProduct,
  toggleFavorite,
  favorites,
}) {
  const isFavorite = favorites.some((item) => item.id === product.id);

  const { name, price, image, size, condition, brand } = product;
  const displayedBrand = brand || name;
  const finalPrice = (price + 1.65).toFixed(2);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper} onClick={() => openProduct(product)}>
        <img src={image} alt={name} className={styles.image} />

        <button
          type="button"
          className={styles.favoriteButton}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.brand} onClick={() => openProduct(product)}>
          {displayedBrand}
        </h3>

        <p className={styles.meta}>
          {size} · {condition}
        </p>

        <p className={styles.price}>{price.toFixed(2)} €</p>
        <p className={styles.priceIncl}>{finalPrice} € incl.</p>

        <button
          type="button"
          className={styles.cartButton}
          onClick={() => addToCart(product)}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}