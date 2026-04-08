import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverview,
  TDashboardOverviewParams,

} from "./apis";
import { dashboardKeys } from "./keys";

export const useGetDashboardOverview = (
  params?: TDashboardOverviewParams
) => {
  return useQuery({
    queryKey: dashboardKeys.overview(params),
    queryFn: () => getDashboardOverview(params),
  });
};