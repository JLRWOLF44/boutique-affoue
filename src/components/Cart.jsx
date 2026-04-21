import styles from "./Cart.module.css";

export default function Cart({
  cart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  totalPrice,
  clearCart,
  goToCheckout,
}) {
  return (
    <div className={styles.cart}>
      <h2 className={styles.title}>Panier</h2>

      {cart.length === 0 ? (
        <p className={styles.empty}>Le panier est vide.</p>
      ) : (
        <>
          <div className={styles.list}>
            {cart.map((item) => (
              <div key={item.id} className={styles.item}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.image}
                />

                <div className={styles.info}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.meta}>Prix : {item.price} €</p>
                  <p className={styles.meta}>Quantité : {item.quantity}</p>
                  <p className={styles.subtotal}>
                    Sous-total : {item.price * item.quantity} €
                  </p>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>

                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <h3 className={styles.total}>Total : {totalPrice} €</h3>

            <div className={styles.footerButtons}>
              <button type="button" className={styles.button} onClick={clearCart}>
                Vider le panier
              </button>

              <button
                type="button"
                className={styles.checkoutButton}
                onClick={goToCheckout}
              >
                Commander
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}