import { useState } from "react";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product, addToCart, goBack }) {
  const {
    name,
    price,
    images,
    size,
    category,
    condition,
    description,
    brand,
    color,
  } = product;

  const [mainImage, setMainImage] = useState(images[0]);

  const displayedBrand = brand || "Sans marque";
  const displayedColor = color || "Non précisée";
  const finalPrice = (price + 1.65).toFixed(2);

  const phoneNumber = "33612345678";
  const whatsappMessage = `Bonjour, je suis intéressée par l'article "${name}" à ${price} €. Est-il toujours disponible ?`;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.backButton} onClick={goBack}>
        Retour
      </button>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <img src={mainImage} alt={name} className={styles.mainImage} />
          </div>

          <div className={styles.thumbnailGrid}>
            {images.map((img, index) => (
              <button
                type="button"
                key={index}
                className={
                  mainImage === img
                    ? `${styles.thumbButton} ${styles.thumbActive}`
                    : styles.thumbButton
                }
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`${name} ${index + 1}`}
                  className={styles.thumbnail}
                />
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h1 className={styles.title}>{name}</h1>

            <p className={styles.meta}>
              {size} · {condition} ·{" "}
              <span className={styles.brand}>{displayedBrand}</span>
            </p>

            <div className={styles.priceBlock}>
              <p className={styles.price}>{price.toFixed(2)} €</p>
         
            </div>

            <div className={styles.infoTable}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Marque</span>
                <span className={styles.infoValue}>{displayedBrand}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Taille</span>
                <span className={styles.infoValue}>{size}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>État</span>
                <span className={styles.infoValue}>{condition}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Catégorie</span>
                <span className={styles.infoValue}>{category}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Couleur</span>
                <span className={styles.infoValue}>{displayedColor}</span>
              </div>
            </div>

            <div className={styles.descriptionBlock}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>{description}</p>
            </div>

          <div className={styles.actions}>
  <button
    type="button"
    className={styles.buyButton}
    onClick={() => addToCart(product)}
  >
    Ajouter au panier
  </button>

  <a
    href={whatsappLink}
    target="_blank"
    rel="noreferrer"
    className={styles.messageButton}
  >
    Contacter
  </a>
</div>
          </div>
        </aside>
      </div>
    </div>
  );
}