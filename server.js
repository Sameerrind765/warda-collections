export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const { to, subject, message } = body;

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_RESEND_API_KEY",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Warda Collections <info@wardacollections.com>",
          to,
          subject,
          html: `<p>${message}</p>`
        })
      });

      const data = await emailResponse.json();

      if (emailResponse.ok) {
        return new Response(
          JSON.stringify({ success: true, id: data.id }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: data.error }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
