"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteCard } from "../actions";
import { type Card } from "@/lib/board-types";

type Props = {
  card: Card;
};

export function CardItem({ card }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="flex items-start justify-between gap-2 rounded-md border border-black/10 bg-white p-3 text-sm shadow-sm dark:border-white/10 dark:bg-black"
    >
      <span
        {...attributes}
        {...listeners}
        className="flex-1 cursor-grab touch-none break-words active:cursor-grabbing"
      >
        {card.title}
      </span>
      <form action={deleteCard.bind(null, card.id)}>
        <button
          type="submit"
          aria-label="削除"
          className="shrink-0 rounded px-1 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
        >
          ×
        </button>
      </form>
    </article>
  );
}
