import { apiClient } from "../../lib/axios/apiClient";
import ORDER_ENDPOINTS from "./endpoints";

export type TPlaceOrderPayload = {
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  city?: string;
  area?: string;
  addressLine: string;
  note?: string;
  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  paymentMethod?: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
};

export type TUpdateOrderStatusPayload = {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  note?: string;
};

export type TUpdatePaymentStatusPayload = {
  paymentStatus: "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";
  paidAmount?: number;
};

export type TAdminOrdersParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  orderStatus?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
};

export type TCustomerRankingParams = {
  page?: number;
  limit?: number;
  badge?: string;
  phone?: string;
  fullName?: string;
};

export const placeOrder = async (payload: TPlaceOrderPayload) => {
  const { data } = await apiClient.post(
    ORDER_ENDPOINTS.PLACE_ORDER,
    payload
  );
  return data;
};

export const getMyOrders = async () => {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.MY_ORDERS);
  return data;
};

export const getMySingleOrder = async (id: string) => {
  const { data } = await apiClient.get(`${ORDER_ENDPOINTS.MY_ORDERS}/${id}`);
  return data;
};

export const trackOrder = async (orderNumber: string) => {
  const { data } = await apiClient.get(
    ORDER_ENDPOINTS.TRACK_ORDER(orderNumber)
  );
  return data;
};

export const getAllOrders = async (params?: TAdminOrdersParams) => {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.ALL_ORDERS, {
    params,
  });
  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.ORDER_BY_ID(id));
  return data;
};

export const updateOrderStatus = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateOrderStatusPayload;
}) => {
  const { data } = await apiClient.patch(
    ORDER_ENDPOINTS.UPDATE_ORDER_STATUS(id),
    payload
  );
  return data;
};

export const updatePaymentStatus = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdatePaymentStatusPayload;
}) => {
  const { data } = await apiClient.patch(
    ORDER_ENDPOINTS.UPDATE_PAYMENT_STATUS(id),
    payload
  );
  return data;
};

export const getCustomerRanking = async (params?: TCustomerRankingParams) => {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.CUSTOMER_RANKING, {
    params,
  });
  return data;
};




export const deleteOrder = async (id: string) => {
  const res = await apiClient.delete(ORDER_ENDPOINTS.DELETE_ORDER(id));
  return res.data;
}