const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  const { payload } = JSON.parse(event.body);
  const { data, form_name } = payload;

  const isRussian = form_name === "founder-application-ru";

  const name = data.name || "Unknown";
  const email = data.email || "";
  const startup = data["startup-name"] || "N/A";
  const oneLiner = data["one-liner"] || "";
  const sector = data.sector || "";
  const stage = data.stage || "";
  const teamSize = data["team-size"] || "";
  const fulltime = data.fulltime || "";
  const problem = data.problem || "";
  const solution = data.solution || "";
  const raising = data.raising || "";
  const deck = data.deck || "";
  const phone = data.phone || "";
  const linkedin = data.linkedin || "";
  const anythingElse = data["anything-else"] || "";

  // --- SMTP Transport (Gmail) ---
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // --- 1. Email Notification to David ---
  const notificationHtml = `
    <h2>New Founder Application: ${startup}</h2>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;width:180px;">Name</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${phone || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">LinkedIn</td><td style="padding:8px;border:1px solid #ddd;">${linkedin ? `<a href="${linkedin}">${linkedin}</a>` : "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Startup</td><td style="padding:8px;border:1px solid #ddd;"><strong>${startup}</strong></td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">One-liner</td><td style="padding:8px;border:1px solid #ddd;">${oneLiner}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Sector</td><td style="padding:8px;border:1px solid #ddd;">${sector}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Stage</td><td style="padding:8px;border:1px solid #ddd;">${stage}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Team Size</td><td style="padding:8px;border:1px solid #ddd;">${teamSize || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Full-time</td><td style="padding:8px;border:1px solid #ddd;">${fulltime}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Problem</td><td style="padding:8px;border:1px solid #ddd;">${problem}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Solution</td><td style="padding:8px;border:1px solid #ddd;">${solution || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Raising</td><td style="padding:8px;border:1px solid #ddd;">${raising || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Pitch Deck</td><td style="padding:8px;border:1px solid #ddd;">${deck ? `<a href="${deck}">${deck}</a>` : "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Other</td><td style="padding:8px;border:1px solid #ddd;">${anythingElse || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Form</td><td style="padding:8px;border:1px solid #ddd;">${form_name} (${isRussian ? "Russian" : "English"})</td></tr>
    </table>
    <p style="margin-top:16px;font-size:12px;color:#888;">Submitted via creata.ventures/apply</p>
  `;

  // --- 2. Auto-reply to Applicant ---
  const autoReplyHtml = isRussian
    ? `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a365d;padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;">Creata Ventures</h1>
      </div>
      <div style="padding:24px;background:#f9fafb;">
        <p>Здравствуйте, ${name}!</p>
        <p>Благодарим вас за интерес к Creata Ventures и подачу заявки по проекту <strong>${startup}</strong>.</p>
        <p>Мы получили вашу заявку и рассмотрим её в течение <strong>5-7 рабочих дней</strong>. Если ваш проект соответствует нашему инвестиционному тезису, мы свяжемся с вами для организации вводного звонка.</p>
        <p>Если у вас есть вопросы, не стесняйтесь писать на <a href="mailto:david@creata.team">david@creata.team</a>.</p>
        <p>С уважением,<br><strong>Команда Creata Ventures</strong></p>
      </div>
      <div style="padding:16px;text-align:center;font-size:12px;color:#888;">
        <p>Creata Ventures Studio Ltd | AIFC, Astana, Kazakhstan</p>
        <p><a href="https://creata.ventures">creata.ventures</a></p>
      </div>
    </div>`
    : `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a365d;padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;">Creata Ventures</h1>
      </div>
      <div style="padding:24px;background:#f9fafb;">
        <p>Dear ${name},</p>
        <p>Thank you for your interest in Creata Ventures and for submitting your application for <strong>${startup}</strong>.</p>
        <p>We have received your application and will review it within <strong>5-7 business days</strong>. If your project aligns with our investment thesis, we will reach out to schedule an introductory call.</p>
        <p>If you have any questions, feel free to reach out at <a href="mailto:david@creata.team">david@creata.team</a>.</p>
        <p>Best regards,<br><strong>Creata Ventures Team</strong></p>
      </div>
      <div style="padding:16px;text-align:center;font-size:12px;color:#888;">
        <p>Creata Ventures Studio Ltd | AIFC, Astana, Kazakhstan</p>
        <p><a href="https://creata.ventures">creata.ventures</a></p>
      </div>
    </div>`;

  // --- 3. Telegram Notification ---
  const telegramText =
    `📋 *New Application: ${startup}*\n\n` +
    `👤 ${name}\n` +
    `📧 ${email}\n` +
    `📞 ${phone || "—"}\n` +
    `🏷 ${sector} | ${stage}\n` +
    `👥 Team: ${teamSize || "—"} | Full-time: ${fulltime}\n` +
    `💰 Raising: ${raising || "—"}\n\n` +
    `📝 _${oneLiner}_\n\n` +
    `🔗 ${deck || "No deck"}\n` +
    `🌐 ${form_name}`;

  const results = { email_notify: null, auto_reply: null, telegram: null };

  // Send email notification to David
  try {
    await transporter.sendMail({
      from: `"Creata Ventures" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || "david@creata.team",
      subject: `[Creata Apply] ${startup} — ${name}`,
      html: notificationHtml,
    });
    results.email_notify = "sent";
  } catch (err) {
    results.email_notify = `error: ${err.message}`;
    console.error("Email notification error:", err);
  }

  // Send auto-reply to applicant
  if (email) {
    try {
      await transporter.sendMail({
        from: `"Creata Ventures" <${process.env.SMTP_USER}>`,
        to: email,
        subject: isRussian
          ? "Creata Ventures — Заявка получена"
          : "Creata Ventures — Application Received",
        html: autoReplyHtml,
      });
      results.auto_reply = "sent";
    } catch (err) {
      results.auto_reply = `error: ${err.message}`;
      console.error("Auto-reply error:", err);
    }
  }

  // Send Telegram notification
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const resp = await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      });
      const tgResult = await resp.json();
      results.telegram = tgResult.ok ? "sent" : `error: ${tgResult.description}`;
    } catch (err) {
      results.telegram = `error: ${err.message}`;
      console.error("Telegram error:", err);
    }
  } else {
    results.telegram = "skipped (no token/chat_id)";
  }

  console.log("Submission processed:", { startup, name, results });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Processed", results }),
  };
};
