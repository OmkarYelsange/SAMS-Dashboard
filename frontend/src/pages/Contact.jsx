import Navbar from "../components/Navbar";

export default function Contact() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      <section className="px-20 py-24 grid md:grid-cols-2 gap-12">
        <div className="bg-gray-900 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Request a Demo</h2>

          <input
            className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
            placeholder="Name"
          />
          <input
            className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
            placeholder="Email"
          />
          <textarea
            className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
            placeholder="Message"
          />

          <button className="bg-cyan-600 px-6 py-3 rounded-lg w-full">
            Send
          </button>
        </div>

        <div className="bg-gray-900 p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Why contact us?</h2>
          <p className="text-gray-400">
            We respond within 24 hours with demo credentials.
          </p>
        </div>
      </section>
    </div>
  );
}
