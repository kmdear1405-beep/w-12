"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/tailgrids/core/badge";

type Credential = {
  role?: string;
  name?: string;
  email?: string;
};

export default function User() {
  const pathname = usePathname();
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("credentail");
      setCredential(raw ? JSON.parse(raw) : null);
    } catch {
      setCredential(null);
    }
  }, [pathname]);

  if (!credential) return null;

  return (
    <div className="mt-4 flex justify-center gap-6 text-md font-semibold">
      <span>
        ROLE: <Badge color="error"  className="text-xl">{credential.role}</Badge>
      </span>
      <span>
        NAME: <Badge color='success' className="text-xl">{credential.name}</Badge>
      </span>
      <span>
        EMAIL: <Badge color="gray" className="text-xl">{credential.email}</Badge>
      </span>
    </div>
  );
}