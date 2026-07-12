<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Verification

- 型検査 (`tsc --noEmit`) / lint (`npm run lint`) / ユニットテストの pass は UI の動作確認ではない。UI に影響する変更を、これらの pass だけを根拠に「確認済み」と報告してはいけない。
- UI 検証は人が実施する。AI 側は tasks.md に手動確認項目を明示し、人が実施してからチェックを入れる。AI が代行チェックしない。
- OpenSpec ワークフローで change を提案する場合、`openspec/config.yaml` の `rules.tasks` に従い、UI 影響のある change の tasks.md には手動確認タスクを含めること。
