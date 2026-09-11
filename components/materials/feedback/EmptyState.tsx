import { FC } from 'react';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: FC<EmptyStateProps> = ({ emoji = '📝', title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      {message && <p className="text-gray-400 mb-6 max-w-md">{message}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-lg bg-purple-300 text-white hover:brightness-90 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
