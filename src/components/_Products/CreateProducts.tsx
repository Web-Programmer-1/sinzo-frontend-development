// "use client";

// import { useState, useRef, useCallback } from "react";
// import Image from "next/image";

// import { useRouter } from "next/navigation";
// import { useGetAllCategories } from "../../Apis/category/queries";
// import { useCreateProduct } from "../../Apis/products/mutations";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type Badge = "SALE" | "BEST_SELLER" | "LOW_STOCK" | "OUT_OF_STOCK" | "NEW";
// type SizeType = "MEN" | "WOMEN" | "UNISEX";

// interface SizeGuideRow {
//   size: string;
//   fullLength: string;
//   chest: string;
//   sleeve: string;
// }

// interface Category {
//   id: string;
//   title: string;
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const SectionTitle = ({ step, title }: { step: string; title: string }) => (
//   <div className="flex items-center gap-4 mb-6">
//     <span className="w-7 h-7 rounded-full border border-black flex items-center justify-center text-[11px] font-semibold tracking-widest text-black shrink-0">
//       {step}
//     </span>
//     <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black">
//       {title}
//     </h2>
//     <div className="flex-1 h-px bg-neutral-200" />
//   </div>
// );

// const FormField = ({
//   label,
//   required,
//   error,
//   children,
//   hint,
// }: {
//   label: string;
//   required?: boolean;
//   error?: string;
//   children: React.ReactNode;
//   hint?: string;
// }) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
//       {label}
//       {required && <span className="text-black ml-1">*</span>}
//     </label>
//     {children}
//     {hint && !error && (
//       <p className="text-[11px] text-neutral-400">{hint}</p>
//     )}
//     {error && (
//       <p className="text-[11px] text-red-500 font-medium">{error}</p>
//     )}
//   </div>
// );

// const inputCls =
//   "w-full border border-neutral-200 bg-white text-black text-sm px-4 py-3 outline-none focus:border-black transition-colors duration-200 placeholder:text-neutral-300 rounded-none";

// const selectCls =
//   "w-full border border-neutral-200 bg-white text-black text-sm px-4 py-3 outline-none focus:border-black transition-colors duration-200 rounded-none appearance-none cursor-pointer";

// // ─── Image Upload Box ─────────────────────────────────────────────────────────
// const ImageUploadBox = ({
//   label,
//   preview,
//   onChange,
//   multiple = false,
//   previews,
//   hint,
// }: {
//   label: string;
//   preview?: string | null;
//   onChange: (files: FileList) => void;
//   multiple?: boolean;
//   previews?: string[];
//   hint?: string;
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [dragging, setDragging] = useState(false);

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault();
//       setDragging(false);
//       if (e.dataTransfer.files.length) onChange(e.dataTransfer.files);
//     },
//     [onChange]
//   );

//   return (
//     <div className="flex flex-col gap-2">
//       <label className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
//         {label}
//       </label>
//       <div
//         onClick={() => inputRef.current?.click()}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragging(true);
//         }}
//         onDragLeave={() => setDragging(false)}
//         onDrop={handleDrop}
//         className={`
//           relative border-2 border-dashed cursor-pointer transition-all duration-200
//           ${dragging ? "border-black bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"}
//           ${preview || (previews && previews.length) ? "p-2" : "p-10"}
//         `}
//       >
//         {/* Single preview */}
//         {preview && !multiple && (
//           <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100">
//             <Image src={preview} alt="preview" fill className="object-cover" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
//               <span className="text-white text-[10px] tracking-widest uppercase font-medium">
//                 Change
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Multiple previews */}
//         {multiple && previews && previews.length > 0 && (
//           <div className="grid grid-cols-4 gap-1.5 mb-2">
//             {previews.map((src, i) => (
//               <div
//                 key={i}
//                 className="relative aspect-square overflow-hidden bg-neutral-100"
//               >
//                 <Image src={src} alt={`gallery-${i}`} fill className="object-cover" />
//               </div>
//             ))}
//             <div className="aspect-square border border-dashed border-neutral-300 flex items-center justify-center">
//               <span className="text-neutral-400 text-xl">+</span>
//             </div>
//           </div>
//         )}

//         {/* Empty state */}
//         {!preview && !(previews && previews.length) && (
//           <div className="flex flex-col items-center gap-3 pointer-events-none select-none">
//             <svg
//               width="28"
//               height="28"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1"
//               className="text-neutral-300"
//             >
//               <rect x="3" y="3" width="18" height="18" rx="2" />
//               <circle cx="8.5" cy="8.5" r="1.5" />
//               <path d="M21 15l-5-5L5 21" />
//             </svg>
//             <div className="text-center">
//               <p className="text-[11px] text-neutral-400 tracking-wide">
//                 Drop {multiple ? "images" : "image"} here or{" "}
//                 <span className="text-black underline underline-offset-2">browse</span>
//               </p>
//               {hint && (
//                 <p className="text-[10px] text-neutral-300 mt-1">{hint}</p>
//               )}
//             </div>
//           </div>
//         )}

