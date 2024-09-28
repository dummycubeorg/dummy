import { FC, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { LucidePlus } from "lucide-react";
import ky from "ky";
import { Todo } from "@/lib/types";
import useSWR from "swr";

export const handleGetTodos = async () => {
  const response = await ky
    .get<{ data: Todo[] }>(`${import.meta.env.VITE_API_URL}/v1/todos`, {
      credentials: "include",
    })
    .json();

  return response.data;
};

const AddTodoDialog: FC<{ userId: number }> = ({ userId }) => {
  const [form, setForm] = useState({ title: "", content: "" });
  const { mutate } = useSWR<Todo[]>(["/api/v1/todos", userId], handleGetTodos);

  const handleAddTodo = async () => {
    if (!form.title || !form.content) return;

    await ky
      .post(`${import.meta.env.VITE_API_URL}/v1/todos`, {
        json: { ...form },
        credentials: "include",
      })
      .json();

    setForm({ title: "", content: "" });
    mutate();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-300">
          <LucidePlus className="mr-2 h-4 w-4" />
          Add todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add todo</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new todo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Buy the grocery"
              className="col-span-3"
              value={form.title}
              name="title"
              onChange={(e) => {
                setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Input
              id="content"
              placeholder="Eggs, Milk, and Bread"
              className="col-span-3"
              value={form.content}
              name="content"
              onChange={(e) => {
                setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleAddTodo}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoDialog;
