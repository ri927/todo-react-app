import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        dueDate: dueDate || null
      }
    ])
    setInputValue('')
    setDueDate('')
  }

  const isOverdue = (dueDateStr) => {
    if (!dueDateStr) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDateStr)
    return due < today
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="app">
      <h1>TODO</h1>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="todo-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="todo-date"
        />
        <button type="submit" className="add-button">追加</button>
      </form>

      <div className="todo-stats">
        {todos.length > 0 && (
          <span>{completedCount} / {todos.length} 完了</span>
        )}
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${!todo.completed && isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              {todo.dueDate && (
                <span className="todo-due-date">{formatDate(todo.dueDate)}</span>
              )}
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="empty-message">タスクがありません</p>
      )}
    </div>
  )
}

export default App
