
import { apiClient } from "../../lib/axios/apiClient";
import { reviewEndpoints } from "./endpoints";
import {
  TCreateReviewPayload,
  TDeleteReviewResponse,
  TGetReviewsParams,
  TReviewsResponse,
  TSingleReviewResponse,
  TUpdateReviewPayload,
  TAddReplyPayload,
  TReactReviewPayload,
} from "./types";

export const createReview = async (
  payload: TCreateReviewPayload
): Promise<TSingleReviewResponse> => {
  const res = await apiClient.post(reviewEndpoints.create, payload);
  return res.data;
};

export const getReviewsByProduct = async (
  productId: string,
  params?: TGetReviewsParams
): Promise<TReviewsResponse> => {
  const normalizedParams = {
    ...params,
    sort: params?.sort === "latest" ? undefined : params?.sort,
  };

  const res = await apiClient.get(reviewEndpoints.byProduct(productId), {
    params: normalizedParams,
  });

  return res.data;
};

export const updateReview = async ({
  reviewId,
  payload,
}: {
  reviewId: string;
  payload: TUpdateReviewPayload;
}): Promise<TSingleReviewResponse> => {
  const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
  return res.data;
};

export const addReplyToReview = async ({
  reviewId,
  payload,
}: {
  reviewId: string;
  payload: TAddReplyPayload;
}): Promise<TSingleReviewResponse> => {
  const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
  return res.data;
};

export const reactToReview = async ({
  reviewId,
  payload,
}: {
  reviewId: string;
  payload: TReactReviewPayload;
}): Promise<TSingleReviewResponse> => {
  const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
  return res.data;
};

export const deleteReview = async (
  reviewId: string
): Promise<TDeleteReviewResponse> => {
  const res = await apiClient.delete(reviewEndpoints.delete(reviewId));
  return res.data;
};