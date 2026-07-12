"use client";

import { useId, useOptimistic, useTransition } from "react";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { type BoardState, type ColumnId } from "@/lib/board-types";
import { moveCard } from "../actions";
import { Column } from "./column";

type Props = {
  initialState: BoardState;
};

const COLUMN_ORDER: readonly { id: ColumnId; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "doing", label: "Doing" },
  { id: "done", label: "Done" },
];

const COLUMN_DROP_PREFIX = "col:";

export function columnDropId(id: ColumnId): string {
  return `${COLUMN_DROP_PREFIX}${id}`;
}

function isColumnDropId(id: string): boolean {
  return id.startsWith(COLUMN_DROP_PREFIX);
}

function parseColumnDropId(id: string): ColumnId {
  return id.slice(COLUMN_DROP_PREFIX.length) as ColumnId;
}

function findLocation(
  state: BoardState,
  cardId: string,
): { column: ColumnId; index: number } | null {
  for (const { id: column } of COLUMN_ORDER) {
    const index = state[column].findIndex((c) => c.id === cardId);
    if (index !== -1) return { column, index };
  }
  return null;
}

type Move = {
  cardId: string;
  toColumn: ColumnId;
  toIndex: number;
};

function applyMove(state: BoardState, move: Move): BoardState {
  const from = findLocation(state, move.cardId);
  if (!from) return state;
  const next: BoardState = {
    todo: [...state.todo],
    doing: [...state.doing],
    done: [...state.done],
  };
  const [card] = next[from.column].splice(from.index, 1);
  const target = next[move.toColumn];
  const clamped = Math.max(0, Math.min(move.toIndex, target.length));
  target.splice(clamped, 0, card);
  return next;
}

export function Board({ initialState }: Props) {
  const [optimisticState, applyOptimistic] = useOptimistic(
    initialState,
    applyMove,
  );
  const [, startTransition] = useTransition();
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const overId = String(over.id);

    const from = findLocation(optimisticState, cardId);
    if (!from) return;

    let toColumn: ColumnId;
    let toIndex: number;

    if (isColumnDropId(overId)) {
      toColumn = parseColumnDropId(overId);
      toIndex = optimisticState[toColumn].length;
      if (from.column === toColumn) toIndex -= 1;
    } else {
      const to = findLocation(optimisticState, overId);
      if (!to) return;
      toColumn = to.column;
      toIndex = to.index;
      if (from.column === toColumn && from.index < to.index) toIndex -= 1;
    }

    if (from.column === toColumn && from.index === toIndex) return;

    startTransition(() => {
      applyOptimistic({ cardId, toColumn, toIndex });
      void moveCard(cardId, toColumn, toIndex);
    });
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid flex-1 grid-cols-3 gap-4">
        {COLUMN_ORDER.map((column) => (
          <Column
            key={column.id}
            columnId={column.id}
            label={column.label}
            cards={optimisticState[column.id]}
          />
        ))}
      </div>
    </DndContext>
  );
}