//         <input
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           multiple={multiple}
//           className="hidden"
//           onChange={(e) => e.target.files && onChange(e.target.files)}
//         />
//       </div>
//     </div>
//   );
// };

// // ─── Tag Input ────────────────────────────────────────────────────────────────
// const TagInput = ({
//   label,
//   tags,
//   onAdd,
//   onRemove,
//   placeholder,
//   hint,
// }: {
//   label: string;
//   tags: string[];
//   onAdd: (val: string) => void;
//   onRemove: (val: string) => void;
//   placeholder?: string;
//   hint?: string;
// }) => {
//   const [val, setVal] = useState("");

//   const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if ((e.key === "Enter" || e.key === ",") && val.trim()) {
//       e.preventDefault();
//       onAdd(val.trim().toUpperCase());
//       setVal("");
//     }
//     if (e.key === "Backspace" && !val && tags.length) {
//       onRemove(tags[tags.length - 1]);
//     }
//   };

//   return (
//     <FormField label={label} hint={hint}>
//       <div className="border border-neutral-200 focus-within:border-black transition-colors duration-200 p-2 min-h-[48px] flex flex-wrap gap-1.5">
//         {tags.map((tag) => (
//           <span
//             key={tag}
//             className="inline-flex items-center gap-1.5 bg-black text-white text-[10px] tracking-widest uppercase font-medium px-2.5 py-1"
//           >
//             {tag}
//             <button
//               type="button"
//               onClick={() => onRemove(tag)}
//               className="hover:text-neutral-300 transition-colors leading-none"
//             >
//               ×
//             </button>
//           </span>
//         ))}
//         <input
//           value={val}
//           onChange={(e) => setVal(e.target.value)}
//           onKeyDown={handleKey}
//           placeholder={tags.length === 0 ? placeholder : ""}
//           className="flex-1 min-w-[80px] outline-none text-sm text-black placeholder:text-neutral-300 bg-transparent px-1"
//         />
//       </div>
//     </FormField>
//   );
// };

// // ─── Size Guide Table ─────────────────────────────────────────────────────────
// const SizeGuideEditor = ({
//   rows,
//   onChange,
// }: {
//   rows: SizeGuideRow[];
//   onChange: (rows: SizeGuideRow[]) => void;
// }) => {
//   const addRow = () =>
//     onChange([...rows, { size: "", fullLength: "", chest: "", sleeve: "" }]);

//   const updateRow = (i: number, field: keyof SizeGuideRow, value: string) => {
//     const updated = rows.map((r, idx) =>
//       idx === i ? { ...r, [field]: value } : r
//     );
//     onChange(updated);
//   };

//   const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

//   const cols: { key: keyof SizeGuideRow; label: string }[] = [
//     { key: "size", label: "Size" },
//     { key: "fullLength", label: "Full Length" },
//     { key: "chest", label: "Chest" },
//     { key: "sleeve", label: "Sleeve" },
//   ];

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="border-b border-neutral-200">
//               {cols.map((c) => (
//                 <th
//                   key={c.key}
//                   className="text-left text-[10px] tracking-widest uppercase font-semibold text-neutral-400 py-2 pr-4 first:pl-0"
//                 >
//                   {c.label}
//                 </th>
//               ))}
//               <th className="w-8" />
//             </tr>
//           </thead>
//           <tbody>
//             {rows.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="py-6 text-center text-[11px] text-neutral-300 tracking-wide"
//                 >
//                   No rows yet — click Add Row below
//                 </td>
//               </tr>
//             )}
//             {rows.map((row, i) => (
//               <tr key={i} className="border-b border-neutral-100 group">
//                 {cols.map((c) => (
//                   <td key={c.key} className="py-1.5 pr-3 first:pl-0">
//                     <input
//                       value={row[c.key]}
//                       onChange={(e) => updateRow(i, c.key, e.target.value)}
//                       className="w-full text-sm text-black bg-transparent outline-none border-b border-transparent focus:border-black transition-colors py-0.5 placeholder:text-neutral-200"
//                       placeholder="—"
//                     />
//                   </td>
//                 ))}
//                 <td className="py-1.5 text-right">
//                   <button
//                     type="button"
//                     onClick={() => removeRow(i)}
//                     className="text-neutral-300 hover:text-black transition-colors text-base leading-none opacity-0 group-hover:opacity-100"
//                   >
//                     ×
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <button
//         type="button"
//         onClick={addRow}
//         className="self-start text-[11px] tracking-widest uppercase font-semibold text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors duration-200"
//       >
//         + Add Row
//       </button>
//     </div>
//   );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function CreateProduct() {
//   const router = useRouter();
//   const { mutate: createProduct, isPending } = useCreateProduct();

