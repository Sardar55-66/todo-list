/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Todo } from '../types/types';

type State = {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
};

type Action =
  | { type: 'ADD'; payload: Todo }
  | { type: 'DELETE'; payload: string }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'FILTER'; payload: 'all' | 'active' | 'completed' }
  | { type: 'UPDATE'; payload: { id: string; title: string } }
  | { type: 'SET'; payload: Todo[] };

const initialState: State = {
  todos: [],
  filter: 'all',
};

function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return { ...state, todos: [...state.todos, action.payload] };

    case 'DELETE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };

    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };

    case 'UPDATE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.id ? { ...t, title: action.payload.title } : t
        ),
      };

    case 'FILTER':
      return { ...state, filter: action.payload };

    case 'SET':
      return { ...state, todos: action.payload };

    default:
      return state;
  }
}

type ContextValue = {
  todos: Todo[];
  visibleTodos: Todo[];
  filter: 'all' | 'active' | 'completed';
  addTodo: (title: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
  setTodos: (todos: Todo[]) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
};

export const TodoContext = createContext<ContextValue | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState, (): State => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const todos: Todo[] = JSON.parse(saved);
        return { todos, filter: 'all' }; // <-- теперь filter строго типизирован
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.todos));
  }, [state.todos]);

  const addTodo = useCallback((title: string) => {
    if (!title.trim()) return;
    const newTodo: Todo = { id: Date.now().toString(), title: title.trim(), completed: false };
    dispatch({ type: 'ADD', payload: newTodo });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE', payload: id });
  }, []);

  const updateTodo = useCallback((id: string, title: string) => {
    dispatch({ type: 'UPDATE', payload: { id, title } });
  }, []);

  const setTodos = useCallback((todos: Todo[]) => {
    dispatch({ type: 'SET', payload: todos });
  }, []);

  const setFilter = useCallback((filter: 'all' | 'active' | 'completed') => {
    dispatch({ type: 'FILTER', payload: filter });
  }, []);

  const visibleTodos = useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(t => !t.completed);
      case 'completed':
        return state.todos.filter(t => t.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filter]);

  const value = useMemo(
    () => ({
      todos: state.todos,
      visibleTodos,
      filter: state.filter,
      addTodo,
      deleteTodo,
      toggleTodo,
      updateTodo,
      setTodos,
      setFilter,
    }),
    [
      state.todos,
      visibleTodos,
      state.filter,
      addTodo,
      deleteTodo,
      toggleTodo,
      updateTodo,
      setTodos,
      setFilter,
    ]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
