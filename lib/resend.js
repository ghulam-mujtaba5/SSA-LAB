import https from "https";

/**
 * Helper to send notification emails via Resend HTTP API
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.subject
 * @param {string} params.html
 * @param {string} [params.from]
 */
export async function sendEmail({ to, subject, html, from }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not defined. Email dispatch skipped.");
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  const sender = from || process.env.EMAIL_FROM || "SSA Research Lab <notifications@ssa-lab.tech>";
  const recipients = Array.isArray(to) ? to : [to];

  const payload = JSON.stringify({
    from: sender,
    to: recipients,
    subject: subject,
    html: html,
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.resend.com",
        path: "/emails",
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(body);
              resolve({ success: true, id: parsed.id });
            } catch {
              resolve({ success: true, response: body });
            }
          } else {
            console.error("Resend API Error:", res.statusCode, body);
            resolve({
              success: false,
              statusCode: res.statusCode,
              error: body,
            });
          }
        });
      }
    );

    req.on("error", (err) => {
      console.error("Resend Network Error:", err);
      resolve({ success: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Generate formatted HTML body for Enquiry notification
 */
export function buildEnquiryEmailHtml({ name, email, degree, enquiryType, topic, message, createdAt }) {
  const dateStr = createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
          .badge { display: inline-block; background: #0284c7; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; text-transform: uppercase; }
          .content { padding: 24px; }
          .field-group { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
          .field-group:last-child { border-bottom: none; }
          .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px; }
          .value { font-size: 15px; color: #0f172a; font-weight: 500; }
          .message-box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 14px; border-radius: 4px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
          .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          .reply-btn { display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SSA Research Lab</h1>
            <div class="badge">${enquiryType || 'General Enquiry'}</div>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="label">Sender Name</div>
              <div class="value">${name}</div>
            </div>
            <div class="field-group">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${email}" style="color:#0284c7; text-decoration:none;">${email}</a></div>
            </div>
            ${degree ? `
            <div class="field-group">
              <div class="label">Degree Programme / Organisation</div>
              <div class="value">${degree}</div>
            </div>` : ''}
            ${topic ? `
            <div class="field-group">
              <div class="label">Research Topic / Project Title</div>
              <div class="value">${topic}</div>
            </div>` : ''}
            <div class="field-group">
              <div class="label">Submission Date</div>
              <div class="value">${dateStr}</div>
            </div>
            <div class="field-group">
              <div class="label">Message Details</div>
              <div class="message-box">${message}</div>
            </div>
            <div style="text-align: center;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(topic || enquiryType || 'SSA Lab Enquiry')}" class="reply-btn">Reply to ${name}</a>
            </div>
          </div>
          <div class="footer">
            Software Security Assessment (SSA) Research Lab · COMSATS University Islamabad
          </div>
        </div>
      </body>
    </html>
  `;
}
