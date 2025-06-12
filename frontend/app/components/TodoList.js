import React from 'react'
import TodoItem from './TodoItem';
import styles from './TodoList.module.css'

const TodoList = ({ todos, filter, setFilter, onToggle, onDelete }) => {
    const filteredTodos = todos.filter((todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'uncompleted') return !todo.completed;
      return true;
    });
  
    return (
      <div>
        {filteredTodos.length > 0 ? (
          <ul>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        ) : (
          <p>No todos found.</p>
        )}

        <div className={styles.filter}>
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
          <button onClick={() => setFilter('uncompleted')}>Uncompleted</button>
        </div>
      </div>
    );
  };
  
  export default TodoList;