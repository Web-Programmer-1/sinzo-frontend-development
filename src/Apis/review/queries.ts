import { useQuery } from "@tanstack/react-query";
import { getReviewsByProduct } from "./apis";
import { reviewKeys } from "./keys";
import { TGetReviewsParams } from "./types";

export const useGetReviewsByProduct = (
  productId: string,
  params?: TGetReviewsParams
) => {
  return useQuery({
    queryKey: reviewKeys.list(productId, params),
    queryFn: () => getReviewsByProduct(productId, params),
    enabled: !!productId,
  });
};