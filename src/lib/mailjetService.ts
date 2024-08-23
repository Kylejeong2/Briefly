import fetch from 'node-fetch';

const MJ_APIKEY_PUBLIC = process.env.MAILJET_API_KEY;
const MJ_APIKEY_PRIVATE = process.env.MAILJET_API_SECRET;

export async function sendEmail(to: string, subject: string, content: string) {
  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${MJ_APIKEY_PUBLIC}:${MJ_APIKEY_PRIVATE}`).toString('base64')}`
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: "Kylejeong@g.ucla.edu",
              Name: "Briefly"
            },
            To: [
              {
                Email: to
              }
            ],
            Subject: subject,
            TextPart: "Briefly",
            HTMLPart: content
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Email sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}