"use client";

import { useContext, useEffect } from "react";
import { globalDataContext } from "../layout";
import { Product } from "@/data/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";

export default function Page() {
  const router = useRouter();
  useEffect(() => checkLogin(router, "/products"), [router]);
  const { products, setProducts, carts, setCarts } =
    useContext(globalDataContext);

  const addToCarts = (product: Product) => {
    setProducts(products.filter((p: Product) => p.id !== product.id));
    setCarts([...carts, product]);
  };

  return (
    <div className="mt-4 bg-cyan-50 w-3xl mx-auto h-100 border border-gray-300 rounded-xl overflow-y-auto overflow-x-hidden p-4">
      {products.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          ไม่มีสินค้าเหลือแล้ว
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* รูป */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                  ฿{product.price}
                </div>
              </div>

              {/* ชื่อ + ปุ่ม */}
              <div className="p-2 flex flex-col gap-2 flex-1">
                <p
                  className="text-sm text-gray-700 line-clamp-2 min-h-10"
                  title={product.title}
                >
                  {product.title}
                </p>
                <button
                  onClick={() => addToCarts(product)}
                  className="mt-auto w-full rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-medium py-1.5 transition cursor-pointer"
                >
                  Add to carts
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}   