## 1. プロジェクト初期化

- [x] 1.1 Next.js プロジェクトを App Router + TypeScript + Tailwind CSS 構成で新規作成する (`create-next-app` を利用、リポジトリルート直下に生成)
- [x] 1.2 `package.json` のスクリプトを整理し、`npm run dev` で開発サーバが立ち上がることを確認する
- [x] 1.3 `tsconfig.json` の `strict` が有効になっていることを確認する
- [x] 1.4 Tailwind CSS が動作することを、トップページの簡易スタイル適用で確認する
- [x] 1.5 `.gitignore` に `node_modules/`, `.next/`, `data/` を含める (特に `data/` の除外を明示)
- [x] 1.6 `@dnd-kit/core` と `@dnd-kit/sortable` を依存関係に追加する

## 2. データ層 (task-persistence)

- [x] 2.1 永続化スキーマの TypeScript 型を定義する: `Card = { id: string; title: string }`, `BoardState = { todo: Card[]; doing: Card[]; done: Card[] }`
- [x] 2.2 永続化モジュールを 1 ファイルに閉じ込める場所を決める (例: `src/lib/persistence.ts`) 。UI・Server Actions からは本モジュールが公開する関数のみを呼ぶ制約を確立する
- [x] 2.3 保存先パス `./data/tasks.json` を定数として定義する (環境変数による上書きは行わない)
- [x] 2.4 `readBoard(): BoardState` を実装する: ファイル不在時は空の初期状態を返す (ファイルは作成しない)
- [x] 2.5 `readBoard` に、JSON パース失敗時は明示的にエラーを throw する処理を追加する (黙って上書き禁止)
- [x] 2.6 `readBoard` に、パース結果がスキーマ不一致 (`todo`/`doing`/`done` が配列でない、要素が `id`/`title` を持たない等) の場合にエラーを throw する処理を追加する
- [x] 2.7 `writeBoard(state: BoardState): Promise<void>` を実装する: `./data/` ディレクトリが無ければ作成し、`./data/tasks.json` を上書きする
- [x] 2.8 `writeBoard` はカードの並び順を配列の順序で保持する (`order` フィールド等は使わない)
- [x] 2.9 手動テスト: 存在しない `./data/` から `readBoard` → 空状態が返り、ディレクトリは作られないことを確認する
- [x] 2.10 手動テスト: 破損 JSON (例: 途中で閉じていない) を配置した状態で `readBoard` がエラー停止することを確認する

## 3. Server Actions (書き込み系 API)

- [x] 3.1 Server Actions を配置するファイルを用意する (例: `src/app/actions.ts`、先頭に `"use server"`)
- [x] 3.2 `addCard(title: string): Promise<void>` を実装する: 空文字/ホワイトスペースのみを拒否、`Todo` の末尾にカードを追加、永続化モジュール経由で保存
- [x] 3.3 `deleteCard(cardId: string): Promise<void>` を実装する: 3 カラムを走査して該当 `id` を除去し保存する
- [x] 3.4 `moveCard(cardId: string, toColumn: 'todo'|'doing'|'done', toIndex: number): Promise<void>` を実装する: 元カラムから除去し、指定カラムの指定 index に挿入して保存する
- [x] 3.5 各 Server Action の末尾で `revalidatePath('/')` を呼び、UI に即時反映されるようにする
- [x] 3.6 `id` の採番方針を決めて共通化する (例: `crypto.randomUUID()` を Server Action 側で生成)
- [x] 3.7 Route Handler (`app/api/**`) は作らないこと (Server Actions に統一する)

## 4. UI 実装

- [x] 4.1 トップページ (`src/app/page.tsx`) を Server Component として実装し、`readBoard()` で初期状態をロードして下位コンポーネントに渡す
- [x] 4.2 3 カラムを横並びで表示するレイアウトを Tailwind で組む (`Todo` / `Doing` / `Done` の順で固定)
- [x] 4.3 カード表示コンポーネントを実装する: タイトルのみを表示し、削除操作の UI を含める
- [x] 4.4 カード追加フォームを実装する: `Todo` カラムに配置し、Server Action `addCard` を form action で呼ぶ
- [x] 4.5 空タイトルでの送信を UI 側でも防ぐ (Server Action と二重防御)
- [x] 4.6 カード削除ボタンを実装し、`deleteCard` を呼び出す
- [x] 4.7 各種操作後、ページのリロード無しで画面が更新されることを確認する (`revalidatePath` の効きを確認)

## 5. ドラッグ & ドロップ

- [x] 5.1 ボードのルートに `DndContext` (from `@dnd-kit/core`) を設置する Client Component を用意する
- [x] 5.2 各カラムを `SortableContext` (from `@dnd-kit/sortable`) で包む
- [x] 5.3 各カードを `useSortable` を用いてドラッグ可能にする
- [x] 5.4 `onDragEnd` ハンドラを実装し、`moveCard` Server Action を呼び出す (移動先カラム ID と index を渡す)
- [x] 5.5 別カラムへのドロップが正しく動くことを確認する
- [x] 5.6 同一カラム内での並び替えが正しく動くことを確認する
- [x] 5.7 カラム外領域へのドロップ・ドラッグキャンセルで状態が変化しないことを確認する
- [x] 5.8 「移動ボタン」等、DnD 以外の移動 UI が UI 上に一切存在しないことを確認する

## 6. エラー / エッジケース

- [x] 6.1 App Router の `error.tsx` を用意し、`readBoard` が投げる読み込みエラーを捕捉して、対象ファイルパスとエラー種別 (JSON パース不能 / スキーマ不一致) をユーザーに提示する
- [x] 6.2 エラー種別を判別可能にするため、永続化モジュール側で例外クラスまたはエラーコードを分けて throw する (例: `InvalidJsonError` / `SchemaMismatchError`)
- [x] 6.3 手動で `./data/tasks.json` を削除した後に再読み込み → 空ボードが表示されることを確認する
- [x] 6.4 手動で `./data/tasks.json` を壊した状態で再読み込み → 専用エラー画面が表示され、ファイルパスと問題種別が判別できることを確認する
- [x] 6.5 上記の破損確認後、`./data/tasks.json` の内容が変更されていない (上書きされていない) ことを確認する

## 7. 動作確認・仕上げ

- [x] 7.1 `npm run dev` で起動し、ブラウザで `localhost` にアクセスできることを確認する
- [x] 7.2 全シナリオを手動でひととおり実行する: カード追加 → Doing へ DnD → Done へ DnD → 削除
- [x] 7.3 開発サーバを一度再起動し、直前の操作結果 (`./data/tasks.json` の内容) がロードされることを確認する
- [x] 7.4 `README.md` を作成し、最低限「起動方法」「データの保存先」「対象ブラウザ (Chrome / Edge 想定)」を記載する
- [x] 7.5 初回コミットを作成する (このタイミング以前は proposal / design / specs / tasks 等の設計成果物のみが git 管理下にある想定)
