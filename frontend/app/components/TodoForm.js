import React from 'react'
import styles from './TodoForm.module.css'

const TodoForm = ({ newTodoText, setNewTodoText, handleAddTodo }) => {
    return (
      <div className={styles.todoForm}>
        <input
          type="text"
          value={newTodoText}
          placeholder="Create a new todo..."
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    );
  };
  
  export default TodoForm;