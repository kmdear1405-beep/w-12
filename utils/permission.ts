'use client'
export const rolePages: Record<string, string[]> = {
  admin: ["/", "/animation", "/calculator", "/todos", "/products", "/carts"],
  manager: ["/products","/carts"],
  user: ["/", "/animation", "/calculator", "/todos", "/products", "/carts"],
};

export const canAccess = (role: string | null | undefined, path: string) =>
  !!role && (rolePages[role]?.includes(path) ?? false);