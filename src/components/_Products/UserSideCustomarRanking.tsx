"use client";

import React, { useMemo, useState } from "react";
import {
  Crown,
  Medal,
  ShieldCheck,
  Phone,
  ShoppingBag,
  Truck,
  Ban,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetCustomerRanking } from "../../Apis/order";


type TCustomerBadge = "ALL" | "NORMAL" | "VIP" | "LOYAL";

const badgeTabs: TCustomerBadge[] = ["ALL", "VIP", "LOYAL", "NORMAL"];

const getBadgeStyles = (badge: "NORMAL" | "VIP" | "LOYAL") => {
  switch (badge) {
    case "VIP":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    case "LOYAL":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
};

const getBadgeIcon = (badge: "NORMAL" | "VIP" | "LOYAL") => {
  switch (badge) {
    case "VIP":
      return <Crown className="h-4 w-4" />;
    case "LOYAL":
      return <ShieldCheck className="h-4 w-4" />;
    default:
      return <Medal className="h-4 w-4" />;
  }
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString()}`;
};

export default function UserSideCustomarRanking() {
  const [page, setPage] = useState(1);
  const [selectedBadge, setSelectedBadge] = useState<TCustomerBadge>("ALL");

  const limit = 10;

  const params = useMemo(() => {
    return {
      page,
      limit,
      ...(selectedBadge !== "ALL" ? { badge: selectedBadge } : {}),
    };
  }, [page, selectedBadge]);

  const { data, isLoading } = useGetCustomerRanking(params);

  const customers = data?.data || [];
  const meta = data?.meta;

  return (
    <section className="w-full bg-slate-50 py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Customer Ranking
              </h2>
              <p className="text-sm text-slate-500">
                Top customers leaderboard
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-lg font-bold">{meta?.total || 0}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {badgeTabs.map((badge) => (
              <button
                key={badge}
                onClick={() => {
                  setSelectedBadge(badge);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedBadge === badge
                    ? "bg-black text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {badge}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="mt-6 text-center text-slate-500">Loading...</div>
          )}

          {/* Empty */}
          {!isLoading && customers.length === 0 && (
            <div className="mt-6 text-center text-slate-500">
              No customer data found
            </div>
          )}

          {/* MOBILE VIEW */}
          <div className="mt-6 grid gap-4 md:hidden">
            {customers.map((customer) => (
              <div
                key={customer.rank}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                {/* top */}
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <div>
                      <span className="bg-black text-white px-3 py-1 text-xs rounded-full">
                        Rank #{customer.rank}
                      </span>

                      <h3 className="mt-2 font-bold text-lg">
                        {customer.fullName}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Phone className="h-4 w-4" />
                        {customer.phone}
                      </div>
                    </div>

                    <span
                      className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full ${getBadgeStyles(
                        customer.badge
                      )}`}
                    >
                      {getBadgeIcon(customer.badge)}
                      {customer.badge}
                    </span>
                  </div>
                </div>

                {/* 2x2 GRID */}
                <div className="p-4">
                  <div className="grid grid-cols-2 overflow-hidden rounded-2xl border">
                    {/* Orders */}
                    <div className="border-r border-b p-3 bg-slate-50">
                      <p className="text-xs text-slate-500">Orders</p>
                      <p className="text-lg font-bold">
                        {customer.totalOrders}
                      </p>
                    </div>

                    {/* Delivered */}
                    <div className="border-b p-3 bg-emerald-50">
                      <p className="text-xs text-emerald-600">Delivered</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {customer.deliveredOrders}
                      </p>
                    </div>

                    {/* Cancelled */}
                    <div className="border-r p-3 bg-rose-50">
                      <p className="text-xs text-rose-600">Cancelled</p>
                      <p className="text-lg font-bold text-rose-700">
                        {customer.cancelledOrders}
                      </p>
                    </div>

                    {/* Spent */}
                    <div className="p-3 bg-amber-50">
                      <p className="text-xs text-amber-600">Spent</p>
                      <p className="text-lg font-bold text-amber-700">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div className="border-t p-3 text-sm text-slate-500 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(customer.lastOrderAt)}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block mt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-3">Rank</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Delivered</th>
                  <th>Cancelled</th>
                  <th>Spent</th>
                  <th>Badge</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.rank} className="border-b">
                    <td className="py-3 font-bold">#{c.rank}</td>
                    <td>{c.fullName}</td>
                    <td>{c.phone}</td>
                    <td>{c.totalOrders}</td>
                    <td className="text-emerald-600">
                      {c.deliveredOrders}
                    </td>
                    <td className="text-rose-600">
                      {c.cancelledOrders}
                    </td>
                    <td>{formatCurrency(c.totalSpent)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${getBadgeStyles(
                          c.badge
                        )}`}
                      >
                        {c.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm">
              Page {meta?.page || 1} / {meta?.totalPage || 1}
            </span>

            <button
              onClick={() =>
                setPage((p) =>
                  p < (meta?.totalPage || 1) ? p + 1 : p
                )
              }
              className="px-4 py-2 bg-black text-white rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}