import {
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-14 mt-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* Logo + short description */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          <div className="max-w-sm">
            <h2 className="text-white font-semibold text-2xl mb-3">
              Reach<span className="text-red-600">AI</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
             ReachAI analyzes your channel, finds what's trending in your niche, and generates SEO-optimized metadata that boosts your YouTube growth.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 text-sm">

            {/* Pages */}
            <div>
              <h4 className="text-white font-medium mb-3">Pages</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer">About</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
                <li className="hover:text-white cursor-pointer">How it Works</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-medium mb-3">Legal</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Refund Policy</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Social + copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-5 text-gray-400">
            <Linkedin className="w-5 hover:text-white cursor-pointer" />
            <Twitter className="w-5 hover:text-white cursor-pointer" />
            <Mail className="w-5 hover:text-white cursor-pointer" />
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ReachAI · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
