import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCheckCircle,
  FaTrash,
  FaPlus,
  FaEdit,
  FaSave,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/todos.css";

const API_URL = "http://localhost:3000/api/todos"; // Backend API URL

const Todos = ({ onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch todos from backend
  useEffect(() => {
    fetch(API_URL, {
      method: "GET",
      credentials: "include", // ✅ Ensures token (cookie) is sent
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to fetch todos");
        }
        return res.json();
      })
      .then((data) => setTodos(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching todos:", err);
        toast.error(err.message || "Error fetching todos");
      });
  }, []);

  // Add a new todo
  const addTodo = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `New Task ${todos.length + 1}` }),
    });

    if (res.ok) {
      const savedTodo = await res.json();
      setTodos([...todos, savedTodo]);
      toast.success("Todo added!");
    } else {
      toast.error("Failed to add todo");
    }
  };

  // Toggle complete status
  const toggleComplete = async (id, completed) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !completed }),
    });

    if (res.ok) {
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !completed } : todo
        )
      );
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.error("Todo deleted!");
    } else {
      toast.error("Failed to delete todo");
    }
  };

  // Start editing
  const startEditing = (id, title) => {
    setEditId(id);
    setEditText(title);
  };

  // Save edited todo
  const saveEdit = async (id) => {
    if (!editText.trim()) {
      toast.error("Todo title cannot be empty!");
      return;
    }

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editText }),
    });

    if (res.ok) {
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, title: editText } : todo
        )
      );
      setEditId(null);
      setEditText("");
      toast.success("Todo updated successfully!");
    } else {
      toast.error("Failed to update todo!");
    }
  };

  // Logout function
  const handleLogout = async () => {
    const res = await fetch("http://localhost:3000/api/user/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else {
      toast.error("Failed to log out!");
    }
  };

  return (
    <div className="todo-container">
      <div className="header">
        <h2>Todo List</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
      <button className="add-btn" onClick={addTodo}>
        <FaPlus /> Add Todo
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.isCompleted ? "completed" : ""}>
            <div className="todo-content">
              <FaCheckCircle
                className="check-icon"
                color={todo.isCompleted ? "green" : "gray"}
                onClick={() => toggleComplete(todo._id, todo.isCompleted)}
              />
              {editId === todo._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{todo.title}</span>
              )}
            </div>
            <div className="todo-actions">
              {editId === todo._id ? (
                <FaSave
                  className="save-icon"
                  onClick={() => saveEdit(todo._id)}
                />
              ) : (
                <FaEdit
                  className="edit-icon"
                  onClick={() => startEditing(todo._id, todo.title)}
                />
              )}
              <FaTrash
                className="trash-icon"
                onClick={() => deleteTodo(todo._id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
