export const getTodos = () => {
    const todos = localStorage.getItem("todos");
    return todos ? JSON.parse(todos) : [];
  };
  
  export const saveTodos = (todos: Todo.Record[]) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  