import { TodoItem } from '../TodoItem/TodoItem';
import { motion, AnimatePresence } from 'framer-motion';
import './TodoList.scss';
import { useTodos } from '../../context/useTodos';

export const TodoList = () => {
  const { visibleTodos } = useTodos();

  return (
    <div className="todo-list-wrapper">
      <div className="todo-list-container">
        <AnimatePresence>
          {visibleTodos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TodoItem key={todo.id} todo={todo} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
