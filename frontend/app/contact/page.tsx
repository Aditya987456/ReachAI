"use client";

import { useState } from "react";
import { toast } from "sonner";
export default function ContactSection() {

  const [loading, setLoading]=useState(false)

  const handleSubmit = async (e:any)=>{

    e.preventDefault();
    setLoading(true)

    const form = new FormData(e.target)

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
        })
      });

      const data = await response.json();
      setLoading(false)

      if (!data.success) {
        toast.success('Your message has been sent!')
        e.target.reset(); //##### clean things...

      } else {
        toast.error("Failed to send message. Try again.");
      }


      
      

    } catch (error) {
    // agar network error req hi nahi gaya
    setLoading(false);
    toast.error("Something went wrong. Please try again.");
    console.error("Contact form error:", error);
  }
}

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
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />

          <textarea
            placeholder="Your Message"
            name="message"
            required
            rows={6}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-semibold text-lg py-3 rounded-xl hover:bg-red-700 transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

       

      </div>
    </section>
  );
}



