import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getSingleProduct } from "./apis";
import { productKeys } from "./keys";
import { TGetProductsParams } from "./types";

export const useGetAllProducts = (params?: TGetProductsParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getAllProducts(params),
  });
};

export const useGetSingleProduct = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => getSingleProduct(slug),
    enabled: !!slug,
  });
};