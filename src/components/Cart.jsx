import styles from "./Cart.module.css";

export default function Cart({
  cart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  totalPrice,
  clearCart,
  goToCheckout,
  setPage,
}) {
  return (
    <div className={styles.cart}>
      <div className={styles.header}>
        <h2>Mon panier</h2>

        <button
          className={styles.backButton}
          onClick={() => setPage("shop")}
        >
          ← Continuer mes achats
        </button>
      </div>

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
                  <h3>{item.name}</h3>
                  <p>{item.price} €</p>

                  <div className={styles.quantity}>
                    <button onClick={() => decreaseQuantity(item.id)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>
                      +
                    </button>
                  </div>

                  <p className={styles.subtotal}>
                    {item.price * item.quantity} €
                  </p>
                </div>

                <button
                  className={styles.delete}
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <h3>Total : {totalPrice} €</h3>

            <div className={styles.actions}>
              <button className={styles.clear} onClick={clearCart}>
                Vider le panier
              </button>

              <button className={styles.checkout} onClick={goToCheckout}>
                Passer la commande
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}