export type Card = {
  id: string;
  title: string;
};

export type ColumnId = "todo" | "doing" | "done";

export type BoardState = {
  todo: Card[];
  doing: Card[];
  done: Card[];
};

export const EMPTY_BOARD: BoardState = {
  todo: [],
  doing: [],
  done: [],
};

export const PERSISTENCE_ERROR_MARKER = "TASK_BOARD_PERSIST_ERROR";

export type PersistenceErrorKind = "invalid_json" | "schema_mismatch";

export function encodePersistenceErrorMessage(
  kind: PersistenceErrorKind,
  filePath: string,
  detail: string,
): string {
  return [
    PERSISTENCE_ERROR_MARKER,
    `kind: ${kind}`,
    `filePath: ${filePath}`,
    `detail: ${detail}`,
  ].join("\n");
}

export type ParsedPersistenceError = {
  kind: PersistenceErrorKind;
  filePath: string;
  detail: string;
};

export function parsePersistenceErrorMessage(
  message: string,
): ParsedPersistenceError | null {
  const lines = message.split("\n");
  if (lines[0] !== PERSISTENCE_ERROR_MARKER) return null;

  let kind: PersistenceErrorKind | null = null;
  let filePath: string | null = null;
  let detail: string | null = null;

  for (const line of lines.slice(1)) {
    if (line.startsWith("kind: ")) {
      const value = line.slice(6);
      if (value === "invalid_json" || value === "schema_mismatch") {
        kind = value;
      }
    } else if (line.startsWith("filePath: ")) {
      filePath = line.slice(10);
    } else if (line.startsWith("detail: ")) {
      detail = line.slice(8);
    }
  }

  if (kind === null || filePath === null || detail === null) return null;
  return { kind, filePath, detail };
}
