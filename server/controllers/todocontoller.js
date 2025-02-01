import { createError } from "../utils/error.js";
import { connectToDB } from "../utils/connect.js";
import Todo from "../models/todo.model.js";

// Ensure that req.user is set by an authentication middleware (JWT or session-based)

export async function addTodo(req, res, next) {
  console.log(req.body);

  // Check if the title and userId are provided
  if (!req.body || !req.body.title) {
    return next(createError(400, "Title is required!"));  // Change to 400, bad request
  }

  // Check if req.user exists (this is typically set by an auth middleware)
  if (!req.user || !req.user.id) {
    return next(createError(401, "User is not authenticated!"));  // 401 for authentication failure
  }

  try {
    await connectToDB();

    // Create a new Todo, associating it with the authenticated user
    const newTodo = new Todo({ 
      title: req.body.title, 
      userId: req.user.id  // Use userId (consistent with your model)
    });

    // Save the new Todo in the database
    await newTodo.save();

    // Respond with the created todo
    res.status(201).json(newTodo);

  } catch (err) {
    console.error("Error in addTodo:", err);  // Log the error for debugging
    next(createError(500, "Failed to add todo"));  // Internal server error
  }
}

// Get all todos
export async function getAllTodos(req, res, next) {
  try {
    await connectToDB();
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    next(createError(500, "Failed to fetch todos"));
  }
}

// Get a single todo by ID
export async function getTodo(req, res, next) {
  try {
    await connectToDB();
    const todo = await Todo.findById(req.params.id);
    if (!todo) return next(createError(404, "Todo not found"));
    res.status(200).json(todo);
  } catch (err) {
    next(createError(500, "Failed to fetch todo"));
  }
}

// Update a todo by ID
export async function updateTodo(req, res, next) {
  try {
    await connectToDB();
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTodo) return next(createError(404, "Todo not found"));
    res.status(200).json({ message: "Todo updated", todo: updatedTodo });
  } catch (err) {
    next(createError(500, "Failed to update todo"));
  }
}

// Delete a todo by ID
export async function deleteTodo(req, res, next) {
  try {
    await connectToDB();
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return next(createError(404, "Todo not found"));
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    next(createError(500, "Failed to delete todo"));
  }
}
