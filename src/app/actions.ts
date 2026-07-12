"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import {
  type BoardState,
  type Card,
  type ColumnId,
} from "@/lib/board-types";
import { readBoard, writeBoard } from "@/lib/persistence";

const COLUMNS: readonly ColumnId[] = ["todo", "doing", "done"];

function findCard(
  state: BoardState,
  cardId: string,
): { column: ColumnId; index: number } | null {
  for (const column of COLUMNS) {
    const index = state[column].findIndex((card) => card.id === cardId);
    if (index !== -1) {
      return { column, index };
    }
  }
  return null;
}

export async function addCard(title: string): Promise<void> {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return;
  }

  const state = await readBoard();
  const card: Card = { id: randomUUID(), title: trimmed };
  state.todo.push(card);
  await writeBoard(state);
  revalidatePath("/");
}

export async function deleteCard(cardId: string): Promise<void> {
  const state = await readBoard();
  const located = findCard(state, cardId);
  if (!located) return;

  state[located.column].splice(located.index, 1);
  await writeBoard(state);
  revalidatePath("/");
}

export async function moveCard(
  cardId: string,
  toColumn: ColumnId,
  toIndex: number,
): Promise<void> {
  const state = await readBoard();
  const located = findCard(state, cardId);
  if (!located) return;

  const [card] = state[located.column].splice(located.index, 1);
  const targetList = state[toColumn];
  const clampedIndex = Math.max(0, Math.min(toIndex, targetList.length));
  targetList.splice(clampedIndex, 0, card);

  await writeBoard(state);
  revalidatePath("/");
}
