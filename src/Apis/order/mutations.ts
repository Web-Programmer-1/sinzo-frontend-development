import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  placeOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "./apis";
import { orderKeys } from "./keys";

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: orderKeys.myOrders(),
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrders(),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrderById(variables.id),
        }),
      ]);
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrders(),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrderById(variables.id),
        }),
      ]);
    },
  });
};