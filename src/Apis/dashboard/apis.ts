
import { apiClient } from "../../lib/axios/apiClient";
import { dashboardEndpoints } from "./endpoints";

export type TDashboardRange = "today" | "7d" | "30d" | "12m";

export type TDashboardOverviewParams = {
  range?: TDashboardRange;
};


export const getDashboardOverview = async (
  params?: TDashboardOverviewParams
)=> {
  const { data } = await apiClient.get(dashboardEndpoints.overview, { params });
  console.log(data)
  return data;
};