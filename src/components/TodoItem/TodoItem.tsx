import { useState } from 'react';
import type { Todo } from '../../types/types';
import './TodoItem.scss';
import { useTodos } from '../../context/useTodos';

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const { deleteTodo, toggleTodo, updateTodo } = useTodos();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [hovered, setHovered] = useState(false);

  const onSave = () => {
    updateTodo(todo.id, title);
    setEditing(false);
  };

  return (
    <div
      className="todo-item-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editing ? (
        <div className="todo-item-editing-block">
          <input
            className="todo-item-editing-input"
            value={title}
            autoFocus
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onSave();
              }
              if (e.key === 'Escape') {
                setEditing(false);
              }
            }}
          />
          <div className="todo-item-editing-btns">
            <button onClick={onSave}>Сохранить</button>
            <button onClick={() => setEditing(false)}>Отменить</button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-title">
            <span className="todo-title-text-span">ToDo:</span>
            <div
              className="todo-title-text"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {title.length > 20 ? (
                <>
                  <span className="truncated-text">{title}</span>
                  {hovered && <div className="tooltip">{title}</div>}
                </>
              ) : (
                title
              )}
            </div>
          </div>
          <div className="todo-completed">
            Статус{' '}
            <span className="todo-status-text">{todo.completed ? ' Завершенa' : ' Активная'}</span>
          </div>
          <div className="todo-item-btns">
            <button className="todo-status-btn" onClick={() => toggleTodo(todo.id)}>
              ✓
            </button>
            <button className="todo-edit-btn" onClick={() => setEditing(true)}>
              ✎
            </button>
            <button className="todo-del-btn" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  );
};
