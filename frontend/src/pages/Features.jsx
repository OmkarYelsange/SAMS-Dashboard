import Navbar from "../components/Navbar";

export default function Features() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      <section className="px-20 py-24">
        <h1 className="text-4xl font-bold mb-10">
          Everything you expect from SCADA
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          <Feature title="Live Monitoring" />
          <Feature title="Alarm Management" />
          <Feature title="Trends & Reports" />
          <Feature title="Simulation & Testing" />
        </div>
      </section>
    </div>
  );
}

function Feature({ title }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <p className="text-gray-400">
        Industrial-grade monitoring and alerting system.
      </p>
    </div>
  );
}
