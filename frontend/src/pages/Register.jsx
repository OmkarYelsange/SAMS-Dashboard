import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
        role: "user",
      });

      toast.success("Account created successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* LEFT BRAND PANEL */}
      <div className="hidden md:flex w-1/2 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-900/20 blur-3xl" />

        <h1 className="text-5xl font-bold tracking-tight mb-4">SAMS</h1>
        <h2 className="text-xl text-cyan-400 mb-6 font-medium">
          Smart Abrasive Monitoring System
        </h2>

        <p className="text-gray-300 leading-relaxed max-w-md text-lg">
          Join the SAMS platform to access real-time machine health monitoring,
          historical insights, and intelligent safety alerts.
        </p>

        <div className="mt-10 text-gray-400 text-sm">
          Secure • Reliable • Industry-Ready
        </div>
      </div>

      {/* RIGHT REGISTER PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400 mb-8">Get started with SAMS monitoring</p>

          <div className="space-y-5">
            <input
              className="w-full p-4 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition"
              placeholder="Full name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full p-4 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full p-4 bg-gray-800 rounded-lg outline-none border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={register}
              className="w-full bg-cyan-600 hover:bg-cyan-700 active:scale-[0.98] transition-all p-4 rounded-lg font-semibold text-lg shadow-lg"
            >
              Create Account
            </button>
          </div>

          <p className="text-gray-400 text-sm mt-8 text-center">
            Already have an account?{" "}
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate("/login", { replace: true })}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
