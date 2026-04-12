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
  const [zoomStyle, setZoomStyle] = useState({});

  function handleMouseMove(e) {
    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  }

  function handleMouseLeave() {
    setZoomStyle({
      transform: "scale(1)",
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
                className={styles.thumbnail}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <h2 className={styles.title}>{name}</h2>
          <p className={styles.price}>{price} €</p>

          <p><strong>Taille :</strong> {size}</p>
          <p><strong>Catégorie :</strong> {category}</p>
          <p><strong>État :</strong> {condition}</p>

          <p className={styles.description}>{description}</p>

          <button
            className={styles.cartButton}
            onClick={() => addToCart(product)}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}