//   // ── Fetch categories internally ──
//   const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategories();
//   const categories = categoriesData ?? [];

//   console.log(categoriesData
//   )

//   // Form state
//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");
//   const [badge, setBadge] = useState<Badge | "">("");
//   const [categoryId, setCategoryId] = useState("");
//   const [sizeType, setSizeType] = useState<SizeType | "">("");
//   const [colors, setColors] = useState<string[]>([]);
//   const [sizes, setSizes] = useState<string[]>([]);
//   const [sizeGuideRows, setSizeGuideRows] = useState<SizeGuideRow[]>([]);

//   // Image state
//   const [cardImageFile, setCardImageFile] = useState<File | null>(null);
//   const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);
//   const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
//   const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
//   const [sizeGuideFile, setSizeGuideFile] = useState<File | null>(null);
//   const [sizeGuidePreview, setSizeGuidePreview] = useState<string | null>(null);

//   // Errors
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Auto-generate slug from title
//   const handleTitleChange = (val: string) => {
//     setTitle(val);
//     setSlug(
//       val
//         .toLowerCase()
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-")
//         .trim()
//     );
//   };

//   // Image handlers
//   const handleCardImage = (files: FileList) => {
//     const file = files[0];
//     if (!file) return;
//     setCardImageFile(file);
//     setCardImagePreview(URL.createObjectURL(file));
//   };

//   const handleGalleryImages = (files: FileList) => {
//     const arr = Array.from(files);
//     setGalleryFiles((prev) => [...prev, ...arr]);
//     setGalleryPreviews((prev) => [
//       ...prev,
//       ...arr.map((f) => URL.createObjectURL(f)),
//     ]);
//   };

//   const handleSizeGuideImage = (files: FileList) => {
//     const file = files[0];
//     if (!file) return;
//     setSizeGuideFile(file);
//     setSizeGuidePreview(URL.createObjectURL(file));
//   };

//   // Validate
//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!title.trim()) e.title = "Title is required";
//     if (!categoryId) e.categoryId = "Category is required";
//     if (!price || Number(price) <= 0) e.price = "Price must be greater than 0";
//     if (!cardImageFile) e.cardImage = "Product card image is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // Submit
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const form = new FormData();
//     form.append("title", title);
//     form.append("slug", slug);
//     form.append("description", description);
//     form.append("price", price);
//     form.append("stock", stock || "0");
//     if (badge) form.append("badge", badge);
//     form.append("categoryId", categoryId);
//     if (sizeType) form.append("sizeType", sizeType);
//     form.append("colors", JSON.stringify(colors));
//     form.append("sizes", JSON.stringify(sizes));
//     if (sizeGuideRows.length > 0)
//       form.append("sizeGuideData", JSON.stringify(sizeGuideRows));
//     if (cardImageFile) form.append("productCardImage", cardImageFile);
//     galleryFiles.forEach((f) => form.append("galleryImages", f));
//     if (sizeGuideFile) form.append("sizeGuideImage", sizeGuideFile);

//     createProduct(form, {
//       onSuccess: () => router.push("/admin/products"),
//     });
//   };

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       {/* ── Header ── */}
//       <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="text-neutral-400 hover:text-black transition-colors"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//               >
//                 <path d="M19 12H5M12 5l-7 7 7 7" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-sm font-semibold tracking-widest uppercase text-black">
//                 Create Product
//               </h1>
//               <p className="text-[11px] text-neutral-400 tracking-wide mt-0.5">
//                 Add a new item to your catalog
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="hidden sm:block text-[11px] tracking-widest uppercase font-semibold text-neutral-500 border border-neutral-200 px-5 py-2.5 hover:border-black hover:text-black transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               form="create-product-form"
//               disabled={isPending}
//               className="text-[11px] tracking-widest uppercase font-semibold text-white bg-black px-5 py-2.5 hover:bg-neutral-800 transition-colors duration-200 disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               {isPending ? (
//                 <>
//                   <svg
//                     className="animate-spin"
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
//                   </svg>
//                   Saving...
//                 </>
//               ) : (
//                 "Publish Product"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Form ── */}
//       <form
//         id="create-product-form"
//         onSubmit={handleSubmit}
//         className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
//       >
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* ── Left Column ── */}
//           <div className="lg:col-span-2 flex flex-col gap-10">
//             {/* Section 1: Basic Info */}
//             <div className="bg-white border border-neutral-200 p-6 sm:p-8">
//               <SectionTitle step="1" title="Basic Information" />
//               <div className="flex flex-col gap-5">
//                 <FormField label="Product Title" required error={errors.title}>
//                   <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => handleTitleChange(e.target.value)}
//                     placeholder="e.g. Classic Oxford Shirt"
//                     className={`${inputCls} ${errors.title ? "border-red-400" : ""}`}
//                   />
//                 </FormField>

