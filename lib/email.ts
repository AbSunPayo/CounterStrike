
import nodemailer from 'nodemailer';

// Configuração do transporter usando Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para outros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

export interface AlertEmail {
  to: string;
  skinNome: string;
  precoAtual: number;
  precoAlvo: number;
  skinLink: string;
  skinImagemUrl?: string;
}

export async function enviarEmailAlerta(dados: AlertEmail) {
  const { to, skinNome, precoAtual, precoAlvo, skinLink, skinImagemUrl } = dados;

  const mailOptions = {
    from: `"CS2 Skin Monitor" <${process.env.EMAIL_USER || 'noreply@cs2monitor.com'}>`,
    to,
    subject: `🎯 Alerta de Preço: ${skinNome}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e2337 0%, #0f1419 100%); border-radius: 12px; padding: 30px; border: 1px solid #ff6b35; }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ff6b35; }
          .header h1 { color: #ff6b35; margin: 0; font-size: 28px; }
          .content { padding: 30px 0; }
          .skin-info { background: rgba(255,107,53,0.1); border-left: 4px solid #ff6b35; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .price { font-size: 32px; font-weight: bold; color: #4ade80; margin: 10px 0; }
          .target-price { font-size: 18px; color: #ff6b35; }
          .button { display: inline-block; background: #ff6b35; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
          .footer { text-align: center; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Alerta de Preço Atingido!</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px;">Boa notícia! O preço da sua skin monitorada atingiu o valor alvo:</p>
            
            <div class="skin-info">
              <h2 style="margin: 0 0 10px 0; color: #ff6b35;">${skinNome}</h2>
              ${skinImagemUrl ? `<img src="${skinImagemUrl}" alt="${skinNome}" style="max-width: 100%; height: auto; border-radius: 4px; margin: 10px 0;" />` : ''}
              <p style="margin: 10px 0;"><strong>Preço Atual:</strong></p>
              <div class="price">R$ ${precoAtual.toFixed(2)}</div>
              <p class="target-price">Seu preço alvo era: R$ ${precoAlvo.toFixed(2)}</p>
            </div>

            <p>Não perca essa oportunidade! Confira agora no Steam Market:</p>
            <a href="${skinLink}" class="button">Ver no Steam Market</a>
          </div>
          <div class="footer">
            <p>Este é um alerta automático do CS2 Skin Monitor</p>
            <p>Você está recebendo este email porque configurou um alerta de preço</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado com sucesso para ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error };
  }
}
