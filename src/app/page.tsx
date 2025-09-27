import { HydrateClient } from "~/trpc/server";
import TodoForm from "./_components/TodoForm";
import TodoList from "./_components/TodoList";
import ChatV2 from "./_components/ChatV2";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="h-screen max-h-screen overflow-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="mx-auto grid h-full max-w-6xl grid-cols-2 gap-8 p-8">
          <div>
            <TodoForm />
            <TodoList />
          </div>
          {/* <ChatWithMCPServer /> */}
          <ChatV2 />
        </div>
      </main>
    </HydrateClient>
  );
}
