

"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useRouter } from "next/navigation";
import { useRegisterUser } from "../../Apis/user/mutations";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

type TErrorResponse = {
  message?: string;
};

export default function RegisterForm() {
  const registerMutation = useRegisterUser();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await registerMutation.mutateAsync(data);

     if(res.data?.success ) {
       router.push("/login");
     }

      toast.success(res.data?.message || "Registration successful");
      reset();
    } catch (error) {
      const err = error as AxiosError<TErrorResponse>;
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:p-8">
      <div className="mb-8">
        <p className="mb-2 inline-block rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
          Create Account
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-black">
          Register your account
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Fill in your details to create a new account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {registerMutation.isPending ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
