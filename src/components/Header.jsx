import { useEffect, useState } from "react";
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  useEffect(() => {
    if (showMegaMenu || showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMegaMenu, showMobileMenu]);

  function goTo(pageName) {
    setPage(pageName);
    setShowMobileMenu(false);
    setShowMegaMenu(false);
  }

  function handleCategory(category) {
    openCategory(category);
    setShowMobileMenu(false);
    setShowMegaMenu(false);
  }

  function closeAllMenus() {
    setShowMobileMenu(false);
    setShowMegaMenu(false);
  }

  return (
    <header className={styles.header}>
      {(showMegaMenu || showMobileMenu) && (
        <div className={styles.overlay} onClick={closeAllMenus} />
      )}

      <div className={styles.mobileHeader}>
        <div className={styles.mobileTop}>
          <button
            type="button"
            className={styles.logo}
            onClick={() => goTo("shop")}
          >
            Boutique de ma femme
          </button>

          <button
            type="button"
            className={styles.burger}
            onClick={() => {
              setShowMobileMenu((prev) => !prev);
              setShowMegaMenu(false);
            }}
          >
            ☰
          </button>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>

        {showMobileMenu && (
          <div className={styles.mobileMenu}>
            <div className={styles.menuHeader}>
              <span>Menu</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeAllMenus}
              >
                ✕
              </button>
            </div>

            <button type="button" onClick={() => goTo("shop")}>
              Boutique
            </button>

            <button
              type="button"
              onClick={() => setShowMegaMenu((prev) => !prev)}
            >
              Catégories
            </button>

            {showMegaMenu && (
              <div className={styles.mobileMega}>
                <MegaMenu setPage={goTo} openCategory={handleCategory} />
              </div>
            )}

            <button type="button" onClick={() => goTo("favorites")}>
              Favoris ({totalFavorites})
            </button>

            <button type="button" onClick={() => goTo("cart")}>
              Panier ({totalItems})
            </button>

            <button type="button" onClick={() => goTo("checkout")}>
              Commande
            </button>

            <button type="button" onClick={() => goTo("auth")}>
              Connexion
            </button>
          </div>
        )}
      </div>

      <div className={styles.desktopHeader}>
        <button
          type="button"
          className={styles.logo}
          onClick={() => goTo("shop")}
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
          <button type="submit" className={styles.searchButtonDesktop}>
            Rechercher
          </button>
        </form>

        <div className={styles.desktopButtons}>
          <button
            type="button"
            onClick={() => {
              setShowMegaMenu((prev) => !prev);
              setShowMobileMenu(false);
            }}
          >
            Catégories
          </button>

          <button type="button" onClick={() => goTo("favorites")}>
            Favoris ({totalFavorites})
          </button>

          <button type="button" onClick={() => goTo("cart")}>
            Panier ({totalItems})
          </button>

          <button type="button" onClick={() => goTo("auth")}>
            Connexion
          </button>
        </div>

        {showMegaMenu && (
          <div className={styles.desktopDropdown}>
            <button
              type="button"
              className={styles.closeMega}
              onClick={closeAllMenus}
            >
              ✕
            </button>

            <MegaMenu setPage={goTo} openCategory={handleCategory} />
          </div>
        )}
      </div>
    </header>
  );
}