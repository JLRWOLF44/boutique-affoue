import styles from "./Cart.module.css";

export default function Cart({
  cart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  totalPrice,
  clearCart,
}) {
  return (
    <div className={styles.cart}>
      <h2>Panier</h2>

      {cart.length === 0 ? (
        <p>Le panier est vide.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <img
                src={item.image}
                alt={item.name}
                width="100"
                className={styles.image}
              />
              <h3>{item.name}</h3>
              <p>Prix : {item.price} €</p>
              <p>Quantité : {item.quantity}</p>
              <p>Sous-total : {item.price * item.quantity} €</p>

              <button
                className={styles.button}
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </button>

              <button
                className={styles.button}
                onClick={() => increaseQuantity(item.id)}
              >
                +
              </button>

              <button
                className={styles.button}
                onClick={() => removeFromCart(item.id)}
              >
                Supprimer
              </button>
            </div>
          ))}

          <h3>Total : {totalPrice} €</h3>

          <button
            className={styles.button}
            onClick={clearCart}
          >
            Vider le panier
          </button>
        </div>
      )}
    </div>
  );
}