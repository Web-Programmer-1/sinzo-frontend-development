const ORDER_ENDPOINTS = {
  PLACE_ORDER: "/order/place-order",
  MY_ORDERS: "/order/my-orders",
  TRACK_ORDER: (orderNumber: string) => `/order/track/${orderNumber}`,

  ALL_ORDERS: "/order",
  ORDER_BY_ID: (id: string) => `/order/${id}`,
  UPDATE_ORDER_STATUS: (id: string) => `/order/${id}/status`,
  UPDATE_PAYMENT_STATUS: (id: string) => `/order/payment-status/${id}`,
  CUSTOMER_RANKING: "/order/customer-ranking",
};

export default ORDER_ENDPOINTS;