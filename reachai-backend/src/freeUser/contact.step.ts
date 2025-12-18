import { ApiRouteConfig } from "motia";
//import { Resend } from "resend";

export const config: ApiRouteConfig = {
  name: "ContactForm",
  emits: [],
  type: "api",
  path: "/api/contact",
  method: "POST",
};




export const handler = async (req:any, { logger }:any) => {
  try {

    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const message = (req.body.message || "").trim();

    if (!name || !email || !message) {

        return {
            status: 400,
            body:{
                sucesss: false,
                error: "All fields are required"
            }}
        }


    // SENDING EMAIL TO YOU (ADMIN)
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_SUPPORTEMAIL ,
        to: process.env.MERA_EMAIL ,  // sending message to my email -- 
        reply_to: email,
        subject: "New Contact Form Message",
        html: `
          <h3>New Support Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      }),
    });

     if (!resendRes.ok) {
      console.error(await resendRes.text());
      return Response.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });


  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
};