//                 <FormField
//                   label="URL Slug"
//                   hint="Auto-generated from title. Edit if needed."
//                 >
//                   <div className="flex items-center border border-neutral-200 focus-within:border-black transition-colors">
//                     <span className="text-neutral-300 text-sm px-3 py-3 border-r border-neutral-200 bg-neutral-50 select-none">
//                       /products/
//                     </span>
//                     <input
//                       type="text"
//                       value={slug}
//                       onChange={(e) => setSlug(e.target.value)}
//                       placeholder="classic-oxford-shirt"
//                       className="flex-1 text-sm text-black px-3 py-3 outline-none bg-white placeholder:text-neutral-300"
//                     />
//                   </div>
//                 </FormField>

//                 <FormField label="Description">
//                   <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Describe the product — material, fit, occasion..."
//                     rows={5}
//                     className={`${inputCls} resize-none leading-relaxed`}
//                   />
//                 </FormField>
//               </div>
//             </div>

//             {/* Section 2: Pricing & Inventory */}
//             <div className="bg-white border border-neutral-200 p-6 sm:p-8">
//               <SectionTitle step="2" title="Pricing & Inventory" />
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                 <FormField label="Price (BDT)" required error={errors.price}>
//                   <div className="flex items-center border border-neutral-200 focus-within:border-black transition-colors">
//                     <span className="text-neutral-400 text-sm px-3 py-3 border-r border-neutral-200 bg-neutral-50 select-none">
//                       ৳
//                     </span>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={price}
//                       onChange={(e) => setPrice(e.target.value)}
//                       placeholder="0.00"
//                       className={`flex-1 text-sm text-black px-3 py-3 outline-none bg-white placeholder:text-neutral-300 ${errors.price ? "border-red-400" : ""}`}
//                     />
//                   </div>
//                 </FormField>

//                 <FormField label="Stock Quantity" hint="Leave blank for unlimited">
//                   <input
//                     type="number"
//                     min="0"
//                     value={stock}
//                     onChange={(e) => setStock(e.target.value)}
//                     placeholder="0"
//                     className={inputCls}
//                   />
//                 </FormField>

//                 <FormField label="Badge">
//                   <div className="relative">
//                     <select
//                       value={badge}
//                       onChange={(e) => setBadge(e.target.value as Badge | "")}
//                       className={selectCls}
//                     >
//                       <option value="">None</option>
//                       <option value="NEW">New</option>
//                       <option value="SALE">Sale</option>
//                       <option value="BEST_SELLER">Best Seller</option>
//                       <option value="LOW_STOCK">Low Stock</option>
//                       <option value="OUT_OF_STOCK">Out of Stock</option>
//                     </select>
//                     <svg
//                       className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path d="M6 9l6 6 6-6" />
//                     </svg>
//                   </div>
//                 </FormField>
//               </div>
//             </div>

//             {/* Section 3: Variants */}
//             <div className="bg-white border border-neutral-200 p-6 sm:p-8">
//               <SectionTitle step="3" title="Colors & Sizes" />
//               <div className="flex flex-col gap-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <TagInput
//                     label="Colors"
//                     tags={colors}
//                     onAdd={(v) => !colors.includes(v) && setColors([...colors, v])}
//                     onRemove={(v) => setColors(colors.filter((c) => c !== v))}
//                     placeholder="Type color + Enter (e.g. BLACK)"
//                     hint="Press Enter or comma to add"
//                   />

//                   <TagInput
//                     label="Sizes"
//                     tags={sizes}
//                     onAdd={(v) => !sizes.includes(v) && setSizes([...sizes, v])}
//                     onRemove={(v) => setSizes(sizes.filter((s) => s !== v))}
//                     placeholder="Type size + Enter (e.g. M)"
//                     hint="Press Enter or comma to add"
//                   />
//                 </div>

