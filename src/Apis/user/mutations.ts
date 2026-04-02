import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUserApi, registerUserApi, TLoginPayload, TRegisterPayload, updateUserApi } from "./apis";
import {} from "./keys"
import { userKeys } from ".";
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: TRegisterPayload) => registerUserApi(payload),
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TLoginPayload) => loginUserApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: userKeys.me(),
      });
    },
  });
};




export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserApi,

    onSuccess: async () => {
      // 🔥 important: refresh user data
      await queryClient.invalidateQueries({
        queryKey: userKeys.me(),
      });
    },
  });
};