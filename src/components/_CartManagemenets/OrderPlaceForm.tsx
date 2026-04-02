"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePlaceOrder } from "../../Apis/order";
import Image from "next/image";

type TPaymentGateway = "BKASH" | "NOGOD";

type TPlaceOrderFormValues = {
  fullName: string;
  phone: string;
  email?: string;

  addressLine: string;

  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";

  // online payment extra fields
  paymentGateway?: TPaymentGateway;
  paymentNumber?: string;
  transactionId?: string;
};

type PlaceOrderFormProps = {
  defaultValues?: Partial<TPlaceOrderFormValues>;
};

const PlaceOrderForm = ({ defaultValues }: PlaceOrderFormProps) => {
  const router = useRouter();
  const { mutateAsync, isPending } = usePlaceOrder();
  const [activeGateway, setActiveGateway] = useState<TPaymentGateway>(
    defaultValues?.paymentGateway || "BKASH",
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TPlaceOrderFormValues>({
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      phone: defaultValues?.phone || "",
      email: defaultValues?.email || "",

      addressLine: defaultValues?.addressLine || "",
      deliveryArea: defaultValues?.deliveryArea || "INSIDE_CITY",
      paymentMethod: defaultValues?.paymentMethod || "CASH_ON_DELIVERY",
      paymentGateway: defaultValues?.paymentGateway || "BKASH",
      paymentNumber: defaultValues?.paymentNumber || "",
      transactionId: defaultValues?.transactionId || "",
    },
  });

  const deliveryArea = watch("deliveryArea");
  const paymentMethod = watch("paymentMethod");
  const isOnlinePayment = paymentMethod === "ONLINE_PAYMENT";

  const deliveryCharge = useMemo(() => {
    return deliveryArea === "INSIDE_CITY" ? 80 : 140;
  }, [deliveryArea]);

  const onSubmit = async (values: TPlaceOrderFormValues) => {
    try {
      const payload: Record<string, any> = {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,

        addressLine: values.addressLine,

        deliveryArea: values.deliveryArea,
        paymentMethod: values.paymentMethod,
      };

      if (values.paymentMethod === "ONLINE_PAYMENT") {
        payload.paymentGateway = values.paymentGateway;
        payload.paymentNumber = values.paymentNumber;
        payload.transactionId = values.transactionId;
      }

      const res = await mutateAsync(payload as any);

      if (res?.success) {
        toast.success(res?.message || "Order placed successfully");

        setTimeout(() => {
          router.push("/userDashboard/order");
        }, 1000);

        reset({
          fullName: "",
          phone: "",
          email: "",

          addressLine: "",
          deliveryArea: "INSIDE_CITY",
          paymentMethod: "CASH_ON_DELIVERY",
          paymentGateway: "BKASH",
          paymentNumber: "",
          transactionId: "",
        });

        setActiveGateway("BKASH");
      } else {
        toast.error(res?.message || "Failed to place order");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  const handleGatewayChange = (gateway: TPaymentGateway) => {
    setActiveGateway(gateway);
    setValue("paymentGateway", gateway);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Form */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="border-b border-black/10 px-6 py-5 md:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                Place Your Order
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Please fill in your delivery information carefully.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 py-6 md:px-8"
            >
              {/* Contact Info */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-black">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      {...register("phone", {
                        required: "Phone number is required",
                        minLength: {
                          value: 11,
                          message: "Phone number must be at least 11 digits",
                        },
                      })}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      {...register("email")}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-black">
                  Delivery Address
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-black">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="House no, road no, area, nearby landmark..."
                      {...register("addressLine", {
                        required: "Address is required",
                      })}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                    {errors.addressLine && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.addressLine.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery & Payment */}
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-black">
                    Delivery Area
                  </h3>

                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-black">
                      <div>
                        <p className="text-sm font-medium text-black">
                          Inside Dhaka City
                        </p>
                        <p className="text-xs text-gray-500">
                          Delivery charge ৳80
                        </p>
                      </div>
                      <input
                        type="radio"
                        value="INSIDE_CITY"
                        {...register("deliveryArea", {
                          required: true,
                        })}
                        className="h-4 w-4"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-black">
                      <div>
                        <p className="text-sm font-medium text-black">
                          Outside Dhaka City
                        </p>
                        <p className="text-xs text-gray-500">
                          Delivery charge ৳140
                        </p>
                      </div>
                      <input
                        type="radio"
                        value="OUTSIDE_CITY"
                        {...register("deliveryArea", {
                          required: true,
                        })}
                        className="h-4 w-4"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-black">
                    Payment Method
                  </h3>

                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-black">
                      <div>
                        <p className="text-sm font-medium text-black">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-500">
                          Pay when your order arrives
                        </p>
                      </div>
                      <input
                        type="radio"
                        value="CASH_ON_DELIVERY"
                        {...register("paymentMethod", {
                          required: true,
                        })}
                        className="h-4 w-4"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-black">
                      <div>
                        <p className="text-sm font-medium text-black">
                          Online Payment
                        </p>
                        <p className="text-xs text-gray-500">
                          Pay securely online
                        </p>
                      </div>
                      <input
                        type="radio"
                        value="ONLINE_PAYMENT"
                        {...register("paymentMethod", {
                          required: true,
                        })}
                        className="h-4 w-4"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Online Payment Extra Section */}
              {isOnlinePayment && (
                <div className="mb-8 rounded-3xl border border-black/10 bg-[#fafafa] p-4 md:p-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-black">
                      Send Money Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please complete your payment first, then provide the
                      number and transaction ID below.
                    </p>
                  </div>

                  {/* Tutorial */}
                  <div className="mb-5 rounded-2xl border border-black/10 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-black">
                      How to send money
                    </p>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <p>1. Open your mobile banking app.</p>
                      <p>
                        2. Choose{" "}
                        <span className="font-medium text-black">
                          Send Money
                        </span>
                        .
                      </p>
                      <p>
                        3. Send the total amount to our{" "}
                        <span className="font-medium text-black">
                          {activeGateway === "BKASH" ? "bKash" : "Nagad"}
                        </span>{" "}
                        number.
                      </p>
                      <p>4. After payment, copy the transaction ID.</p>
                      <p>
                        5. Enter your payment number and transaction ID below.
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div
                      onClick={() => handleGatewayChange("BKASH")}
                      className={`cursor-pointer overflow-hidden rounded-2xl transition ${
                        activeGateway === "BKASH"
                      }`}
                    >
                      <div className="relative h-[60px] w-full">
                        <Image
                          src="/bkash-logo.png"
                          alt="bKash"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div
                      onClick={() => handleGatewayChange("NOGOD")}
                      className={`cursor-pointer overflow-hidden rounded-2xl transition ${
                        activeGateway === "NOGOD"
                      }`}
                    >
                      <div className="relative h-[60px] w-full">
                        <Image
                          src="/nogod-logo.png"
                          alt="Nagad"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <input
                    type="hidden"
                    {...register("paymentGateway", {
                      required: isOnlinePayment
                        ? "Please select a payment gateway"
                        : false,
                    })}
                  />

                  <div className="mb-5 rounded-2xl border border-dashed border-black/15 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Selected Gateway
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      {activeGateway === "BKASH" ? "bKash" : "Nagad"}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-wide text-gray-500">
                      Send Money Number
                    </p>
                    <p className="mt-1 text-base font-semibold text-black">
                      {activeGateway === "BKASH"
                        ? "01XXXXXXXXX"
                        : "01YYYYYYYYY"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Replace with your real merchant/personal number.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Payment Number Input */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Your Payment Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. 017XXXXXXXX"
                          {...register("paymentNumber", {
                            required: isOnlinePayment
                              ? "Payment number is required"
                              : false,
                            minLength: isOnlinePayment
                              ? {
                                  value: 11,
                                  message:
                                    "Payment number must be at least 11 digits",
                                }
                              : undefined,
                          })}
                          className={`w-full rounded-xl border px-4 py-3.5 text-sm font-medium outline-none transition-all placeholder:text-gray-400 shadow-sm ${
                            errors.paymentNumber
                              ? "border-red-500 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                              : "border-gray-200 bg-white hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-black/5"
                          }`}
                        />
                      </div>
                      {/* Error Message with Icon */}
                      {errors.paymentNumber && (
                        <p className="mt-1.5 flex items-center text-sm font-medium text-red-500">
                          <svg
                            className="mr-1.5 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.paymentNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Transaction ID Input */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Transaction ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. 9F8G7H6J5K"
                          {...register("transactionId", {
                            required: isOnlinePayment
                              ? "Transaction ID is required"
                              : false,
                          })}
                          className={`w-full rounded-xl border px-4 py-3.5 text-sm font-medium uppercase outline-none transition-all placeholder:text-gray-400 placeholder:normal-case shadow-sm ${
                            errors.transactionId
                              ? "border-red-500 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                              : "border-gray-200 bg-white hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-black/5"
                          }`}
                        />
                      </div>
                      {/* Error Message with Icon */}
                      {errors.transactionId && (
                        <p className="mt-1.5 flex items-center text-sm font-medium text-red-500">
                          <svg
                            className="mr-1.5 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.transactionId.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Placing Order..." : "Confirm Order"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="border-b border-black/10 px-6 py-5">
              <h3 className="text-xl font-semibold text-black">
                Order Summary
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Delivery and payment overview
              </p>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Delivery Area
                </p>
                <p className="mt-1 text-sm font-semibold text-black">
                  {deliveryArea === "INSIDE_CITY"
                    ? "Inside City"
                    : "Outside City"}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Delivery Charge
                </p>
                <p className="mt-1 text-sm font-semibold text-black">
                  ৳ {deliveryCharge}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Payment Method
                </p>
                <p className="mt-1 text-sm font-semibold text-black">
                  {paymentMethod === "CASH_ON_DELIVERY"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>

              {isOnlinePayment && (
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Payment Gateway
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {activeGateway === "BKASH" ? "bKash" : "Nagad"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderForm;
