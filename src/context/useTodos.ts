import { useContext } from 'react';
import { TodoContext } from './TodoContext';

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return ctx;
}
