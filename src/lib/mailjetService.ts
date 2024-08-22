import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET
});

export async function sendEmail(to: string, subject: string, content: string) {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
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
          TextPart: content
        }
      ]
    });
    console.log('Email sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}