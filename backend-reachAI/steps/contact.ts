// import { ApiRouteConfig } from "motia";
// //import { Resend } from "resend";

// export const config: ApiRouteConfig = {
//   name: "ContactForm",
//   type: "api",
//   path: "/api/contact",
//   method: "POST",
//   rateLimit: "5/min",
// };





// export const handler = async (req:any, { logger }:any) => {
//   try {
//     const { name, email, message } = req.body;

//     if (!name || !email || !message) {
//       throw new Error("Missing fields");
//     }

//     const resend = new Resend(process.env.RESEND_API_KEY);

//     await resend.emails.send({
//       from: "ReachAI <no-reply@reachaiapp.online>",
//       to: "adityarajxdev@gmail.com",
//       subject: "New Contact Message",
//       html: `
//         <h3>New support message</h3>
//         <p><b>Name:</b> ${name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Message:</b></p>
//         <p>${message}</p>
//       `,
//     });

//     return { ok: true };


//   }catch (err) {

//     logger.error("Contact form error", { error: err.message });
    
//     return { ok: false, error: err.message };
//   }
// };
