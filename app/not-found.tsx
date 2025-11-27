import Link from "next/link";
// import { FaCarCrash } from "react-icons/fa"; // Make sure react-icons is installed, or use Lucide
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      {/* Icon / Illustration */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#6aa4e0]/20 rounded-full blur-2xl transform scale-150"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl border-4 border-white">
            <AlertTriangle size={64} className="text-[#fbd20b]" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Lost on the road?
      </h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
        The route or page you are looking for doesn't exist. It might have been moved or you may have mistyped the address.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-[#6aa4e0] hover:bg-[#5b91c9] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          Go to Homepage
        </Link>
        <Link
          href="/contact"
          className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 transition-all"
        >
          Contact Support
        </Link>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 text-gray-400 text-sm">
        BlazeCab &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}