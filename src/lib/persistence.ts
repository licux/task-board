import { promises as fs } from "node:fs";
import path from "node:path";
import {
  type BoardState,
  type Card,
  encodePersistenceErrorMessage,
} from "./board-types";

export const DATA_FILE_PATH = path.join(process.cwd(), "data", "tasks.json");

export class InvalidJsonError extends Error {
  readonly filePath: string;
  readonly detail: string;
  constructor(filePath: string, cause: unknown) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    super(encodePersistenceErrorMessage("invalid_json", filePath, detail));
    this.name = "InvalidJsonError";
    this.filePath = filePath;
    this.detail = detail;
    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}

export class SchemaMismatchError extends Error {
  readonly filePath: string;
  readonly detail: string;
  constructor(filePath: string, detail: string) {
    super(encodePersistenceErrorMessage("schema_mismatch", filePath, detail));
    this.name = "SchemaMismatchError";
    this.filePath = filePath;
    this.detail = detail;
  }
}

function isCard(value: unknown): value is Card {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.title === "string";
}

function isCardArray(value: unknown): value is Card[] {
  return Array.isArray(value) && value.every(isCard);
}

function parseBoardState(raw: unknown, filePath: string): BoardState {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new SchemaMismatchError(
      filePath,
      "root value must be an object with todo/doing/done arrays",
    );
  }
  const record = raw as Record<string, unknown>;
  for (const column of ["todo", "doing", "done"] as const) {
    if (!(column in record)) {
      throw new SchemaMismatchError(filePath, `missing column "${column}"`);
    }
    if (!isCardArray(record[column])) {
      throw new SchemaMismatchError(
        filePath,
        `column "${column}" must be an array of { id: string, title: string }`,
      );
    }
  }
  return {
    todo: record.todo as Card[],
    doing: record.doing as Card[],
    done: record.done as Card[],
  };
}

export async function readBoard(): Promise<BoardState> {
  let contents: string;
  try {
    contents = await fs.readFile(DATA_FILE_PATH, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { todo: [], doing: [], done: [] };
    }
    throw err;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch (err) {
    throw new InvalidJsonError(DATA_FILE_PATH, err);
  }

  return parseBoardState(parsed, DATA_FILE_PATH);
}

export async function writeBoard(state: BoardState): Promise<void> {
  const dir = path.dirname(DATA_FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
  const serialized = JSON.stringify(state, null, 2) + "\n";
  await fs.writeFile(DATA_FILE_PATH, serialized, "utf8");
}
