const success = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recibo de pago</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
      .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eee; }
      .status { color: {{statusColor}}; font-weight: bold; }
      .details { margin: 20px 0; }
      .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
      .thank-you { text-align: center; margin-top: 20px; color: #666; }
    </style>
  </head>
  <body>
    <div class="receipt">
      <div class="header">
        <h1>Recibo de pago</h1>
        <p class="status">Estado: APROBADO</p>
      </div>
      <div class="details">
        <div class="detail-row">
          <span>Total:</span>
          <span>$ {{amount}}</span>
        </div>
        <div class="detail-row">
          <span>Transaction ID:</span>
          <span>{{transactionId}}</span>
        </div>
        <div class="detail-row">
          <span>Fecha:</span>
          <span>{{date}}</span>
        </div>
      </div>
      <div class="thank-you">
        <h2>¡Gracias por tu compra!</h2>
        <p>ya puede cerrar esta pantalla.</p>
      </div>
    </div>
  </body>
</html>
`;

export default success;
