import { useState } from "react";
import styles from "./MegaMenu.module.css";
import { menuData } from "../data/menuData";

export default function MegaMenu({ setPage, openCategory }) {
  const [activeMenu, setActiveMenu] = useState(menuData[0]);

  function handleItemClick(item) {
    if (["Robe", "Veste", "Pull", "Accessoire"].includes(item)) {
      openCategory(item);
      return;
    }

    if (item === "Favoris") {
      setPage("favorites");
      return;
    }

    if (item === "Panier") {
      setPage("cart");
      return;
    }

    if (item === "Connexion") {
      setPage("auth");
      return;
    }

    if (item === "Commande") {
      setPage("checkout");
      return;
    }

    setPage("shop");
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
          {activeMenu.categories.map((item) => (
            <button
              key={item}
              type="button"
              className={styles.linkButton}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}