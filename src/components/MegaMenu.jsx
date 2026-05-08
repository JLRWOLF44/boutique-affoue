import { useState } from "react";
import styles from "./MegaMenu.module.css";

export default function MegaMenu({ setPage, openCategory, categories = [] }) {
  const menuData = [
    {
      title: "Vêtements",
      categories: categories,
    },
    {
      title: "Infos",
      categories: ["Favoris", "Panier", "Connexion", "Commande"],
    },
  ];

  const [activeMenu, setActiveMenu] = useState(menuData[0]);

  function handleItemClick(item) {
    if (categories.includes(item)) {
      openCategory(item);
      return;
    }

    if (item === "Favoris") setPage("favorites");
    else if (item === "Panier") setPage("cart");
    else if (item === "Connexion") setPage("auth");
    else if (item === "Commande") setPage("checkout");
    else setPage("shop");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        {menuData.map((menu) => (
          <button
            key={menu.title}
            type="button"
            className={
              activeMenu.title === menu.title
                ? `${styles.menuButton} ${styles.active}`
                : styles.menuButton
            }
            onClick={() => setActiveMenu(menu)}
          >
            {menu.title}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{activeMenu.title}</h3>

        <div className={styles.grid}>
          {activeMenu.categories.length === 0 ? (
            <p>Aucune catégorie disponible.</p>
          ) : (
            activeMenu.categories.map((item) => (
              <button
                key={item}
                type="button"
                className={styles.linkButton}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}