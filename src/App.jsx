import { useEffect, useState } from "react";

const API = "http://localhost:8080";

function App() {
  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // GET TODOS
  // =========================

  async function getTodos() {
    try {
      setError("");

      const response = await fetch(`${API}/getTodos`);

      if (!response.ok) {
        throw new Error("Failed to get todos");
      }

      const data = await response.json();

      setTodos(data.todos || []);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  // =========================
  // ADD TODO
  // =========================

  async function addTodo(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const response = await fetch(`${API}/addTodo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add todo");
      }

      setTodos((currentTodos) => [
        ...currentTodos,
        data.todo,
      ]);

      setTitle("");
      setDescription("");

      setMessage("Todo added successfully ✅");
    } catch (error) {
      setError(error.message);
    }
  }

  // =========================
  // DELETE TODO
  // =========================

  async function deleteTodo(id) {
    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API}/deleteTodo/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete todo"
        );
      }

      setTodos((currentTodos) =>
        currentTodos.filter(
          (todo) => todo.ID !== id
        )
      );

      setMessage("Todo deleted successfully 🗑️");
    } catch (error) {
      setError(error.message);
    }
  }

  // =========================
  // START EDITING
  // =========================

  function startEdit(todo) {
    setEditingId(todo.ID);

    setTitle(todo.Title);
    setDescription(todo.Description);

    setMessage("");
    setError("");
  }

  // =========================
  // UPDATE TODO
  // =========================

  async function updateTodo(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API}/updateTodo/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update todo"
        );
      }

      // Update todo inside React state
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.ID === editingId
            ? data.todo
            : todo
        )
      );

      setTitle("");
      setDescription("");
      setEditingId(null);

      setMessage("Todo updated successfully ✏️");
    } catch (error) {
      setError(error.message);
    }
  }

  // =========================
  // CANCEL EDIT
  // =========================

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setMessage("");
    setError("");
  }

  return (
    <div className="container">

      <h1>Todo App</h1>

      {/* MESSAGE */}

      {message && (
        <div className="success">
          {message}
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={
          editingId !== null
            ? updateTodo
            : addTodo
        }
      >

        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        {editingId !== null ? (
          <div className="form-buttons">

            <button type="submit">
              Update Todo
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              className="cancel"
            >
              Cancel
            </button>

          </div>
        ) : (
          <button type="submit">
            Add Todo
          </button>
        )}

      </form>

      {/* TODOS */}

      <div className="todo-list">

        {todos.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
          todos.map((todo) => (

            <div
              className="todo"
              key={todo.ID}
            >

              <div>
                <h2>
                  {todo.Title}
                </h2>

                <p>
                  {todo.Description}
                </p>

                <small>
                  {todo.CreatedAt
                    ? new Date(
                        todo.CreatedAt
                      ).toLocaleString()
                    : ""}
                </small>
              </div>

              <div className="todo-actions">

                <button
                  onClick={() =>
                    startEdit(todo)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteTodo(todo.ID)
                  }
                  className="delete"
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default App;