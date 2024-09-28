import Layout from "@/components/domain/layout";
import { useSession } from "@/hooks/use-session";
import { LucideListTodo, LucideLoader2, LucideTrash2 } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { FC } from "react";
import AddTodoDialog, {
  handleGetTodos,
} from "@/components/domain/add-todo-dialog";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Todo } from "@/lib/types";
import ky from "ky";

const todos: Array<{ id: number; title: string; content: string }> = [
  {
    id: 1,
    title: "Buy groceries",
    content: "Milk, bread, eggs, and bananas",
  },
  {
    id: 2,
    title: "Pay bills",
    content: "Electricity, water, and internet",
  },
  {
    id: 3,
    title: "Call mom",
    content: "Wish her a happy birthday",
  },
];

const Todo: FC<Todo & { userId: number }> = ({
  id,
  title,
  userId,
  content,
}) => {
  const { isLoading, mutate } = useSWR(
    ["/api/v1/todos", userId],
    handleGetTodos
  );

  const handleDeleteTodo = async () => {
    await ky
      .delete(`${import.meta.env.VITE_API_URL}/v1/todos/${id}`, {
        credentials: "include",
      })
      .json();
    mutate();
  };

  return (
    <article className="flex justify-between rounded-md border border-gray-300 bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-slate-600">{content}</p>
      </div>
      <div>
        <Button
          variant="outline"
          size="icon"
          disabled={isLoading}
          onClick={handleDeleteTodo}
        >
          {isLoading ? (
            <LucideLoader2 className="h-5 w-5 text-gray-500" />
          ) : (
            <LucideTrash2 className="h-5 w-5 text-red-500" />
          )}
        </Button>
      </div>
    </article>
  );
};

const TodosFor: FC<{ userId: number }> = ({ userId }) => {
  const [parent] = useAutoAnimate();
  const { data, isLoading } = useSWR(["/api/v1/todos", userId], handleGetTodos);

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <LucideLoader2 className="h-9 w-9 animate-spin text-black" />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4" ref={parent}>
      {data?.map((todo) => <Todo key={todo.id} userId={userId} {...todo} />)}
    </section>
  );
};

const ProtectedTodosContent: FC = () => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <LucideLoader2 className="h-9 w-9 animate-spin text-black" />
      </section>
    );
  }

  if (!user) {
    return <></>;
  }

  return (
    <section className="py-8">
      <div className="flex justify-between">
        <h1 className="mb-10 flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <LucideListTodo className="mt-1 h-6 w-6 font-bold" />{" "}
          <span className="underline underline-offset-8">
            {user.username}'s Todos
          </span>
        </h1>
        <AddTodoDialog userId={user.id} />
      </div>
      <TodosFor userId={user.id} />
    </section>
  );
};

const TodosPage: FC = () => {
  return (
    <Layout protectedPage>
      <ProtectedTodosContent />
    </Layout>
  );
};

export default TodosPage;
