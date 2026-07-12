## Why

task-board プロジェクトを立ち上げるにあたり、まず「動く最小のカンバン」を Spec-First で定義したい。個人ローカルで使える軽量なタスク管理ツールが目的で、大掛かりな機能を先に決めるより、日常的に使える最小限の板を早く手にして、そこから育てていく方が判断を誤りにくい。この変更は task-board にとって最初の変更提案であり、プロダクト全体の骨格 (実行形態・データ永続化・UI 構成) を初めて確定させる意味を持つ。

## What Changes

- Next.js (App Router) + TypeScript + Tailwind CSS を土台とした、個人ローカル用の Web アプリを新規に立ち上げる。
- 単一ボード・3 列固定 (Todo / Doing / Done) のカンバンを提供する。カード内容はタイトルのみ。
- 以下の 3 操作を提供する: カード追加、カード削除、カラム間移動。
- カラム間移動はドラッグ & ドロップで行う (`@dnd-kit`)。フォールバックの操作 UI は用意しない。
- データは `./data/tasks.json` に JSON 形式で保存する。`./data/` は `.gitignore` 対象。
- 書き込み系 API は Server Actions で実装する。Route Handler は原則使わない。
- 起動はターミナルから `npm run dev` 相当のコマンドで行い、ブラウザで `localhost` にアクセスして利用する。

## Capabilities

### New Capabilities
- `kanban-board`: 単一ボード・3 列固定のカンバン UI と、カード CRUD (追加・削除) およびカラム間移動を提供する。
- `task-persistence`: タスクの状態をローカル JSON ファイル (`./data/tasks.json`) に永続化する。読み込み・書き込み・初回生成のふるまいを定める。

### Modified Capabilities
- (なし。task-board 最初の変更提案のため、既存 spec は存在しない)

## Non-goals

以下は本変更のスコープ外とする。将来必要になれば別の変更提案として扱う。

- 複数ボードの管理、ボード切替、ボードのアーカイブ
- カラム構成のカスタマイズ (追加・並び替え・リネーム)
- カードの詳細情報 (説明文、期日、タグ、担当、添付、コメント、サブタスク、履歴)
- 検索・フィルタ・ソート・保存済みビュー
- 認証、マルチユーザー、リモート同期、他デバイスとの共有
- 通知、リマインダー、キーボードショートカット
- 単一バイナリ配布、Electron/Tauri などのデスクトップアプリ化
- SQLite など DB の採用 (JSON ファイルで開始し、必要になったら別提案で再検討)
- テーマ切替 (ライト/ダーク) 等の見た目のカスタマイズ
- インポート / エクスポート機能 (JSON ファイル自体が実体なので当面不要)

## Impact

- **リポジトリ構成**: `package.json`、Next.js プロジェクト一式 (`app/`、`public/` 等)、`tsconfig.json`、Tailwind 設定、`.gitignore` を新規追加する。
- **依存関係**: `next`、`react`、`react-dom`、`typescript`、`tailwindcss`、`@dnd-kit/core`、`@dnd-kit/sortable` 等を新規に導入する。
- **データ**: 実行時に `./data/tasks.json` が生成される。`.gitignore` で追跡対象から除外する。
- **既存コード**: 影響なし (新規プロジェクトのため)。
- **将来への影響**:
  - `task-persistence` を JSON ベースで確立するため、後で SQLite などに切り替える際は本 capability の spec を書き換える形になる。
  - `kanban-board` はカラム構成が 3 列固定として仕様化されるため、将来カラムカスタマイズを入れる際はここに delta を当てる。
