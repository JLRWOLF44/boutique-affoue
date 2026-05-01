export default function Favorites({ favorites, toggleFavorite, openProduct }) {
  return (
    <div>
      <h2>Mes favoris</h2>

      {favorites.length === 0 ? (
        <p>Aucun favori</p>
      ) : (
        <div className="products">
          {favorites.map((product) => (
            <div key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                onClick={() => openProduct(product)}
                style={{ width: "120px", cursor: "pointer" }}
              />
              <p>{product.name}</p>
              <button onClick={() => toggleFavorite(product)}>
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}