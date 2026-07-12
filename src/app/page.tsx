import { readBoard } from "@/lib/persistence";
import { Board } from "./_components/board";

export default async function Home() {
  const board = await readBoard();

  return (
    <main className="flex flex-1 flex-col p-6">
      <h1 className="mb-6 text-2xl font-semibold">task-board</h1>
      <Board initialState={board} />
    </main>
  );
}
