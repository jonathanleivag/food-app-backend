const template = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
      .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eee; }
      .status { color: #f44336; font-weight: bold; }
      .details { margin: 20px 0; }
      .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
      .error-message { text-align: center; margin-top: 20px; color: #666; }
      .retry-button {
        display: block;
        width: 200px;
        margin: 20px auto;
        padding: 10px;
        background: #f44336;
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .retry-button:hover {
        background: #d32f2f;
      }
    </style>
  </head>
  <body>
    <div class="receipt">
      <div class="header">
        <h1>Payment Failed</h1>
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
