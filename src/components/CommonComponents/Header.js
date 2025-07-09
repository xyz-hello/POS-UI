import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Header({ onLogout }) {
  return (
    <header className="flex items-center justify-between bg-white p-6 shadow-md border-b border-gray-200">
      <h1 className="text-2xl font-bold text-indigo-600 tracking-wide">
        Dashboard
      </h1>

      <button
        onClick={onLogout}
        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        aria-label="Logout"
        title="Logout"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        <span className="font-medium">Logout</span>
      </button>
    </header>
  );
}
