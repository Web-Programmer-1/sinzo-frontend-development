

"use client";

import Link from "next/link";
import { useGetAllCategories } from "../../Apis/category/queries";

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const DeleteIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const ViewIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EmptyIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: string | number;
  title: string;
  thumbnailImage: string;
  slug?: string;
  productCount?: number;
}

// ── Skeleton Item ─────────────────────────────────────────────────────────────
function SkeletonItem() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-100 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0" />
        <div className="h-3.5 bg-slate-100 rounded-full w-28" />
      </div>
      <div className="flex gap-1.5">
        <div className="w-7 h-7 bg-slate-100 rounded-lg" />
        <div className="w-7 h-7 bg-slate-100 rounded-lg" />
        <div className="w-7 h-7 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

// ── Category Item ─────────────────────────────────────────────────────────────
interface CategoryItemProps {
  category: Category;
  onDelete: (id: string | number) => void;
}

function CategoryItem({ category, onDelete }: CategoryItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-100 hover:border-violet-100 hover:shadow-sm transition-all group">

      {/* Left: image + title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
          <img
            src={category.thumbnailImage}
            alt={category.title}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-slate-700 truncate">{category.title}</span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
        <Link
          href={`/dashboard/category/${category.id}`}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-all"
          title="View"
        >
          <ViewIcon />
        </Link>
        <Link
          href={`/dashboard/category/${category.id}/edit`}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-500 transition-all"
          title="Edit"
        >
          <EditIcon />
        </Link>
        <button
          onClick={() => onDelete(category.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
          title="Delete"
        >
          <DeleteIcon />
        </button>
      </div>

    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-300">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
        <EmptyIcon />
      </div>
      <p className="text-sm font-semibold text-slate-500">No categories yet</p>
      <p className="text-xs text-slate-400 mt-1 mb-4">Create your first category.</p>
      <Link
        href="/dashboard/category/create"
        className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-violet-700 transition"
      >
        <PlusIcon />
        Create Category
      </Link>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AllCategoryList() {
  const { data, isLoading, isError } = useGetAllCategories();

  const categories: Category[] = data?.data ?? [];

  const handleDelete = (id: string | number) => {
    // TODO: connect delete API
    console.log("Delete:", id);
  };

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">All Categories</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isLoading ? "Loading..." : `${categories.length} categories`}
          </p>
        </div>
        <Link
          href="/dashboard/category/create"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-violet-200 whitespace-nowrap"
        >
          <PlusIcon />
          Create Category
        </Link>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-red-600 font-medium">
          ⚠ Something went wrong. Please refresh.
        </div>
      )}

      {/* ── List ── */}
      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
          : categories.length === 0
          ? <EmptyState />
          : categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onDelete={handleDelete}
              />
            ))
        }
      </div>

    </div>
  );
}