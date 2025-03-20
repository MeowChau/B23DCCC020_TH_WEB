import { getTodos, saveTodos } from "@/services/todo";
import { useState } from "react";

export default () => {
  const [data, setData] = useState<Todo.Record[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<Todo.Record | null>(null);

  const getDataTodos = () => {
    const todos = getTodos();
    setData(todos);
  };

  const addOrEditTodo = (todo: Todo.Record) => {
    const todos = getTodos();
    if (isEdit) {
      const index = todos.findIndex((item) => item.id === row?.id);
      todos[index] = todo;
    } else {
      todos.unshift({ ...todo, id: Date.now() });
    }
    saveTodos(todos);
    getDataTodos();
    setVisible(false);
  };

  const deleteTodo = (id: number) => {
    const todos = getTodos().filter((todo) => todo.id !== id);
    saveTodos(todos);
    getDataTodos();
  };

  return {
    data,
    visible,
    setVisible,
    row,
    setRow,
    isEdit,
    setIsEdit,
    addOrEditTodo,
    deleteTodo,
    getDataTodos,
  };
};
