"use client";

import { useMemo, useState } from "react";
import { useGetCustomerRanking } from "../../../Apis/order";

type TBadge = "VIP" | "LOYAL" | "NORMAL";

type TCustomerRankingItem = {
  rank: number;
  id: string;
  customerKey: string;
  userId?: string | null;
  phone: string;
  fullName: string;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  badge: TBadge;
  lastOrderAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

const badgeClasses: Record<TBadge, string> = {
  VIP: "border-yellow-200 bg-yellow-50 text-yellow-700",
  LOYAL: "border-blue-200 bg-blue-50 text-blue-700",
  NORMAL: "border-slate-200 bg-slate-100 text-slate-700",
};

const badgeCardClasses: Record<TBadge, string> = {
  VIP: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white",
  LOYAL: "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
  NORMAL: "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
};

const formatCurrency = (amount?: number) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getBadgeEmoji = (badge?: TBadge) => {
  if (badge === "VIP") return "👑";
  if (badge === "LOYAL") return "⭐";
  return "🛍️";
};

const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const SkeletonCard = () => {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="animate-pulse">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="h-16 rounded-2xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-9 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="mt-3 h-8 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ErrorState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            Failed to load customer ranking
          </h2>
          <p className="mt-2 text-sm text-red-600">
            Something went wrong while fetching ranking data.
          </p>
        </div>
      </div>
    </section>
  );
};

const EmptyState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            🏆
          </div>
          <h2 className="text-xl font-semibold text-black">
            No customer ranking found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            No ranking data is available right now.
          </p>
        </div>
      </div>
    </section>
  );
};

const TopCustomerCard = ({
  customer,
}: {
  customer: TCustomerRankingItem;
}) => {
  return (
    <div
      className={`overflow-hidden rounded-3xl border p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] ${badgeCardClasses[customer.badge]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {getInitials(customer.fullName)}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Rank #{customer.rank}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-black">
              {customer.fullName}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{customer.phone}</p>
          </div>
        </div>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses[customer.badge]}`}
        >
          {getBadgeEmoji(customer.badge)} {customer.badge}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/80 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Total Orders
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {customer.totalOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Delivered
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {customer.deliveredOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Cancelled
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {customer.cancelledOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Total Spent
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {formatCurrency(customer.totalSpent)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-black p-4 text-white">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">
          Last Order
        </p>
        <p className="mt-2 text-sm font-semibold">{formatDate(customer.lastOrderAt)}</p>
      </div>
    </div>
  );
};

const CustomerTableRow = ({
  customer,
}: {
  customer: TCustomerRankingItem;
}) => {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black/20 hover:shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-black">
            #{customer.rank}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-black">
              {customer.fullName}
            </h3>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <p>{customer.phone}</p>
              <p className="truncate">{customer.customerKey}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses[customer.badge]}`}
          >
            {customer.badge}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Orders
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {customer.totalOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Delivered
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {customer.deliveredOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Cancelled
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {customer.cancelledOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Spent
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {formatCurrency(customer.totalSpent)}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Last Order
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {formatDate(customer.lastOrderAt)}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            User Type
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {customer.userId ? "Registered" : "Guest"}
          </p>
        </div>
      </div>
    </div>
  );
};

const CustomerRanking = () => {
  const [search, setSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<"ALL" | TBadge>("ALL");

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (search.trim()) {
      params.fullName = search.trim();
    }
    if (badgeFilter !== "ALL") {
      params.badge = badgeFilter;
    }
    return params;
  }, [search, badgeFilter]);

  const { data, isLoading, isError } = useGetCustomerRanking(queryParams);

  const customers: TCustomerRankingItem[] = data?.data || [];
  const meta: TMeta | undefined = data?.meta;

  const topThree = customers.slice(0, 3);

  const summary = useMemo(() => {
    return {
      totalCustomers: meta?.total || customers.length,
      vipCustomers: customers.filter((c) => c.badge === "VIP").length,
      loyalCustomers: customers.filter((c) => c.badge === "LOYAL").length,
      normalCustomers: customers.filter((c) => c.badge === "NORMAL").length,
    };
  }, [customers, meta]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!customers.length) return <EmptyState />;

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
              Admin Analytics
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-black md:text-4xl">
              Customer Ranking
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              View top customers based on orders, spending, delivery success,
              and loyalty badge.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
            Page: <span className="font-semibold text-black">{meta?.page || 1}</span>{" "}
            • Limit: <span className="font-semibold text-black">{meta?.limit || 0}</span>{" "}
            • Total: <span className="font-semibold text-black">{meta?.total || 0}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Total Customers
            </p>
            <h3 className="mt-3 text-2xl font-bold text-black">
              {summary.totalCustomers}
            </h3>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              VIP
            </p>
            <h3 className="mt-3 text-2xl font-bold text-black">
              {summary.vipCustomers}
            </h3>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Loyal
            </p>
            <h3 className="mt-3 text-2xl font-bold text-black">
              {summary.loyalCustomers}
            </h3>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Normal
            </p>
            <h3 className="mt-3 text-2xl font-bold text-black">
              {summary.normalCustomers}
            </h3>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-3xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-sm">
              <label className="mb-2 block text-sm font-medium text-black">
                Search Customer
              </label>
              <input
                type="text"
                placeholder="Search by full name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["ALL", "VIP", "LOYAL", "NORMAL"] as const).map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => setBadgeFilter(badge)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    badgeFilter === badge
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:border-black"
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-black">Top Customers</h2>
              <p className="mt-1 text-sm text-gray-500">
                Best performing customers by current rank
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {topThree.map((customer) => (
              <TopCustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </div>

        {/* Full Ranking List */}
        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-black">Full Ranking List</h2>
              <p className="mt-1 text-sm text-gray-500">
                Detailed customer ranking overview
              </p>
            </div>

            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-black">{customers.length}</span>{" "}
              customers
            </div>
          </div>

          <div className="space-y-4">
            {customers.map((customer) => (
              <CustomerTableRow key={customer.id} customer={customer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerRanking;