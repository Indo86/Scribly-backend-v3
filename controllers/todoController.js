import Todo from "../models/todo.js";

export const getTodos = async (req, res) => {
  try {
  const todos = await Todo.findAll({ where: { userId: req.userId } }); 
  res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single todo
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      text: req.body.text,
      completed: false,
      userId: req.userId, 
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update a todo
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    await todo.update(req.body);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    await todo.destroy();
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

