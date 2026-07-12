"use client";

import { useRef, useState } from "react";
import { addCard } from "../actions";

export function AddCardForm() {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function action(formData: FormData) {
    const raw = formData.get("title");
    const value = typeof raw === "string" ? raw.trim() : "";
    if (value.length === 0) return;

    await addCard(value);
    setTitle("");
    inputRef.current?.focus();
  }

  const isEmpty = title.trim().length === 0;

  return (
    <form action={action} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="新しいタスク"
        className="flex-1 rounded-md border border-black/10 bg-white px-2 py-1 text-sm outline-none focus:border-black/40 dark:border-white/10 dark:bg-black dark:focus:border-white/40"
      />
      <button
        type="submit"
        disabled={isEmpty}
        className="rounded-md bg-black px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
      >
        追加
      </button>
    </form>
  );
}
