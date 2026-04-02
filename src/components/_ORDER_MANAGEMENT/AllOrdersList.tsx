"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  useDeleteOrder,
  useGetAllOrders,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "../../Apis/order";
import { toast } from "sonner";
import { SlidersHorizontal, Loader2, ChevronsUpDown } from "lucide-react";
import Swal from "sweetalert2";

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
  courierStatus?: "NOT_SENT" | "SENT" | "FAILED" | null;
  trackingCode?: string | null;
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

const PAYMENT_STATUS_OPTIONS: TPaymentStatus[] = [
  "UNPAID",
  "PAID",
  "PARTIAL",
  "REFUNDED",
];

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

const SkeletonRow = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-black/10 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-9 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="mt-3 h-8 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
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
            Something went wrong while fetching the admin order list.
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

const SummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{title}</p>
    <h3 className="mt-3 text-2xl font-bold text-black">{value}</h3>
  </div>
);

const PaymentStatusModal = ({
  isOpen,
  onClose,
  order,
  paymentValue,
  setPaymentValue,
  paidAmount,
  setPaidAmount,
  onSubmit,
  isUpdating,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: TOrder | null;
  paymentValue: TPaymentStatus;
  setPaymentValue: React.Dispatch<React.SetStateAction<TPaymentStatus>>;
  paidAmount: string;
  setPaidAmount: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  isUpdating: boolean;
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-3 sm:px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Update Payment
            </p>
            <h3 className="mt-1 text-base font-bold text-black sm:text-lg">
              {order.orderNumber}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="rounded-full border border-black/10 px-3 py-1 text-sm font-medium text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Total
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Current Due
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {formatCurrency(order.dueAmount)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-black">
            Payment Status
          </label>
          <select
            value={paymentValue}
            onChange={(e) => {
              const value = e.target.value as TPaymentStatus;
              setPaymentValue(value);

              if (value === "PAID") {
                setPaidAmount(String(order.totalAmount));
              } else if (value === "UNPAID") {
                setPaidAmount("0");
              }
            }}
            disabled={isUpdating}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
          >
            {PAYMENT_STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {formatStatus(item)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-black">
            Paid Amount
          </label>
          <input
            type="number"
            min="0"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            disabled={isUpdating}
            placeholder="Enter paid amount"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
          />
          <p className="mt-2 text-xs text-gray-500">
            Leave as current value or set a new paid amount.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-70"
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderCardMobile = ({
  order,
  openDropdownId,
  onOpenStatusDropdown,
  onCloseStatusDropdown,
  onOpenPaymentModal,
  statusValue,
  setStatusValue,
  statusNote,
  setStatusNote,
  onUpdateStatus,
  isStatusUpdating,
}: {
  order: TOrder;
  openDropdownId: string | null;
  onOpenStatusDropdown: (orderId: string, currentStatus: TOrderStatus) => void;
  onCloseStatusDropdown: () => void;
  onOpenPaymentModal: (order: TOrder) => void;
  statusValue: TOrderStatus;
  setStatusValue: React.Dispatch<React.SetStateAction<TOrderStatus>>;
  statusNote: string;
  setStatusNote: React.Dispatch<React.SetStateAction<string>>;
  onUpdateStatus: (orderId: string, currentStatus: TOrderStatus) => void;
  isStatusUpdating: boolean;
}) => {
  const firstItem = order.items?.[0];
  const totalQty =
    order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
    0;

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
            Order Number
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-black">
            {order.orderNumber}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{order.fullName}</p>
        </div>

        <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
          #{order.serialNumber}
        </span>
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
          <h4 className="line-clamp-1 text-sm font-semibold text-black">
            {firstItem?.productTitle || "Order Item"}
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Items: {order.items?.length || 0} • Qty: {totalQty}
          </p>

          <p className="mt-2 text-base font-bold text-black">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Phone
          </p>
          <p className="mt-1 text-sm font-semibold text-black">{order.phone}</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Date
          </p>
          <p className="mt-1 text-sm font-semibold text-black">
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Link
          href={`/dashboard/order/${order.id}`}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
        >
          View
        </Link>


        <Link
          href={`/admin/dashboard/orders/${order.id}/delete`}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
        >
          Delete
        </Link>

        <button
          type="button"
          onClick={() => onOpenPaymentModal(order)}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
        >
          Payment
        </button>

        <button
          type="button"
          onClick={() => onOpenStatusDropdown(order.id, order.orderStatus)}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-4 py-2.5 text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {openDropdownId === order.id && (
        <div className="mt-4 rounded-[26px] border border-black/10 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Update Status
            </p>
            <h4 className="mt-1 text-base font-bold text-black">
              {order.orderNumber}
            </h4>
          </div>

          <div className="mb-4 rounded-2xl border border-black/10 bg-gray-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
              Current Status
            </p>
            <span
              className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                statusClasses[order.orderStatus] ||
                "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              {formatStatus(order.orderStatus)}
            </span>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-black">
              New Status
            </label>

            <div className="relative">
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value as TOrderStatus)}
                disabled={isStatusUpdating}
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm font-medium text-black outline-none transition focus:border-black"
              >
                {ORDER_STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {formatStatus(item)}
                  </option>
                ))}
              </select>

              <ChevronsUpDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {ORDER_STATUS_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatusValue(item)}
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    statusValue === item
                      ? statusClasses[item]
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {formatStatus(item)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-black">
              Admin Note{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Write a short status note..."
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, order.orderStatus)}
              disabled={isStatusUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-70"
            >
              {isStatusUpdating && openDropdownId === order.id ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>

            <button
              type="button"
              onClick={onCloseStatusDropdown}
              disabled={isStatusUpdating}
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<TOrderStatus>("PENDING");
  const [statusNote, setStatusNote] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [paymentValue, setPaymentValue] = useState<TPaymentStatus>("UNPAID");
  const [paidAmount, setPaidAmount] = useState("");

  const { mutate: updateOrderStatus, isPending: isStatusUpdating } =
    useUpdateOrderStatus();

  const { mutate: updatePaymentStatus, isPending: isPaymentUpdating } =
    useUpdatePaymentStatus();

  const openStatusDropdown = (orderId: string, currentStatus: TOrderStatus) => {
    if (openDropdownId === orderId) {
      setOpenDropdownId(null);
      setStatusNote("");
      return;
    }

    setOpenDropdownId(orderId);
    setStatusValue(currentStatus);
    setStatusNote("");
  };

  const closeStatusDropdown = () => {
    setOpenDropdownId(null);
    setStatusNote("");
  };

  const openPaymentModal = (order: TOrder) => {
    setSelectedOrder(order);
    setPaymentValue(order.paymentStatus);
    setPaidAmount(String(order.paidAmount ?? 0));
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
    setPaymentValue("UNPAID");
    setPaidAmount("");
  };

  const handleStatusUpdate = (orderId: string, currentStatus: TOrderStatus) => {
    if (statusValue === currentStatus && !statusNote.trim()) {
      toast.info("No changes detected");
      return;
    }

    updateOrderStatus(
      {
        id: orderId,
        payload: {
          status: statusValue,
          note: statusNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Order status updated successfully");
          closeStatusDropdown();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update order status",
          );
        },
      },
    );
  };

  const handleDeleteOrder = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    deleteOrder(id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Order deleted successfully");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to delete order");
      },
    });
  };

  const handlePaymentUpdate = () => {
    if (!selectedOrder) return;

    const parsedPaidAmount =
      paidAmount.trim() === "" ? selectedOrder.paidAmount : Number(paidAmount);

    if (Number.isNaN(parsedPaidAmount) || parsedPaidAmount < 0) {
      toast.error("Please enter a valid paid amount");
      return;
    }

    updatePaymentStatus(
      {
        id: selectedOrder.id,
        payload: {
          paymentStatus: paymentValue,
          paidAmount: parsedPaidAmount,
        },
      },
      {
        onSuccess: () => {
          toast.success("Payment status updated successfully");
          closePaymentModal();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update payment status",
          );
        },
      },
    );
  };

  const params = useMemo(() => {
    return {
      page,
      limit: 10,
      ...(searchTerm.trim() ? { searchTerm: searchTerm.trim() } : {}),
      ...(status ? { orderStatus: status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    };
  }, [page, searchTerm, status, paymentStatus, startDate, endDate]);

  const { data, isLoading, isError } = useGetAllOrders(params);

  const orders: TOrder[] = data?.data?.orders || [];
  const summary: TSummary | undefined = data?.data?.summary;
  const meta: TMeta | undefined = data?.meta;

  const clearFilters = () => {
    setPage(1);
    setSearchTerm("");
    setStatus("");
    setPaymentStatus("");
    setStartDate("");
    setEndDate("");
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!orders.length) return <EmptyState />;

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-full">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
              Admin Control
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-black md:text-4xl">
              All Orders
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Monitor all incoming orders, payment states, delivery progress,
              and customer information from one place.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
            Page:{" "}
            <span className="font-semibold text-black">{meta?.page || 1}</span>{" "}
            • Total:{" "}
            <span className="font-semibold text-black">{meta?.total || 0}</span>{" "}
            • Pages:{" "}
            <span className="font-semibold text-black">
              {meta?.totalPage || 0}
            </span>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
          <SummaryCard
            title="Orders in Range"
            value={summary?.totalOrdersInRange || 0}
          />
          <SummaryCard title="Pending" value={summary?.pendingOrders || 0} />
          <SummaryCard
            title="Confirmed"
            value={summary?.confirmedOrders || 0}
          />
          <SummaryCard
            title="Delivered"
            value={summary?.deliveredOrders || 0}
          />
          <SummaryCard
            title="Cancelled"
            value={summary?.cancelledOrders || 0}
          />
          <SummaryCard
            title="Total Sales"
            value={formatCurrency(summary?.totalSales || 0)}
          />
        </div>

        <div className="mb-8 rounded-3xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by order number, phone, name..."
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
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
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="PACKED">Packed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURNED">Returned</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => {
                  setPage(1);
                  setPaymentStatus(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              >
                <option value="">All Payment</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partial</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-black"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>

        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-black/10 bg-gray-50">
                  <tr>
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
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const firstItem = order.items?.[0];
                    const totalQty =
                      order.items?.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
                      ) || 0;

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-black/5 transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4 align-top">
                          <div className="min-w-[160px]">
                            <p className="font-semibold text-black">
                              {order.orderNumber}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <div className="min-w-[170px]">
                            <p className="font-semibold text-black">
                              {order.fullName}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {order.phone}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <div className="flex min-w-[220px] gap-3">
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
                                Items: {order.items?.length || 0} • Qty:{" "}
                                {totalQty}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {firstItem?.selectedColor || "N/A"}
                                {firstItem?.selectedSize
                                  ? ` • ${firstItem.selectedSize}`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <div className="min-w-[120px]">
                            <p className="font-semibold text-black">
                              {formatCurrency(order.totalAmount)}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Due: {formatCurrency(order.dueAmount)}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <div className="flex min-w-[150px] flex-col gap-2">
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
                            <p className="font-medium text-black">
                              {formatDate(order.createdAt)}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {formatStatus(order.deliveryArea)}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top text-right">
                          <div className="relative flex min-w-[420px] justify-end gap-2">
                            <Link
                              href={`/dashboard/order/${order.id}`}
                              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                            >
                              View
                            </Link>

                

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={isDeleting}
                              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>

                            <button
                              type="button"
                              onClick={() => openPaymentModal(order)}
                              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                            >
                              Payment
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openStatusDropdown(order.id, order.orderStatus)
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-sm transition hover:scale-[1.03] hover:shadow-md"
                              title="Update Status"
                            >
                              <SlidersHorizontal size={16} />
                            </button>

                            {openDropdownId === order.id && (
                              <div className="absolute right-0 top-12 z-50 w-[360px] rounded-[26px] border border-black/10 bg-white p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                                <div className="mb-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                                    Update Status
                                  </p>
                                  <h4 className="mt-1 text-lg font-bold text-black">
                                    {order.orderNumber}
                                  </h4>
                                </div>

                                <div className="mb-4 rounded-2xl border border-black/10 bg-gray-50 p-3">
                                  <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                                    Current Status
                                  </p>
                                  <span
                                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                      statusClasses[order.orderStatus] ||
                                      "border-gray-200 bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    {formatStatus(order.orderStatus)}
                                  </span>
                                </div>

                                <div className="mb-4">
                                  <label className="mb-2 block text-sm font-semibold text-black">
                                    New Status
                                  </label>

                                  <div className="relative">
                                    <select
                                      value={statusValue}
                                      onChange={(e) =>
                                        setStatusValue(
                                          e.target.value as TOrderStatus,
                                        )
                                      }
                                      disabled={isStatusUpdating}
                                      className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm font-medium text-black outline-none transition focus:border-black"
                                    >
                                      {ORDER_STATUS_OPTIONS.map((item) => (
                                        <option key={item} value={item}>
                                          {formatStatus(item)}
                                        </option>
                                      ))}
                                    </select>

                                    <ChevronsUpDown
                                      size={18}
                                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                  </div>

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {ORDER_STATUS_OPTIONS.map((item) => (
                                      <button
                                        key={item}
                                        type="button"
                                        onClick={() => setStatusValue(item)}
                                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                          statusValue === item
                                            ? statusClasses[item]
                                            : "border-gray-200 bg-white text-gray-600 hover:border-black/20 hover:text-black"
                                        }`}
                                      >
                                        {formatStatus(item)}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="mb-2 block text-sm font-semibold text-black">
                                    Admin Note{" "}
                                    <span className="font-normal text-gray-400">
                                      (optional)
                                    </span>
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={statusNote}
                                    onChange={(e) =>
                                      setStatusNote(e.target.value)
                                    }
                                    placeholder="Write a short status note..."
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        order.id,
                                        order.orderStatus,
                                      )
                                    }
                                    disabled={isStatusUpdating}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] disabled:opacity-70"
                                  >
                                    {isStatusUpdating &&
                                    openDropdownId === order.id ? (
                                      <>
                                        <Loader2
                                          size={16}
                                          className="animate-spin"
                                        />
                                        Updating...
                                      </>
                                    ) : (
                                      "Update"
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={closeStatusDropdown}
                                    disabled={isStatusUpdating}
                                    className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-black"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
              openDropdownId={openDropdownId}
              onOpenStatusDropdown={openStatusDropdown}
              onCloseStatusDropdown={closeStatusDropdown}
              onOpenPaymentModal={openPaymentModal}
              statusValue={statusValue}
              setStatusValue={setStatusValue}
              statusNote={statusNote}
              setStatusNote={setStatusNote}
              onUpdateStatus={handleStatusUpdate}
              isStatusUpdating={isStatusUpdating}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing page{" "}
            <span className="font-semibold text-black">{meta?.page || 1}</span>{" "}
            of{" "}
            <span className="font-semibold text-black">
              {meta?.totalPage || 1}
            </span>
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

      <PaymentStatusModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        order={selectedOrder}
        paymentValue={paymentValue}
        setPaymentValue={setPaymentValue}
        paidAmount={paidAmount}
        setPaidAmount={setPaidAmount}
        onSubmit={handlePaymentUpdate}
        isUpdating={isPaymentUpdating}
      />
    </section>
  );
};

export default AllOrders;
