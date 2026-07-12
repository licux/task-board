# task-board

個人ローカル用のカンバン方式タスク管理 Web アプリ。単一ボード / 3 カラム (Todo / Doing / Done) 固定 / タイトルのみのカード / DnD による並び替え・移動 / JSON ファイル永続化。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。開発サーバは Ctrl+C で停止。

`npm run build` / `npm start` は用意していません。用途上、開発サーバ (`npm run dev`) のみで運用します。

## データの保存先

- 保存先: リポジトリルート直下の `./data/tasks.json` (固定パス、環境変数による上書きなし)
- 初回起動時にディレクトリごと自動生成されます
- ファイルが破損した場合は起動時に専用エラー画面が表示され、勝手には上書きされません (手動で修正 or 削除してから再読み込み)
- `./data/` は `.gitignore` 済み

## 対象ブラウザ

Chrome / Edge (最新版) を想定。ローカル利用のためクロスブラウザ検証は行っていません。

## 技術スタック

- Next.js (App Router) + TypeScript + Tailwind CSS
- Server Actions で永続化 (API Route は使用せず)
- `@dnd-kit/core` + `@dnd-kit/sortable` によるドラッグ & ドロップ

## 設計ドキュメント

設計判断の詳細は [openspec/](openspec/) 配下の change (proposal / design / specs / tasks) を参照。
