"use client";

import { useState } from "react";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="w-full bg-gray-50 py-24 px-6 lg:px-40 border-t">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Get in <span className="text-red-600">Touch</span>
        </h2>

        <p className="text-center text-gray-700 mb-10">
          Have a question, feature suggestion, or need support? 
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-6"
        >
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />

          <textarea
            placeholder="Your Message"
            required
            rows={6}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold text-lg py-3 rounded-xl hover:bg-red-700 transition"
          >
            Send Message
          </button>
        </form>

        {sent && (
          <p className="text-center mt-6 text-green-600 font-semibold animate-pulse">
            Message received! We’ll get back to you soon. 😊
          </p>
        )}
      </div>
    </section>
  );
}
