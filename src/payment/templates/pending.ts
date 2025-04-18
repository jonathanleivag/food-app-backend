const template = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pago pendiente</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
      .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eee; }
      .status { color: #ff9800; font-weight: bold; }
      .details { margin: 20px 0; }
      .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
      .pending-message { text-align: center; margin-top: 20px; color: #666; }
      .loader {
        border: 4px solid #f3f3f3;
        border-radius: 50%;
        border-top: 4px solid #ff9800;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .check-status-button {
        display: block;
        width: 200px;
        margin: 20px auto;
        padding: 10px;
        background: #ff9800;
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .check-status-button:hover {
        background: #f57c00;
      }
    </style>
  </head>
  <body>
    <div class="receipt">
      <div class="header">
        <h1>Payment Pending</h1>
        <p class="status">Status: {{status}}</p>
      </div>
      <div class="details">
        <div class="detail-row">
          <span>Amount:</span>
          <span>$ {{amount}}</span>
        </div>
        <div class="detail-row">
          <span>Product:</span>
          <span>{{product}}</span>
        </div>
        <div class="detail-row">
          <span>Payment Method:</span>
          <span>{{paymentMethod}}</span>
        </div>
        <div class="detail-row">
          <span>Transaction ID:</span>
          <span>{{transactionId}}</span>
        </div>
        <div class="detail-row">
          <span>Date:</span>
          <span>{{date}}</span>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export default template;
