"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconRefresh } from "@tabler/icons-react";

export default function RefreshButton() {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      aria-label="Refresh public games"
      className={
        "btn btn-square btn-ghost btn-sm" + (isLoading ? " loading" : "")
      }
      onClick={handleRefresh}
    >
      <IconRefresh size={16} />
    </button>
  );
}
