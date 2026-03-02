import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-gray-950 text-white border-b border-gray-800">
      <h1 className="text-xl font-bold">SAMS</h1>

      <div className="flex gap-8 text-gray-300">
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/use-cases">Use Cases</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-4 py-2 border border-cyan-500 rounded-lg text-cyan-400"
        >
          Login
        </Link>

        <Link to="/dashboard" className="px-4 py-2 bg-cyan-600 rounded-lg">
          Try Demo
        </Link>
      </div>
    </nav>
  );
}
