"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type Card, type ColumnId } from "@/lib/board-types";
import { AddCardForm } from "./add-card-form";
import { CardItem } from "./card-item";
import { columnDropId } from "./board";

type Props = {
  columnId: ColumnId;
  label: string;
  cards: Card[];
};

export function Column({ columnId, label, cards }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: columnDropId(columnId) });

  return (
    <section className="flex flex-col rounded-lg border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          {label}
        </h2>
        <span className="text-xs text-black/50 dark:text-white/50">
          {cards.length}
        </span>
      </header>

      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex min-h-16 flex-1 flex-col gap-2 rounded-md p-1 transition-colors ${
            isOver ? "bg-black/[0.04] dark:bg-white/[0.06]" : ""
          }`}
        >
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>

      {columnId === "todo" && (
        <div className="mt-3">
          <AddCardForm />
        </div>
      )}
    </section>
  );
}
