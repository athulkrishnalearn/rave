require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: ['test@example.com'],
    subject: 'Test',
    html: '<p>Test</p>'
  });

  console.log('Data:', data);
  console.log('Error:', error);
}

test();
