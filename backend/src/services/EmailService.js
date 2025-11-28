const nodemailer = require('nodemailer');
class EmailService {
  constructor() {
    // In test environment, skip creating a real transporter to avoid network calls and logs
    if (process.env.NODE_ENV === 'test') {
      this.transporter = {
        verify: () => {},
        sendMail: async () => ({ messageId: 'test-message-id' })
      };
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Error en configuración de email:', error.message);
        } else {
          console.log('✅ Servidor de email listo para enviar mensajes');
        }
      });
    }
  }
  async sendWelcomeEmail(email, firstName) {
    try {
      const mailOptions = {
        from: `"NeuroBreak" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🎉 ¡Bienvenido a NeuroBreak!',
        html: this.getWelcomeTemplate(firstName)
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de bienvenida enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar email de bienvenida:', error);
      throw error;
    }
  }
  getWelcomeTemplate(firstName) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #1c3b4e 0%, #2a5468 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0 0 10px 0;
            font-size: 32px;
          }
          .header p {
            color: #93bdcc;
            margin: 0;
            font-size: 16px;
          }
          .emoji-large {
            font-size: 60px;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #1c3b4e;
            margin-top: 0;
          }
          .content p {
            color: #333333;
            line-height: 1.6;
            font-size: 16px;
          }
          .features {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          .feature-item:last-child {
            margin-bottom: 0;
          }
          .feature-icon {
            font-size: 24px;
            margin-right: 12px;
            flex-shrink: 0;
          }
          .feature-text {
            flex: 1;
          }
          .feature-text strong {
            color: #1c3b4e;
            display: block;
            margin-bottom: 4px;
          }
          .button {
            display: inline-block;
            background-color: #edc04e;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: #d6a632;
          }
          .cta-section {
            text-align: center;
            margin: 30px 0;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            color: #888888;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #1c3b4e;
            text-decoration: none;
          }
          .divider {
            height: 2px;
            background: linear-gradient(to right, transparent, #93bdcc, transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emoji-large">🧠</div>
            <h1>NeuroBreak</h1>
            <p>Tu compañero de bienestar académico</p>
          </div>
          <div class="content">
            <h2>¡Hola ${firstName}! 👋</h2>
            <p>¡Estamos emocionados de tenerte con nosotros! Has dado el primer paso hacia un mejor balance entre tus estudios y tu bienestar.</p>
            <div class="divider"></div>
            <h3 style="color: #1c3b4e;">¿Qué puedes hacer en NeuroBreak?</h3>
            <div class="features">
              <div class="feature-item">
                <div class="feature-icon">🧠</div>
                <div class="feature-text">
                  <strong>Microactividades para la Mente</strong>
                  <p style="margin: 0; color: #666;">Ejercicios de relajación, meditación y concentración diseñados para estudiantes universitarios.</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">💪</div>
                <div class="feature-text">
                  <strong>Actividades Físicas</strong>
                  <p style="margin: 0; color: #666;">Pausas activas y ejercicios de estiramiento para combatir el sedentarismo durante el estudio.</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🧩</div>
                <div class="feature-text">
                  <strong>Desafíos de Creatividad</strong>
                  <p style="margin: 0; color: #666;">Actividades para estimular tu pensamiento creativo y romper con la rutina académica.</p>
                </div>
              </div>
            </div>
            <div class="cta-section">
              <p><strong>¡Es hora de comenzar tu viaje hacia el bienestar!</strong></p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                Comenzar Ahora
              </a>
            </div>
            <div class="divider"></div>
            <h3 style="color: #1c3b4e;">💡 Consejos para empezar:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Toma descansos breves cada 25-50 minutos de estudio</li>
              <li>Prueba diferentes tipos de microactividades para encontrar las que más te gusten</li>
              <li>Establece un horario regular para tus pausas activas</li>
              <li>Comparte NeuroBreak con tus compañeros de estudio</li>
            </ul>
            <p style="margin-top: 30px;">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Estamos aquí para apoyarte!</p>
            <p style="margin-top: 30px;">Con cariño,<br><strong style="color: #1c3b4e;">El equipo de NeuroBreak</strong> 💙</p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 20px;"><strong>Síguenos en nuestras redes sociales</strong></p>
            <div class="social-links">
              <a href="#">📘 Facebook</a>
              <a href="#">📸 Instagram</a>
              <a href="#">🐦 Twitter</a>
            </div>
            <p style="margin-top: 20px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} NeuroBreak. Todos los derechos reservados.</p>
            <p style="margin-top: 15px; font-size: 12px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #888;">Visitar NeuroBreak</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  async sendPasswordResetEmail(email, resetUrl, firstName = 'Usuario') {
    try {
      const mailOptions = {
        from: `"NeuroBreak" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🔐 Recuperación de Contraseña - NeuroBreak',
        html: this.getPasswordResetTemplate(firstName, resetUrl)
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de recuperación enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar email de recuperación:', error);
      throw error;
    }
  }
  getPasswordResetTemplate(firstName, resetUrl) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #1c3b4e;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
          }
          .content p {
            color: #333333;
            line-height: 1.6;
            font-size: 16px;
          }
          .button {
            display: inline-block;
            background-color: #edc04e;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #d6a632;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            color: #888888;
            font-size: 14px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .link-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧠 NeuroBreak</h1>
          </div>
          <div class="content">
            <h2>Hola ${firstName},</h2>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en NeuroBreak.</p>
            <p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </div>
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>1 hora</strong>.
            </div>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <div class="link-box">
              <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
            </div>
            <p><strong>¿No solicitaste este cambio?</strong></p>
            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu contraseña no cambiará.</p>
            <p>Saludos,<br><strong>El equipo de NeuroBreak</strong></p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} NeuroBreak. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
module.exports = new EmailService();
