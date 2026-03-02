import Navbar from "../components/Navbar";

export default function UseCases() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      <section className="px-20 py-24">
        <h1 className="text-4xl font-bold mb-10">Where SAMS fits</h1>

        <div className="space-y-8">
          <UseCase title="Grinding Machine Monitoring" />
          <UseCase title="CNC & Robotics Cells" />
          <UseCase title="Educational & Research Labs" />
        </div>
      </section>
    </div>
  );
}

function UseCase({ title }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-400">
        Real-time dashboards, alarms, and predictive insights.
      </p>
    </div>
  );
}
