export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone and message are required",
      });
    }

    let cleanPhone = String(phone).replace(/\D/g, "");

    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !from) {
      return res.status(500).json({
        success: false,
        error: "Missing Twilio environment variables",
      });
    }

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const body = new URLSearchParams({
      From: from,
      To: `whatsapp:+${cleanPhone}`,
      Body: message,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: "Twilio WhatsApp failed",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "WhatsApp message sent via Twilio",
      sid: data.sid,
      status: data.status,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
}
