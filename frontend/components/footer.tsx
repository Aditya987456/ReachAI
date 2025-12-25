"use client";
import { Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-14">
      <div className="max-w-[1440px] lg:px-28 mx-auto px-6">

        {/* Logo + short description */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          <div className="max-w-sm">
            
            <Link href="/">
              <h2 className="text-white font-semibold text-2xl mb-3 cursor-pointer">
                Reach<span className="text-red-600">AI</span>
              </h2>
            </Link>


            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              ReachAI analyzes your channel, finds what's trending in your niche,
              and generates SEO-optimized titles, description, tags & hashtags that boosts your YouTube growth.
            </p>
          </div>

         
          <div className="grid grid-cols-2 gap-10 text-sm">

            {/*------------- Pages */}
            <div>
              <h4 className="text-white font-extrabold mb-3">Pages</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer text-gray-400">
                  <Link href="/about">About</Link>
                </li>
                <li className="hover:text-white text-gray-400 cursor-pointer">
                  <Link href="/contact">Contact</Link>
                </li>
                <li className="hover:text-white cursor-pointer text-gray-400">
                  <Link href="/#how">How it Works</Link>
                </li>
                <li className="hover:text-white cursor-pointer text-gray-400">
                  <Link href="/#faq">FAQs</Link>
                </li>
              </ul>
            </div>

            {/* --- Legal page ---- */}
            <div>
              <h4 className="text-white font-extrabold mb-3 ">Legal</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer text-gray-400">
                  <Link href="/legal/terms">Terms of Service</Link>
                </li>
                <li className="hover:text-white cursor-pointer text-gray-400">
                  <Link href="/legal/privacy">Privacy Policy</Link>
                </li>
                <li className="hover:text-white cursor-pointer text-gray-400">
                  <Link href="/legal/refund">Refund Policy</Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-700 my-10"></div>

        {/* linkedin , x, email icons here */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-5 text-gray-400">
          
            <a
              href="https://www.linkedin.com/in/adityaraj2981/"
              target="_blank"
              rel="noopener noreferrer"
              >
              <Linkedin className="w-5 hover:text-white cursor-pointer" />
            </a>

            <a
              href="https://x.com/aadii_tw"
              target="_blank"
              rel="noopener noreferrer"
              >
              <Twitter className="w-5 hover:text-white cursor-pointer" />
            </a>

            <Link href="/contact">
            <Mail className="w-5 hover:text-white cursor-pointer" />
          </Link>


          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ReachAI · All rights reserved
          </p>
        </div>
      </div>

    </footer>
  );
}
