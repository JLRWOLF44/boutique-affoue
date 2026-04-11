import styles from "./ProductCard.module.css";

export default function ProductCard({ product, addToCart }) {
  const { name, price, image, size, category, condition } = product;

  return (
    <div className={styles.card}>
      <img src={image} alt={name} className={styles.image} />
      <h3>{name}</h3>
      <p>Prix : {price} €</p>
      <p>Taille : {size}</p>
      <p>Catégorie : {category}</p>
      <p>État : {condition}</p>

      <button
        className={styles.button}
        onClick={() => addToCart(product)}
      >
        Ajouter au panier
      </button>
    </div>
  );
}