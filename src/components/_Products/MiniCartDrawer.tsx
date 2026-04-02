"use client";

import Image from "next/image";
import { useRemoveCartItem, useUpdateCartItem } from "../../Apis/cart";

type TCartProduct = {
  id: string;
  title: string;
  price: number;
  productCardImage?: string | null;
};

type TCartItem = {
  id: string;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  product: TCartProduct;
};

type TCartSummary = {
  subtotal: number;
  totalItems: number;
  totalUniqueItems: number;
};

type MiniCartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: TCartItem[];
  summary?: TCartSummary;
};

export default function MiniCartDrawer({
  open,
  onClose,
  items,
  summary,
}: MiniCartDrawerProps) {
  const { mutate: updateCartItem, isPending: isUpdatingCart } =
    useUpdateCartItem();
  const { mutate: removeCartItem, isPending: isRemovingCartItem } =
    useRemoveCartItem();

  const handleIncrease = (item: TCartItem) => {
    updateCartItem({
      cartId: item.id,
      payload: {
        quantity: item.quantity + 1,
        selectedColor: item.selectedColor || undefined,
        selectedSize: item.selectedSize || undefined,
      },
    });
  };

  const handleDecrease = (item: TCartItem) => {
    if (item.quantity <= 1) {
      removeCartItem(item.id);
      return;
    }

    updateCartItem({
      cartId: item.id,
      payload: {
        quantity: item.quantity - 1,
        selectedColor: item.selectedColor || undefined,
        selectedSize: item.selectedSize || undefined,
      },
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        className={`mini-cart-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`mini-cart-drawer ${open ? "open" : ""}`}>
        <div className="mini-cart-head">
          <div>
            <p className="mini-cart-label">Shopping Cart</p>
            <h3 className="mini-cart-title">Your Cart</h3>
          </div>

          <button type="button" className="mini-cart-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mini-cart-body">
          {items.length === 0 ? (
            <div className="mini-cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => {
              const lineTotal = item.quantity * item.product.price;

              return (
                <div key={item.id} className="mini-cart-item">
                  <div className="mini-cart-image-wrap">
                    {item.product.productCardImage ? (
                      <Image
                        src={item.product.productCardImage}
                        alt={item.product.title}
                        fill
                        className="mini-cart-image"
                        sizes="90px"
                      />
                    ) : (
                      <div className="mini-cart-image-fallback">No Image</div>
                    )}
                  </div>

                  <div className="mini-cart-info">
                    <h4>{item.product.title}</h4>

                    <div className="mini-cart-meta">
                      {item.selectedColor && (
                        <span>Color: {item.selectedColor}</span>
                      )}
                      {item.selectedSize && (
                        <span>Size: {item.selectedSize}</span>
                      )}
                    </div>

                    <div className="mini-cart-row">
                      <div className="mini-cart-qty">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item)}
                          disabled={isUpdatingCart || isRemovingCartItem}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => handleIncrease(item)}
                          disabled={isUpdatingCart}
                        >
                          +
                        </button>
                      </div>

                      <strong>{lineTotal.toLocaleString()}৳</strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mini-cart-foot">
          <div className="mini-cart-summary">
            <div>
              <span>Total Items</span>
              <strong>{summary?.totalItems || 0}</strong>
            </div>
            <div>
              <span>Subtotal</span>
              <strong>৳{summary?.subtotal?.toLocaleString() || 0}</strong>
            </div>
          </div>

          <a href="/cart/my-cart" className="mini-cart-view-btn">
            View Cart
          </a>
        </div>
      </aside>

      <style jsx>{`
        .mini-cart-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          opacity: 0;
          pointer-events: none;
          transition: 0.25s ease;
          z-index: 9998;
        }

        .mini-cart-backdrop.show {
          opacity: 1;
          pointer-events: auto;
        }

        .mini-cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100dvh;
          width: min(420px, 100%);
          background: #fff;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.12);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }

        .mini-cart-drawer.open {
          transform: translateX(0);
        }

        .mini-cart-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 18px 14px;
          border-bottom: 1px solid #eee;
        }

        .mini-cart-label {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #888;
          font-weight: 700;
        }

        .mini-cart-title {
          margin: 4px 0 0;
          font-size: 24px;
          font-weight: 700;
          color: #111;
        }

        .mini-cart-close {
          border: none;
          background: #f5f5f5;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 16px;
        }

        .mini-cart-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mini-cart-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
        }

        .mini-cart-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 18px;
          background: #fafafa;
        }

        .mini-cart-image-wrap {
          position: relative;
          min-width: 88px;
          height: 110px;
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          flex-shrink: 0;
        }

        .mini-cart-image {
          object-fit: contain;
          padding: 6px;
        }

        .mini-cart-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #999;
        }

        .mini-cart-info {
          flex: 1;
          min-width: 0;
        }

        .mini-cart-info h4 {
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 700;
          color: #111;
        }

        .mini-cart-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }

        .mini-cart-meta span {
          font-size: 12px;
          color: #555;
          background: #fff;
          border: 1px solid #eee;
          padding: 4px 8px;
          border-radius: 999px;
        }

        .mini-cart-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 14px;
          color: #444;
        }

        .mini-cart-qty {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 999px;
          padding: 4px 8px;
        }

        .mini-cart-qty button {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          border: none;
          background: #f2f2f2;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s;
        }

        .mini-cart-qty button:hover {
          background: #111;
          color: #fff;
        }

        .mini-cart-qty button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .mini-cart-qty span {
          min-width: 20px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
        }

        .mini-cart-foot {
          border-top: 1px solid #eee;
          padding: 16px;
          background: #fff;
        }

        .mini-cart-summary {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }

        .mini-cart-summary div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #444;
        }

        .mini-cart-view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          width: 100%;
          border-radius: 999px;
          background: #111;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }
      `}</style>
    </>
  );
}