# HashibMarket

## Models:

1. **User Model:**
2. **Product Model:**
3. **Order Model:**
4. **Seller Model:**
5. **Cart Model:**
6. **Wishlist Model:**
7. **Payment Model:**

## Models Detail

**1. User Model:**

- Name
- Email
- Password (hashed)
- Role
- Address
- Profile Image
- Cart (reference to Cart model)
- Wishlist (reference to Wishlist model)
- Orders (reference to Order model)
- Reviews (reference to Review model)
- Timestamps (Created At, Updated At)

**2. Product Model:**

- Name
- Description
- Price
- Images (array of image URLs)
- Categories (array of category references)
- Stock Quantity
- Seller (reference to Seller model)
- Reviews (array of Review references)
- Timestamps (Created At, Updated At)

**3. Order Model:**

- User (reference to User model)
- Products (array of product references with quantities)
- Total Price
- Order Status (reference to OrderStatus model)
- Shipping Address
- Payment (reference to Payment model)
- Timestamps (Created At, Updated At)

**4. Review Model:**

- User (reference to User model)
- Product (reference to Product model)
- Rating
- Comment
- Timestamps (Created At, Updated At)

**6. Cart Model:**

- User (reference to User model)
- Products (array of product references with quantities)
- Total Price
- Timestamps (Created At, Updated At)

**7. Wishlist Model:**

- User (reference to User model)
- Products Saved (array of product references)
- Timestamps (Created At, Updated At)

**8. Payment Model:**

- User (reference to User model)
- Order (reference to Order model)
- Payment Method
- Transaction ID
- Payment Status
- Timestamps (Created At, Updated At)

## Routes:

1. **/users:**
2. **/products:**
3. **/sellers:**
4. **/orders:**
5. **/reviews:**
6. **/admins:**
7. **/payments:**

## Routes Detail:

**1. /users:**

**Accessible to All Users:**

- **POST /signup:** User registration.
- **POST /login:** User login.
- **POST /forgotpassword:** Initiate password reset.
- **PUT /resetpassword/:token:** Reset user password using a reset token.

**Logged-In User Accessible:**

- **GET /logout:** User logout.
- **PATCH /updatemypassword:** Update user's own password.
- **PATCH /updateme:** Update user profile information.
- **DELETE /deleteme:** Delete user's own account.
- **GET /me:** Get user's own profile information.

**Admin Accessible:**

- **GET /:** Get all users (for admin).
- **POST /:** Create a new user (for admin).
- **GET /:id:** Get user by ID (for admin).
- **PATCH /:id:** Update user by ID (for admin).
- **DELETE /:id:** Delete user by ID (for admin).

**2. /products:**

**Accessible to All Users:**

- **GET /:** Get a list of products with filters and pagination.
- **GET /:productId:** Get details about a specific product.

**Logged-In User Accessible:**

- **GET /categories:** Get a list of available categories.
- **GET /search:** Search for products based on keywords and filters.

**Seller Accessible:**

- **POST /:** Create a new product (for sellers).
- **PUT /:productId:** Update an existing product by ID (for sellers).
- **DELETE /:productId:** Delete a product by ID (for sellers).

**Admin Accessible:**

- **POST /:** Create a new product (for admin).
- **PUT /:productId:** Update an existing product by ID (for admin).
- **DELETE /:productId:** Delete a product by ID (for admin).

**3. /sellers:**

**Accessible to All Users:**

- **GET /:sellerId:** Get details about a specific seller.

**Seller Accessible:**

- **GET /products:** Get a list of products listed by the seller.
- **GET /products/:productId:** Get details about a specific product listed by the seller.
- **POST /products:** Create a new product (for sellers).
- **PUT /products/:productId:** Update an existing product by ID (for sellers).
- **DELETE /products/:productId:** Delete a product by ID (for sellers).
- **GET /orders:** Get orders associated with the seller's products.
- **GET /orders/:orderId:** Get details about a specific order associated with the seller's products.

**Admin Accessible:**

- **GET /:** Get a list of all sellers (for admin).
- **PUT /:sellerId:** Update seller details or approval status (for admin).
- **DELETE /:sellerId:** Delete a seller by ID (for admin).

**4. /orders:**

**Accessible to All Users:**

- **POST /:** Place a new order.

**Logged-In User Accessible:**

- **GET /:** Get order history for the logged-in user.
- **GET /:orderId:** Get details about a specific order.

**Seller Accessible:**

- **GET /seller:** Get order history for the seller's products.
- **GET /seller/:orderId:** Get details about a specific order associated with the seller's products.

**Admin Accessible:**

- **GET /:** Get a list of all orders (for admin).
- **PUT /:orderId:** Update order status or details (for admin).

**5. /reviews:**

**Accessible to All Users:**

- **POST /:productId:** Add a review for a specific product.

**Logged-In User Accessible:**

- **PATCH /:reviewId:** Update a review posted by the logged-in user.
- **DELETE /:reviewId:** Delete a review posted by the logged-in user.

**Admin Accessible:**

- **GET /:** Get a list of all reviews (for admin).
- **DELETE /:reviewId:** Delete any review by ID (for admin).

**6. /admins:**

**Admin Accessible:**

- **GET /users:** Get a list of all users (for admin).
- **POST /users:** Create a new user (for admin).
- **GET /users/:userId:** Get user by ID (for admin).
- **PATCH /users/:userId:** Update user by ID (for admin).
- **DELETE /users/:userId:** Delete user by ID (for admin).

- **GET /sellers:** Get a list of all sellers (for admin).
- **PUT /sellers/:sellerId:** Update seller details or approval status (for admin).
- **DELETE /sellers/:sellerId:** Delete a seller by ID (for admin).

- **GET /products:** Get a list of all products (for admin).
- **PUT /products/:productId:** Update product by ID (for admin).
- **DELETE /products/:productId:** Delete a product by ID (for admin).

- **GET /orders:** Get a list of all orders (for admin).
- **PUT /orders/:orderId:** Update order by ID (for admin).

- **GET /reviews:** Get a list of all reviews (for admin).
- **DELETE /reviews/:reviewId:** Delete any review by ID (for admin).

**7. /payments:**

**Logged-In User Accessible:**

- **POST /create:** Create a new payment for an order.

**Admin Accessible:**

- **GET /:** Get a list of all payments (for admin).
- **GET /:paymentId:** Get payment details by ID (for admin).
