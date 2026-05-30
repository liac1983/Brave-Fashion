"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { FolderPlus, Check, Plus, X } from "lucide-react";

type List = { _id: string; name: string; products: { _id: string }[] | null };

export default function AddToListButton({ productId }: { productId: string }) {
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadLists() {
    const res = await fetch("/api/lists");
    const data = await res.json();
    setLists(data.lists ?? []);
  }

  function handleOpen() {
    setOpen(true);
    loadLists();
  }

  async function toggleProduct(listId: string, inList: boolean) {
    setLoading(true);
    await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action: inList ? "remove" : "add" }),
    });
    await loadLists();
    setLoading(false);
  }

  async function createList() {
    if (!newListName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newListName }),
    });
    const data = await res.json();
    if (data.id) {
      await fetch(`/api/lists/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "add" }),
      });
      setNewListName("");
      await loadLists();
    }
    setLoading(false);
  }

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className="mt-4 flex items-center gap-2 text-[16px] text-neutral-500 transition hover:text-[#B76E2B]"
      >
        <FolderPlus size={20} strokeWidth={1.8} />
        Guardar em lista
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-50 w-72 rounded-[6px] border border-[#e7d9cf] bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-neutral-900">As minhas listas</p>
            <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-700">
              <X size={16} />
            </button>
          </div>

          {lists.length === 0 && (
            <p className="mb-3 text-sm text-neutral-400">Ainda não tens listas.</p>
          )}

          <div className="mb-3 space-y-2">
            {lists.map((list) => {
              const inList = list.products?.some((p) => p._id === productId) ?? false;
              return (
                <button
                  key={list._id}
                  type="button"
                  disabled={loading}
                  onClick={() => toggleProduct(list._id, inList)}
                  className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2 text-left text-[15px] transition hover:bg-[#f7f2ec]"
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${inList ? "border-[#B76E2B] bg-[#B76E2B]" : "border-neutral-300"}`}>
                    {inList && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                  {list.name}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 border-t border-[#e7d9cf] pt-3">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createList()}
              placeholder="Nova lista..."
              className="flex-1 rounded-[6px] border border-[#e7d9cf] px-3 py-2 text-sm outline-none focus:border-[#B76E2B]"
            />
            <button
              type="button"
              onClick={createList}
              disabled={loading || !newListName.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#B76E2B] text-white disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
