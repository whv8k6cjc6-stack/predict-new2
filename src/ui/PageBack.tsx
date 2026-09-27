"use client";
import { useRouter } from "next/navigation";
import { Icon } from "./primitives";

export function BackButton({ label = "返回" }: { label?: string }) {
  const router = useRouter();
  return (
    <button onClick={() => (history.length > 1 ? router.back() : router.push("/"))} className="flex items-center gap-1 text-[14px] text-[var(--ink-2)]">
      <Icon name="chevron" size={16} className="rotate-180" />{label}
    </button>
  );
}
