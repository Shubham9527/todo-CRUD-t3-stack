"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { ITodo } from "~/types/common";

const TodoList = () => {
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const { data, isLoading, isLoadingError, isFetching, isRefetching } =
    api.todo.list.useQuery();
  const utils = api.useUtils();
  const updateTodoMutation = api.todo.update.useMutation({
    onMutate: (newTodo) => {
      const prevTodos = utils.todo.list.getData();

      utils.todo.list.setData(undefined, (oldTodos) => {
        return oldTodos?.map((todo) => {
          if (todo.id === newTodo.id) {
            return { ...todo, ...newTodo };
          }

          return todo;
        });
      });

      return { prevTodos };
    },
    onError: (error, newTodo, ctx) => {
      if (ctx?.prevTodos) {
        utils.todo.list.setData(undefined, ctx.prevTodos);
      }
    },
    onSuccess: (newTodo, _input) => {
      // Replace the temp one with the server one
      utils.todo.list.setData(undefined, (old) => {
        return old?.map((todo) => {
          if (todo.id === _input.id) {
            todo = newTodo;
          }

          return todo;
        });
      });
    },
  });

  const deleteTodoMutation = api.todo.delete.useMutation({
    onMutate: (todoToDelete) => {
      const prevTodos = utils.todo.list.getData();

      utils.todo.list.setData(undefined, (oldTodos) => {
        return oldTodos?.filter((todo) => todo.id !== todoToDelete.id);
      });

      setDeleteId(null);
      return { prevTodos };
    },
    onError: (error, newTodo, ctx) => {
      setDeleteId(null);
      if (ctx?.prevTodos) {
        utils.todo.list.setData(undefined, ctx.prevTodos);
      }
    },
  });

  if (isLoading || isRefetching || isFetching) {
    return (
      <div className="my-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (isLoadingError) {
    return (
      <div className="text-text-red-500 bg-white p-4">
        <p>Something went wrong while fetching todos</p>
      </div>
    );
  }

  const changeStatus = (todo: ITodo) => {
    updateTodoMutation.mutate({
      ...todo,
      isCompleted: !todo.isCompleted,
    });
  };

  return (
    <div className="my-4">
      <div className="mb-2 flex justify-end">
        <button
          className="rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-2 text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
          onClick={() => utils.todo.list.invalidate()}
          disabled={isRefetching || isFetching}
        >
          Refresh Todo list
        </button>
      </div>
      {updateTodoMutation.isError || deleteTodoMutation.isError ? (
        <p className="bg-amber-50 p-2 text-red-500">
          {updateTodoMutation.error?.message ??
            deleteTodoMutation.error?.message}
        </p>
      ) : null}
      <div className="max-h-[70vh] overflow-y-auto">
        <ul>
          {data?.map((todo) => (
            <li key={todo.id}>
              <div className="mb-2 grid grid-cols-4 place-content-center">
                <label className="col-span-2 flex items-center gap-2 rounded border p-2">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => changeStatus(todo)}
                  />
                  {editId === todo.id ? (
                    <input
                      type="text"
                      defaultValue={todo.title}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className={todo.isCompleted ? "line-through" : ""}>
                      {todo.title}
                    </span>
                  )}
                </label>

                <button
                  className="cursor-pointer rounded-full bg-red-500 text-white"
                  onClick={() => {
                    setDeleteId(todo.id);
                    deleteTodoMutation.mutate({ id: todo.id });
                  }}
                  disabled={deleteTodoMutation.isPending}
                >
                  {deleteTodoMutation.isPending && deleteId === todo.id
                    ? "Deleting...."
                    : "Delete"}
                </button>

                {editId === todo.id ? (
                  <button
                    className="cursor-pointer rounded-full bg-amber-400 text-black"
                    onClick={() => {
                      if (editId === todo.id) {
                        updateTodoMutation.mutate({
                          ...todo,
                          title: editTitle || todo.title,
                        });
                        setEditId(null);
                        setEditTitle("");
                      }
                    }}
                    disabled={updateTodoMutation.isPending}
                  >
                    {updateTodoMutation.isPending && editId === todo.id
                      ? "uploadthing..."
                      : "Update"}
                  </button>
                ) : (
                  <button
                    className="cursor-pointer rounded-full bg-amber-400 text-black"
                    onClick={() => setEditId(todo.id)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
