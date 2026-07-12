"use client";

import {
  parsePersistenceErrorMessage,
  type ParsedPersistenceError,
} from "@/lib/board-types";

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

const KIND_LABEL: Record<ParsedPersistenceError["kind"], string> = {
  invalid_json: "JSON パースに失敗しました",
  schema_mismatch: "保存データのスキーマが一致しません",
};

export default function ErrorPage({ error, unstable_retry }: Props) {
  const parsed = parsePersistenceErrorMessage(error.message);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 px-4 py-8 font-sans">
      <h1 className="text-2xl font-semibold">読み込みエラー</h1>

      {parsed ? (
        <div className="flex flex-col gap-3 rounded-lg border border-red-500/40 bg-red-500/[0.06] p-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
              種別
            </div>
            <div className="font-medium">{KIND_LABEL[parsed.kind]}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
              対象ファイル
            </div>
            <div className="break-all font-mono text-xs">{parsed.filePath}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
              詳細
            </div>
            <div className="break-words font-mono text-xs">{parsed.detail}</div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-black/10 bg-black/[0.03] p-4 text-sm dark:border-white/10 dark:bg-white/[0.05]">
          <div className="mb-1 text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
            メッセージ
          </div>
          <div className="break-words font-mono text-xs">{error.message}</div>
          {error.digest && (
            <div className="mt-2 text-xs text-black/50 dark:text-white/50">
              digest: {error.digest}
            </div>
          )}
        </div>
      )}

      <div>
        <p className="mb-2 text-sm text-black/70 dark:text-white/70">
          データファイルを修正した後、下のボタンで再読み込みできます。
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          再読み込み
        </button>
      </div>
    </main>
  );
}
