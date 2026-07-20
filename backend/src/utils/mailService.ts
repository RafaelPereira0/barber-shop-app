import { Resend } from 'resend';

export async function sendResetPasswordEmail(toEmail: string, token: string) {

  const resend = new Resend(process.env.RESEND_API)
  const resetLink = `http://localhost:5173/reset-password?token=${token}`
  
  try {
    const data = await resend.emails.send({
      from: 'BarberApp <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Redefinição de Senha - BarberApp',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
          <h2 style="color: #ff9000;">Esqueceu sua senha?</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>BarberApp</strong>.</p>
          <p>Clique no botão abaixo para escolher uma nova senha (este link expira em 1 hora):</p>
          <a href="${resetLink}" style="background-color: #ff9000; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-top: 10px;">
            Redefinir Minha Senha
          </a>
          <p style="margin-top: 25px; font-size: 12px; color: #777;">Se você não solicitou essa alteração, ignore este e-mail.</p>
        </div>
      `,
    });

    console.log('E-mail enviado com sucesso via Resend:', data);
  } catch (error) {
    console.error('Erro ao enviar e-mail via Resend:', error);
    throw new Error('Falha ao enviar e-mail de recuperação.');
  }
}