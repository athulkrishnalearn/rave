import { Resend } from 'resend';

// Lazy init resend to prevent build-time crashes when API key is missing during static analysis
let resend: Resend | null = null;

function getResend() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

// We are using the verified domain auth.rave.works to send emails across all environments.
const FROM_EMAIL = 'security@auth.rave.works';

export async function sendVerificationEmail(toEmail: string, code: string) {
    const resendClient = getResend();

    if (!resendClient || !process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set or client init failed. Simulating email send.');
        console.log(`[SIMULATED EMAIL] To: ${toEmail} | OTP: ${code}`);
        return { success: true };
    }

    try {
        console.log(`\n=======================================\n[AUTH] Sending OTP: ${code} to ${toEmail}\n=======================================\n`);
        const data = await resendClient.emails.send({
            from: `RAVE Works Security <${FROM_EMAIL}>`,
            to: [toEmail],
            subject: 'Verify your RAVE Works Account',
            html: `
                <div style="font-family: system-ui, -apple-system, sans-serif; padding: 40px 20px; background-color: #000000; text-align: center; color: #ffffff;">
                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-white.png" alt="RAVE" style="width: 50px; height: 50px; margin-bottom: 16px; object-fit: contain;" />
                    <h1 style="color: #ffffff; font-size: 24px; text-transform: uppercase; font-weight: 900; margin: 0; letter-spacing: 1px;">RAVE</h1>
                    <p style="color: #a1a1aa; margin-top: 12px; font-size: 14px; max-width: 400px; margin-left: auto; margin-right: auto;">Please use the following 6-digit code to securely verify your email address.</p>
                    <div style="margin: 32px auto; padding: 16px 32px; background-color: #111111; color: #ffffff; font-size: 36px; font-weight: 900; letter-spacing: 8px; border-radius: 12px; width: max-content; border: 1px solid #333333;">
                        ${code}
                    </div>
                    <p style="color: #52525b; font-size: 12px; margin-top: 40px;">This code will expire in 15 minutes.<br>If you did not request this, please ignore this email.</p>
                </div>
            `,
        });

        if (data.error) {
            console.error('\n[RESEND API ERROR]:', data.error.message);
            console.warn('NOTE: On the Resend free tier, you can ONLY send emails to your own verified email address. To send to anyone else, verify a domain in the Resend dashboard.\n');
        }

        return { success: !data.error, data };
    } catch (error: any) {
        console.error('Resend Exception:', error);
        return { success: false, error };
    }
}
