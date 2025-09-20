"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import type { ITodo } from "~/types/common";

export default function TodoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
  });

  const utils = api.useUtils();

  const createdTodoMutation = api.todo.create.useMutation({
    onSuccess: (newTodo, _input) => {
      utils.todo.list.setData(undefined, (old) => {
        if (old && old.length > 0) {
          return [...old, newTodo];
        }

        return [newTodo];
      });
    },
  });

  const onSubmit = (data: Pick<ITodo, "title">) => {
    createdTodoMutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          reset();
        },
        onError: () => {
          reset();
        },
      },
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="e.g. Buy groceries"
            className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
              errors.title ? "border-red-300" : "border-slate-200"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="flex items-end">
          <button
            className="rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-2 text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
            type="submit"
            disabled={createdTodoMutation.isPending}
          >
            {createdTodoMutation.isPending ? "Adding..." : "Add"}
          </button>
        </div>
        {createdTodoMutation.isError && (
          <p className="text-red-500">Error creating todo</p>
        )}
      </form>
    </div>
  );
}
