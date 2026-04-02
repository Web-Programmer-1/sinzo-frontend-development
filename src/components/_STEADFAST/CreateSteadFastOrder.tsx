






"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useGetAllOrders } from "../../Apis/order";
import {
  useSendBulkOrdersToSteadfast,
  useSendSingleOrderToSteadfast,
} from "../../Apis/steadfast";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Package2,
  Search,
  Send,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

type TOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

type TPaymentStatus = "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";
type TCourierStatus = "NOT_SENT" | "SENT" | "FAILED";

type TOrderItem = {
  id: string;
  productTitle: string;
  productSlug?: string | null;
  productImage?: string | null;
  selectedColor?: string | null;
  selectedSize?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type TOrder = {
  id: string;
  orderNumber: string;
  serialNumber: number;
  userId?: string | null;
  guestId?: string | null;
  fullName: string;
  phone: string;
  email?: string | null;
  country?: string | null;
  city?: string | null;
  area?: string | null;
  addressLine: string;
  note?: string | null;
  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  deliveryCharge: number;
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
  paymentStatus: TPaymentStatus;
  orderType: "ONLINE" | "MANUAL";
  orderStatus: TOrderStatus;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  courierProvider?: string | null;
  courierStatus?: TCourierStatus | null;
  trackingCode?: string | null;
  consignmentId?: string | null;
  createdAt: string;
  updatedAt: string;
  items: TOrderItem[];
};

type TSummary = {
  totalOrdersInRange: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSales: number;
};

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type Props = {
  onSelectionChange?: (selectedIds: string[], selectedOrders: TOrder[]) => void;
};

const ORDER_STATUS_OPTIONS: TOrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const formatCurrency = (amount?: number) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatStatus = (value?: string) => {
  return (value || "")
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const statusClasses: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-700 border-sky-200",
  PROCESSING: "bg-violet-50 text-violet-700 border-violet-200",
  PACKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
  OUT_FOR_DELIVERY: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  RETURNED: "bg-red-50 text-red-700 border-red-200",
};

const paymentClasses: Record<string, string> = {
  UNPAID: "bg-rose-50 text-rose-700 border-rose-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 border-amber-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
};

const courierClasses: Record<string, string> = {
  NOT_SENT: "bg-slate-100 text-slate-700 border-slate-200",
  SENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

const SummaryCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
          {title}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-black">{value}</h3>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 text-black">
        {icon}
      </div>
    </div>
  </div>
);

const LoadingState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-8 w-56 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-3xl border border-black/10 bg-white"
            />
          ))}
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-3xl border border-black/10 bg-white"
            />
          ))}
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
            Failed to load orders
          </h2>
          <p className="mt-2 text-sm text-red-600">
            Something went wrong while fetching the order list.
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
            📦
          </div>
          <h2 className="text-xl font-semibold text-black">No orders found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            No order matched your current filters.
          </p>
        </div>
      </div>
    </section>
  );
};

