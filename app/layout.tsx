"use client";
import "./globals.css";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { buttonStyles } from "@/components/tailgrids/core/button";

import Header from "@/components/Header";
import User from "@/components/user";
import Footer from "@/components/Footer";

import { canAccess, rolePages } from "@/utils/permission";

import { createContext, useEffect, useState } from "react";
import { fetchProducts, Product } from "@/data/product";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { doLogout } from "@/utils/login";
export const globalDataContext = createContext<any>(null);

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Product[]>([]);
  console.log(pathname);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data as Product[]))
      .catch((error) => setProducts([]));
  }, []);
  const handleLogout = () => {
    doLogout(router, "/login");
  };

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === "/login") return;

    const raw = localStorage.getItem("credentail");
    const cred = raw ? JSON.parse(raw) : null;
    setRole(cred?.role ?? null);

    if (cred && !canAccess(cred.role, pathname)) {
      // เด้งไปหน้าแรกที่ role นั้นเข้าได้
      router.replace(rolePages[cred.role]?.[0] ?? "/login");
    }
  }, [pathname]);
  return (
    <globalDataContext.Provider
      value={{ products, setProducts, carts, setCarts }}
    >
      <html>
        <body>
          <Header />
          <User />
          <nav className="mt-4 flex justify-center gap-4">
            {canAccess(role, "/") && (
              <Link
                href={"/"}
                className={buttonStyles({
                  appearance: pathname === "/" ? "fill" : "outline",
                  variant: "primary",
                })}
              >
                Home
              </Link>
            )}
            {canAccess(role, "/animation") && (
              <Link
                href={"/animation"}
                className={buttonStyles({
                  appearance: pathname === "/animation" ? "fill" : "outline",
                  variant: "primary",
                })}
              >
                Animation
              </Link>
            )}
            {canAccess(role, "/calculator") && (
              <Link
                href={"/calculator"}
                className={buttonStyles({
                  appearance: pathname === "/calculator" ? "fill" : "outline",
                  variant: "primary",
                })}
              >
                Calculator
              </Link>
            )}
            {canAccess(role, "/todos") && (
              <Link
                href={"/todos"}
                className={buttonStyles({
                  appearance: pathname === "/todos" ? "fill" : "outline",
                  variant: "primary",
                })}
              >
                Todos
              </Link>
            )}

            {canAccess(role, "/products") && (
              <Link
                href={"/products"}
                className={buttonStyles({
                  appearance: pathname === "/products" ? "fill" : "outline",
                  variant: "primary",
                })}
              >
                Products ({products.length})
              </Link>
            )}

            {canAccess(role, "/carts") && (
              <div className="relative">
                <Link
                  href={"/carts"}
                  className={buttonStyles({
                    appearance: pathname === "/carts" ? "fill" : "outline",
                    variant: "primary",
                 
                  })}
                >
                  Carts
                </Link>
                <Badge
                  size={"sm"}
                  className="absolute -top-2 -right-2 bg-red-500 text-white"
                >
                  {carts.length}
                </Badge>
              </div>
            )}
            <Button
              appearance="outline"
              variant="danger"
              className="ml-1"
              onClick={() => handleLogout()}
            >
              Log Out
            </Button>
          </nav>
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </globalDataContext.Provider>
  );
}
