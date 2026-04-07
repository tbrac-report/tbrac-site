"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function CompanyProfilePage() {
  const router = useRouter();

  useEffect(() => {
    api.customers
      .list({ page: 1, page_size: 1 })
      .then(({ items }) => {
        if (items.length > 0) {
          router.replace(`/customers/${items[0].id}`);
        } else {
          router.replace("/customers/new");
        }
      })
      .catch(() => {
        router.replace("/customers/new");
      });
  }, [router]);

  return null;
}