const OrderRowDesktop = ({
  order,
  checked,
  onToggle,
}: {
  order: TOrder;
  checked: boolean;
  onToggle: (id: string) => void;
}) => {
  const firstItem = order.items?.[0];
  const totalQty =
    order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  return (
    <tr className="border-b border-black/5 transition hover:bg-gray-50/70">
      <td className="px-5 py-4 align-top">
        <label className="inline-flex cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(order.id)}
            className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
          />
        </label>
      </td>

      <td className="px-5 py-4 align-top">
        <div className="min-w-[150px]">
          <p className="font-semibold text-black">{order.orderNumber}</p>
          <p className="mt-1 text-sm text-gray-500">#{order.serialNumber}</p>
        </div>
      </td>

      <td className="px-5 py-4 align-top">
        <div className="min-w-[170px]">
          <p className="font-semibold text-black">{order.fullName}</p>
          <p className="mt-1 text-sm text-gray-500">{order.phone}</p>
        </div>
      </td>

      <td className="px-5 py-4 align-top">
        <div className="flex min-w-[240px] gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {firstItem?.productImage ? (
              <Image
                src={firstItem.productImage}
                alt={firstItem.productTitle}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="line-clamp-1 font-medium text-black">
              {firstItem?.productTitle || "Order Item"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Items: {order.items?.length || 0} • Qty: {totalQty}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {firstItem?.selectedColor || "N/A"}
              {firstItem?.selectedSize ? ` • ${firstItem.selectedSize}` : ""}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 align-top">
        <div className="min-w-[120px]">
          <p className="font-semibold text-black">{formatCurrency(order.totalAmount)}</p>
          <p className="mt-1 text-sm text-gray-500">
            Due: {formatCurrency(order.dueAmount)}
          </p>
        </div>
      </td>

      <td className="px-5 py-4 align-top">
        <div className="flex min-w-[160px] flex-col gap-2">
          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
              statusClasses[order.orderStatus] ||
              "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {formatStatus(order.orderStatus)}
          </span>

          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
              paymentClasses[order.paymentStatus] ||
              "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {formatStatus(order.paymentStatus)}
          </span>

          {order.courierStatus && (
            <span
              className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                courierClasses[order.courierStatus] ||
                "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              {formatStatus(order.courierStatus)}
            </span>
          )}
        </div>
      </td>

      <td className="px-5 py-4 align-top">
        <div className="min-w-[120px]">
          <p className="font-medium text-black">{formatDate(order.createdAt)}</p>
          <p className="mt-1 text-sm text-gray-500">
            {formatStatus(order.deliveryArea)}
          </p>
        </div>
      </td>
    </tr>
  );
};

const OrderCardMobile = ({
  order,
  checked,
  onToggle,
}: {
  order: TOrder;
  checked: boolean;
  onToggle: (id: string) => void;
}) => {
  const firstItem = order.items?.[0];
  const totalQty =
    order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  return (
    <div
      className={`rounded-3xl border bg-white p-4 shadow-sm transition ${
        checked ? "border-black ring-1 ring-black/10" : "border-black/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
            Order
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-black">
            {order.orderNumber}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            #{order.serialNumber} • {order.fullName}
          </p>
        </div>

        <label className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(order.id)}
            className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            statusClasses[order.orderStatus] ||
            "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          {formatStatus(order.orderStatus)}
        </span>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            paymentClasses[order.paymentStatus] ||
            "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          {formatStatus(order.paymentStatus)}
        </span>

        {order.courierStatus && (
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              courierClasses[order.courierStatus] ||
              "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {formatStatus(order.courierStatus)}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
          {firstItem?.productImage ? (
            <Image
              src={firstItem.productImage}
              alt={firstItem.productTitle}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-semibold text-black">
            {firstItem?.productTitle || "Order Item"}
          </h4>

          <p className="mt-1 text-sm text-gray-500">
            Items: {order.items?.length || 0} • Qty: {totalQty}
          </p>

          <p className="mt-1 text-sm text-gray-500">{order.phone}</p>

          <p className="mt-2 text-base font-bold text-black">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">Date</p>
          <p className="mt-1 text-sm font-semibold text-black">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">Area</p>
          <p className="mt-1 text-sm font-semibold text-black">
            {formatStatus(order.deliveryArea)}
          </p>
        </div>
      </div>
    </div>
  );
};

const CreateSteadfastSendOrder = ({ onSelectionChange }: Props) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { mutateAsync: sendSingleOrder, isPending: isSingleSending } =
    useSendSingleOrderToSteadfast();

  const { mutateAsync: sendBulkOrders, isPending: isBulkSending } =
    useSendBulkOrdersToSteadfast();

  const isSending = isSingleSending || isBulkSending;

  const params = useMemo(() => {
    return {
      page,
      limit: 10,
      ...(searchTerm.trim() ? { searchTerm: searchTerm.trim() } : {}),
      ...(status ? { orderStatus: status } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    };
  }, [page, searchTerm, status, startDate, endDate]);

  const { data, isLoading, isError, isFetching } = useGetAllOrders(params);

  const orders: TOrder[] = data?.data?.orders || [];
  const summary: TSummary | undefined = data?.data?.summary;
  const meta: TMeta | undefined = data?.meta;

  const selectedOrders = useMemo(() => {
    return orders.filter((order) => selectedIds.includes(order.id));
  }, [orders, selectedIds]);

  useEffect(() => {
    onSelectionChange?.(selectedIds, selectedOrders);
  }, [selectedIds, selectedOrders, onSelectionChange]);

  const currentPageIds = orders.map((order) => order.id);
  const allSelectedOnPage =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const toggleSingleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllOnPage = () => {
    if (allSelectedOnPage) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const clearFilters = () => {
    setPage(1);
    setSearchTerm("");
    setStatus("");
    setStartDate("");
    setEndDate("");
  };

  const handleSendSteadfast = async () => {
    if (!selectedIds.length) {
      toast.error("Please select at least one order");
      return;
    }

    try {
      if (selectedIds.length === 1) {
        const res = await sendSingleOrder(selectedIds[0]);

        const trackingCode =
          res?.data?.steadfastResponse?.consignment?.tracking_code ||
          res?.data?.order?.trackingCode;

        toast.success(
          trackingCode
            ? `Order sent successfully • Tracking: ${trackingCode}`
            : res?.message || "Order sent to Steadfast successfully"
        );

        setSelectedIds([]);
        return;
      }

      const res = await sendBulkOrders({ orderIds: selectedIds });

      const resultList = Array.isArray(res?.data) ? res.data : [];
      const successCount = resultList.filter(
        (item: any) => item?.status === "success" || item?.consignment_id
      ).length;
      const failedCount = resultList.filter(
        (item: any) => item?.error || (!item?.consignment_id && item?.status !== "success")
      ).length;

      if (successCount > 0 && failedCount > 0) {
        toast.success(
          `${successCount} order sent successfully, ${failedCount} order failed`
        );
      } else if (successCount > 0) {
        toast.success(
          res?.message || `${successCount} orders sent to Steadfast successfully`
        );
      } else if (failedCount > 0) {
        toast.error(`${failedCount} orders failed to send`);
      } else {
        toast.success(res?.message || "Bulk orders sent successfully");
      }

      setSelectedIds([]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send order(s) to Steadfast"
      );
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!orders.length) return <EmptyState />;

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 pb-28 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                Courier Management
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-black md:text-4xl">
                Create Steadfast Send Order
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Select single or multiple orders and prepare them for Steadfast courier sending.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-black/10 bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Page
                </p>
                <p className="mt-1 text-lg font-bold text-black">{meta?.page || 1}</p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Total
                </p>
                <p className="mt-1 text-lg font-bold text-black">{meta?.total || 0}</p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Selected
                </p>
                <p className="mt-1 text-lg font-bold text-black">{selectedIds.length}</p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Fetch State
                </p>
                <p className="mt-1 text-sm font-bold text-black">
                  {isFetching ? "Refreshing..." : "Ready"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard
            title="Orders in Range"
            value={summary?.totalOrdersInRange || 0}
            icon={<Package2 size={18} />}
          />
          <SummaryCard
            title="Pending"
            value={summary?.pendingOrders || 0}
            icon={<ChevronsUpDown size={18} />}
          />
          <SummaryCard
            title="Delivered"
            value={summary?.deliveredOrders || 0}
            icon={<Check size={18} />}
          />
          <SummaryCard
            title="Total Sales"
            value={formatCurrency(summary?.totalSales || 0)}
            icon={<Truck size={18} />}
          />
        </div>

        <div className="mb-6 rounded-3xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                Search
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by order number, phone, customer..."
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              >
                <option value="">All Status</option>
                {ORDER_STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {formatStatus(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setPage(1);
                  setStartDate(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setPage(1);
                  setEndDate(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSelectAllOnPage}
              className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {allSelectedOnPage ? "Unselect This Page" : "Select This Page"}
            </button>

            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-black"
            >
              Clear Selection
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-black"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mb-5 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                Selection Summary
              </p>
              <h3 className="mt-1 text-lg font-bold text-black">
                {selectedIds.length} order{selectedIds.length > 1 ? "s" : ""} selected
              </h3>
            </div>

            <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Single selection and multiple selection both supported for courier sending.
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-black/10 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Select
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Order
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Item
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Amount
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <OrderRowDesktop
                      key={order.id}
                      order={order}
                      checked={selectedIds.includes(order.id)}
                      onToggle={toggleSingleSelect}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:hidden">
          {orders.map((order) => (
            <OrderCardMobile
              key={order.id}
              order={order}
              checked={selectedIds.includes(order.id)}
              onToggle={toggleSingleSelect}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing page <span className="font-semibold text-black">{meta?.page || 1}</span>{" "}
            of <span className="font-semibold text-black">{meta?.totalPage || 1}</span>
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={(meta?.page || 1) <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={(meta?.page || 1) >= (meta?.totalPage || 1)}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, meta?.totalPage || 1))
              }
              className="rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
              Ready to Send
            </p>
            <h4 className="mt-1 text-sm font-semibold text-black sm:text-base">
              {selectedIds.length} order{selectedIds.length > 1 ? "s" : ""} selected for Steadfast
            </h4>
          </div>

          <button
            type="button"
            onClick={handleSendSteadfast}
            disabled={!selectedIds.length || isSending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Steadfast
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateSteadfastSendOrder;