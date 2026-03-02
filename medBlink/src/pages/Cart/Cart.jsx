import React, { useContext } from "react";

// CSS
import "./Cart.css";

// THIRD PARTY
import { Link, useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// UTILS
import { calculateCartTotals } from "../../utils/cartUtils";
import { renderMaskId } from "../../utils/maskUtil";

const Cart = () => {
  const navigate = useNavigate();
  const {
    quantities,
    increaseQuantity,
    decreaseQuantity,
    removeProductFromCart,
    cartData,
  } = useContext(StoreContext);

  const { subTotalAmount, shippingAmount, taxAmount, grandTotalAmount } =
    calculateCartTotals(cartData);

  const addMoreProductsButtonStyle =
    cartData.length > 0 ? "text-end" : "text-start";

  return (
    <div className="container py-5">
      <div className="mb-3">
        <Button variant="primary" state="outline" onClick={() => navigate("/")}>
          <i className="bi bi-arrow-left"></i> Back to Home
        </Button>
      </div>
      <h1 className="mb-5">Your Shopping Cart</h1>
      <div className="row">
        <div className="col-lg-8">
          {cartData.length === 0 ? (
            <div>
              <p>OOPS, Your Cart is Empty! ☹️</p>
            </div>
          ) : (
            <div className="card mb-4">
              <div className="card-body">
                {cartData.map((product) => {
                  const key = `${product.productID}-${product.batchID}`;
                  return (
                    <div key={key} className="row cart-item mb-3">
                      <div className="col-md-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="img-fluid rounded"
                          width={100}
                        />
                      </div>

                      <div className="col-md-5">
                        <h5 className="card-title">{product.name}</h5>

                        <p className="text-muted">
                          Category: {product.category}
                        </p>

                        <p className="text-muted">
                          Batch: {renderMaskId(product.productID)}
                        </p>
                      </div>

                      <div className="col-md-2">
                        <div className="input-group">
                          <Button
                            variant="secondary"
                            state="outline"
                            size="sm"
                            onClick={() => decreaseQuantity(product.productID)}
                          >
                            -
                          </Button>
                          <input
                            style={{ maxWidth: "100px" }}
                            type="text"
                            className="form-control form-control-sm text-center quantity-input"
                            value={quantities[key] || 0}
                            readOnly
                          />
                          <Button
                            variant="secondary"
                            state="outline"
                            size="sm"
                            onClick={() => increaseQuantity(product.productID)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="col-md-2 text-end">
                        <p className="fw-bold">
                          ₹{" "}
                          {(product.sellingPrice * product.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="danger"
                          state="outline"
                          onClick={() =>
                            removeProductFromCart(
                              product.productID,
                              quantities[key]
                            )
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className={`${addMoreProductsButtonStyle} mb-4`}>
            <Button
              variant="success"
              state="outline"
              onClick={() => navigate("/browse")}
            >
              <i className="bi bi-arrow-right me-2"></i>
              Add More Products
            </Button>
          </div>
        </div>
        {cartData.length === 0 ? (
          <></>
        ) : (
          <div className="col-lg-4">
            <div className="card cart-summary">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <span>₹ {subTotalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span>₹ {shippingAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax</span>
                  <span>₹ {taxAmount.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong>₹ {grandTotalAmount.toFixed(2)}</strong>
                </div>
                <Button
                  variant="primary"
                  style={{ width: "100%" }}
                  onClick={() => navigate("/order")}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
