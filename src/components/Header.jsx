import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import MegaMenu from "./MegaMenu";

export default function Header({
  page,
  setPage,
  totalItems,
  totalFavorites,
  openCategory,
  search,
  setSearch,
  handleSearchSubmit,
}) {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMegaMenu(false);
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleToggleMegaMenu() {
    setShowMegaMenu((prev) => !prev);
  }

  function handleToggleMobileMenu() {
    setShowMobileMenu((prev) => !prev);
  }

  function handleNavigate(pageName) {
    setPage(pageName);
    setShowMegaMenu(false);
    setShowMobileMenu(false);
  }

  function handleOpenCategory(category) {
    openCategory(category);
    setShowMegaMenu(false);
    setShowMobileMenu(false);
  }

  return (
    <header className={styles.header} ref={menuRef}>
      <div className={styles.mainRow}>
        <button
          type="button"
          className={styles.logoButton}
          onClick={() => handleNavigate("shop")}
        >
          Boutique de ma femme
        </button>

        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Rechercher une catégorie : robe, veste, pull..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Rechercher
          </button>
        </form>

        <div className={styles.mobileActions}>
          <button
            type="button"
            className={showMegaMenu ? styles.activeDark : styles.darkButton}
            onClick={handleToggleMegaMenu}
          >
            Catégories
          </button>

          <button
            type="button"
            className={page === "cart" ? styles.activeDark : styles.darkButton}
            onClick={() => handleNavigate("cart")}
          >
            Panier ({totalItems})
          </button>

          <button
            type="button"
            className={showMobileMenu ? styles.activeLight : styles.lightButton}
            onClick={handleToggleMobileMenu}
          >
            ☰ Menu
          </button>
        </div>

        {showMegaMenu && (
          <div className={styles.dropdown}>
            <MegaMenu
              setPage={handleNavigate}
              openCategory={handleOpenCategory}
            />
          </div>
        )}

        {showMobileMenu && (
          <div className={styles.mobileMenu}>
            <button
              type="button"
              className={styles.mobileMenuItem}
              onClick={() => handleNavigate("favorites")}
            >
              Favoris ({totalFavorites})
            </button>

            <button
              type="button"
              className={styles.mobileMenuItem}
              onClick={() => handleNavigate("checkout")}
            >
              Commande
            </button>

            <button
              type="button"
              className={styles.mobileMenuItem}
              onClick={() => handleNavigate("auth")}
            >
              Connexion
            </button>
          </div>
        )}

        <div className={styles.desktopActions}>
          <button
            type="button"
            className={showMegaMenu ? styles.activeDark : styles.darkButton}
            onClick={handleToggleMegaMenu}
          >
            Catégories
          </button>

          <button
            type="button"
            className={page === "favorites" ? styles.activeLight : styles.lightButton}
            onClick={() => handleNavigate("favorites")}
          >
            Favoris ({totalFavorites})
          </button>

          <button
            type="button"
            className={page === "cart" ? styles.activeDark : styles.darkButton}
            onClick={() => handleNavigate("cart")}
          >
            Panier ({totalItems})
          </button>

          <button
            type="button"
            className={page === "auth" ? styles.activeDark : styles.darkButton}
            onClick={() => handleNavigate("auth")}
          >
            Connexion
          </button>
        </div>
      </div>
    </header>
  );
}