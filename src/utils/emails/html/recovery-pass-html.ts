export const htmlRecoveryPassword = (recoveryCode: string) => {
  return `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 10px 0;
          }
          .header h1 {
            color: #333333;
          }
          .content {
            padding: 20px 0;
            text-align: center;
          }
          .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #aaaaaa;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Redefinição de Senha</h1>
          </div>
          <div class="content">
            <p>Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para redefini-la:</p>
            <div class="code">${recoveryCode}</div>
            <p>O código é válido durante 10 minutos.</p>
            <p>Se você não solicitou isso, pode ignorar este e-mail.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 DuckEnterprise. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
