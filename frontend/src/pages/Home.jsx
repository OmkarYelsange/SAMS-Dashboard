import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      <section className="px-20 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-6">
            SAMS – SCADA for Smart Grinding Machines
          </h1>
          <p className="text-gray-400 mb-8">
            Monitor temperature, vibration, RPM, and coolant health in real-time
            with predictive maintenance alerts.
          </p>

          <div className="flex gap-4">
            <button className="bg-cyan-600 px-6 py-3 rounded-lg">
              Try Live Demo
            </button>
            <button className="border border-cyan-600 px-6 py-3 rounded-lg text-cyan-400">
              Download Brochure
            </button>
          </div>
        </div>

        <div className="bg-gray-900 h-[350px] rounded-2xl flex items-center justify-center text-gray-500">
          SCADA Preview Panel
        </div>
      </section>
    </div>
  );
}