//                 <FormField label="Size Type">
//                   <div className="flex gap-3 flex-wrap">
//                     {(["MEN", "WOMEN", "UNISEX"] as SizeType[]).map((t) => (
//                       <button
//                         key={t}
//                         type="button"
//                         onClick={() =>
//                           setSizeType((prev) => (prev === t ? "" : t))
//                         }
//                         className={`
//                           text-[11px] tracking-widest uppercase font-semibold px-5 py-2.5 border transition-colors duration-150
//                           ${sizeType === t
//                             ? "bg-black text-white border-black"
//                             : "bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black"
//                           }
//                         `}
//                       >
//                         {t}
//                       </button>
//                     ))}
//                   </div>
//                 </FormField>
//               </div>
//             </div>

//             {/* Section 4: Size Guide */}
//             <div className="bg-white border border-neutral-200 p-6 sm:p-8">
//               <SectionTitle step="4" title="Size Guide" />
//               <div className="flex flex-col gap-6">
//                 <SizeGuideEditor
//                   rows={sizeGuideRows}
//                   onChange={setSizeGuideRows}
//                 />
//                 <div className="border-t border-neutral-100 pt-6">
//                   <ImageUploadBox
//                     label="Size Guide Image (optional)"
//                     preview={sizeGuidePreview}
//                     onChange={handleSizeGuideImage}
//                     hint="Upload a visual size chart"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── Right Column ── */}
//           <div className="flex flex-col gap-6">
//             {/* Category */}
//             <div className="bg-white border border-neutral-200 p-6">
//               <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-4">
//                 Category
//               </h3>
//               <div className="relative">
//                 <select
//                   value={categoryId}
//                   onChange={(e) => setCategoryId(e.target.value)}
//                   disabled={categoriesLoading}
//                   className={`${selectCls} ${errors.categoryId ? "border-red-400" : ""} ${categoriesLoading ? "text-neutral-300" : ""}`}
//                 >
//                   <option value="">
//                     {categoriesLoading ? "Loading..." : "Select a category"}
//                   </option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.title}
//                     </option>
//                   ))}
//                 </select>
//                 <svg
//                   className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M6 9l6 6 6-6" />
//                 </svg>
//               </div>
//               {errors.categoryId && (
//                 <p className="text-[11px] text-red-500 font-medium mt-1.5">
//                   {errors.categoryId}
//                 </p>
//               )}
//             </div>

//             {/* Card Image */}
//             <div className="bg-white border border-neutral-200 p-6">
//               <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-4">
//                 Card Image <span className="text-black">*</span>
//               </h3>
//               <ImageUploadBox
//                 label=""
//                 preview={cardImagePreview}
//                 onChange={handleCardImage}
//                 hint="3:4 ratio recommended"
//               />
//               {errors.cardImage && (
//                 <p className="text-[11px] text-red-500 font-medium mt-2">
//                   {errors.cardImage}
//                 </p>
//               )}
//             </div>

//             {/* Gallery Images */}
//             <div className="bg-white border border-neutral-200 p-6">
//               <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-4">
//                 Gallery Images
//               </h3>
//               <ImageUploadBox
//                 label=""
//                 multiple
//                 previews={galleryPreviews}
//                 onChange={handleGalleryImages}
//                 hint="Up to 10 images"
//               />
//               {galleryFiles.length > 0 && (
//                 <p className="text-[11px] text-neutral-400 mt-2 tracking-wide">
//                   {galleryFiles.length} image{galleryFiles.length > 1 ? "s" : ""} selected
//                 </p>
//               )}
//             </div>

//             {/* Summary card */}
//             <div className="bg-black text-white p-6">
//               <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-4">
//                 Summary
//               </h3>
//               <div className="flex flex-col gap-3 text-sm">
//                 {[
//                   { label: "Title", value: title || "—" },
//                   {
//                     label: "Price",
//                     value: price ? `৳ ${Number(price).toLocaleString()}` : "—",
//                   },
//                   { label: "Stock", value: stock || "—" },
//                   {
//                     label: "Colors",
//                     value: colors.length ? colors.join(", ") : "—",
//                   },
//                   {
//                     label: "Sizes",
//                     value: sizes.length ? sizes.join(", ") : "—",
//                   },
//                   { label: "Badge", value: badge || "None" },
//                 ].map(({ label, value }) => (
//                   <div
//                     key={label}
//                     className="flex justify-between items-start gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
//                   >
//                     <span className="text-[11px] tracking-widest uppercase text-neutral-500 shrink-0">
//                       {label}
//                     </span>
//                     <span className="text-[11px] text-white text-right leading-relaxed truncate max-w-[60%]">
//                       {value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }