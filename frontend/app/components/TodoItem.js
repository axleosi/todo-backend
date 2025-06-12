import React from 'react'
import styles from './TodoItem.module.css'

const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
    <div className={styles.todo}>
        <li className={styles.singleTodo}>
        <p>{todo.text}</p> 
        <p>{todo.completed ? '✅ Completed' : '❌ Not Completed'}</p>
        <button onClick={() => onToggle(todo)}>
          {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
        <button onClick={() => onDelete(todo.id)}>🗑</button>
      </li>
    </div>
      
    );
  };

export default TodoItem;