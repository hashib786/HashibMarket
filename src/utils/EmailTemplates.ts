const welcomeHTMLEmail = (domain: string, userName: string, com?: string) => {
  return `
 <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Welcome to HashibMarket</title>
     <style>
         /* Add your email styles here */
         body {
             font-family: Arial, sans-serif;
             background-color: #f4f4f4;
             margin: 0;
             padding: 0;
         }
         .container {
             max-width: 600px;
             margin: 0 auto;
             padding: 20px;
             background-color: #ffffff;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
             border-radius: 5px;
         }
         h1 {
             color: #333;
             text-align: center;
         }
         p {
             color: #777;
         }
         .button {
             display: inline-block;
             padding: 10px 20px;
             background-color: #007bff;
             color: #fff;
             text-decoration: none;
             border-radius: 5px;
         }
         .button:hover {
             background-color: #0056b3;
         }
     </style>
 </head>
 <body>
     <div class="container">
         <h1>Welcome to HashibMarket</h1>
         <p>Hello ${userName},</p>
         <p>Thank you for joining HashibMarket! We're excited to have you as a part of our community.</p>
         <p>You can now explore a wide range of products, place orders, and enjoy a seamless shopping experience with us.</p>
         <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
         <p>Happy shopping!</p>
         <a href="https://${domain}${
    com ? ".com" : ""
  }" class="button">Start Shopping</a>
     </div>
 </body>
 </html>
 
 `;
};
