import { useState } from 'react';
import './TodoForm.scss';
import { TodoList } from '../TodoList/TodoList';
import { useTodos } from '../../context/useTodos';

export const TodoForm = () => {
  const [title, setTitle] = useState<string>('');

  const { addTodo, setFilter, visibleTodos } = useTodos();

  const handleAdd = () => {
    addTodo(title);
    setTitle('');
  };

  return (
    <div className="todo-form-container">
      <div className="todo-form-wrapper">
        <input
          className="todo-form-input"
          type="text"
          placeholder="Добавить новую таску"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
        />
        <button className="todo-form-button" onClick={handleAdd}>
          Добавить
        </button>
      </div>
      <div className="todo-list-filter-btn">
        <button onClick={() => setFilter('all')}>Все</button>
        <button onClick={() => setFilter('active')}>Активные</button>
        <button onClick={() => setFilter('completed')}>Завершенные</button>
      </div>
      {visibleTodos.length > 0 && <TodoList />}
    </div>
  );
};
