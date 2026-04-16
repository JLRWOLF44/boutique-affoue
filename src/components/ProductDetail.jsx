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
  } = product;

  const [mainImage, setMainImage] = useState(images[0]);
  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "center center",
  });

  const phoneNumber = "33612345678";

  const whatsappMessage = `Bonjour, je suis intéressée par l'article "${name}" à ${price} €. Est-il toujours disponible ?`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  function handleMouseMove(e) {
    if (window.innerWidth <= 768) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  }

  function handleMouseLeave() {
    if (window.innerWidth <= 768) return;

    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  }

  function handleThumbnailClick(img) {
    setMainImage(img);
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={goBack}>
        Retour
      </button>

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.imageContainer}>
            <img
              src={mainImage}
              alt={name}
              className={styles.mainImage}
              style={zoomStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          </div>

          <div className={styles.thumbnails}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${name} ${index + 1}`}
                className={
                  mainImage === img
                    ? `${styles.thumbnail} ${styles.active}`
                    : styles.thumbnail
                }
                onClick={() => handleThumbnailClick(img)}
              />
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <h2 className={styles.title}>{name}</h2>
          <p className={styles.price}>{price} €</p>

          <p className={styles.info}>
            <strong>Taille :</strong> {size}
          </p>

          <p className={styles.info}>
            <strong>Catégorie :</strong> {category}
          </p>

          <p className={styles.info}>
            <strong>État :</strong> {condition}
          </p>

          <p className={styles.description}>{description}</p>

          <button
            className={styles.cartButton}
            onClick={() => addToCart(product)}
          >
            Ajouter au panier
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className={styles.whatsappButton}
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}