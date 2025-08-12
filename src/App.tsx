import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SendThought from "./pages/SendThought";

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl h-14 flex items-center justify-between px-4">
          <Link to="/signup" className="font-semibold text-gray-900">OnMyMind</Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 ${pathname.startsWith("/signup") ? "bg-gray-100" : ""}`}
              to="/signup"
            >
              Sign Up
            </Link>
            <Link
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 ${pathname.startsWith("/thought") ? "bg-gray-100" : ""}`}
              to="/thought/new"
            >
              Send a Thought
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/thought/new" element={<SendThought />} />
          <Route path="*" element={<div className="text-center text-gray-500">Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}
