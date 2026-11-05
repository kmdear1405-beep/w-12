"use client";

import { useContext, useEffect } from "react";
import { globalDataContext } from "../layout";
import { Product } from "@/data/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";

export default function Page() {
  const router = useRouter();
  useEffect(() => checkLogin(router, "/carts"), [router]);
  const { products, setProducts, carts, setCarts } =
    useContext(globalDataContext);

  const removeFromCarts = (product: Product) => {
    setCarts(carts.filter((p: Product) => p.id !== product.id));
    setProducts([...products, product]); // คืนสินค้ากลับไปหน้า Products
  };

  const total = carts.reduce((sum: number, p: Product) => sum + Number(p.price), 0);

  return (
    <div className="mt-4 w-3xl mx-auto">
      <div className="bg-cyan-50 h-100 border border-gray-300 rounded-xl overflow-y-auto overflow-x-hidden p-4">
        {carts.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            ตะกร้าว่างเปล่า
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {carts.map((product: Product) => (
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
                    onClick={() => removeFromCarts(product)}
                    className="mt-auto w-full rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-medium py-1.5 transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* สรุปยอด */}
      <div className="mt-3 flex justify-between items-center bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm">
        <span>
          สินค้าในตะกร้า <b>{carts.length}</b> ชิ้น
        </span>
        <span>
          รวม <b className="text-emerald-600">฿{total.toFixed(2)}</b>
        </span>
      </div>
    </div>
  );
}