// // import type { Metadata } from "next";
// // import { Geist, Geist_Mono } from "next/font/google";
// // import Script from "next/script";
// // import "./globals.css";

// // const geistSans = Geist({
// //   variable: "--font-geist-sans",
// //   subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });

// // export const metadata: Metadata = {
// //   title: "ReachAI",
// //   description: "AI-powered metadata optimization for YouTube creators",
// // };

// // export default function RootLayout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode;
// // }>) {
// //   return (
// //     <html lang="en">
// //       <head>
// //         {/* Razorpay checkout script */}
// //         <Script
// //           src="https://checkout.razorpay.com/v1/checkout.js"
// //           strategy="beforeInteractive"
// //         />
// //       </head>
// //       <body
// //         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
// //       >
// //         {children}
// //       </body>
// //     </html>
// //   );
// // }

// import "./globals.css";
// import Script from "next/script";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <Script
//           src="https://checkout.razorpay.com/v1/checkout.js"
//           strategy="beforeInteractive"
//         />
//       </head>

//       <body className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[160px]">
//         {children}
//       </body>

//     </html>
//   );
// }

import Navbar from "@/components/Navbar";
import "./globals.css";
import Script from "next/script";  // import Script may for razorpay
import { Toaster, toast } from 'sonner'   //notification
import Footer from "@/components/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth" lang="en">
      <body className="font-sans bg-white text-black">
        <Toaster richColors position="top-center" />
        <Navbar />
        {children}

        {/* Razorpay checkout script loading popup wala*/}
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js" 
          strategy="beforeInteractive"  
        />
         <Footer/>
      </body>
    </html>
  );
}


