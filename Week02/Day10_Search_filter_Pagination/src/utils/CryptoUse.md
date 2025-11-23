Bilkul Deepak bhai 👌
crypto Node.js ka built-in core module hai — koi extra install nahi karna padta.
Official docs: Node.js Crypto Module = cryptographic utilities (hashing, HMAC, encryption, random bytes, etc.)

📦 Import / Require

2 ways:

CommonJS
const crypto = require("crypto");

ESM
import crypto from "crypto";

🔑 Most Common Crypto APIs (Production use cases)
1. Hashing (SHA-256)

Use for: refresh token hashing, file checksums, signatures

const hash = crypto.createHash("sha256")
  .update("my token data")
  .digest("hex");

console.log(hash);

2. HMAC (Hash-based Message Authentication Code)

Use for: webhook signature validation, API request signing (Stripe, Razorpay, GitHub webhook)

const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY)
  .update("message")
  .digest("hex");

console.log(hmac);

⚠ Not recommended for refresh token DB hashing

Because HMAC requires secret key and refresh tokens already secure random strings.

3. Random secure token generate

Use for password reset tokens, email verification links

const resetToken = crypto.randomBytes(32).toString("hex");
console.log(resetToken);

4. Creating public/private key pairs
crypto.generateKeyPair("rsa", {
  modulusLength: 2048,
}, (err, publicKey, privateKey) => {});

🧠 Refresh Token Hash Best Practice (Node Crypto)
const crypto = require("crypto");

UserSchema.methods.hashToken = function (token) {
  const hashedToken = crypto.createHash("sha256")
    .update(token)
    .digest("hex");

  this.refreshToken = hashedToken;
  return hashedToken;
};

⭐ Why SHA-256 Perfect For Refresh Tokens?
Feature	Reason
Fast	millions ops/sec
Deterministic	easy comparison
Not reversible	secure if DB leaks
Lightweight	no salt needed
Refresh tokens are already random	no need bcrypt
🔥 bcrypt vs crypto Summary
feature	bcrypt	crypto
purpose	password hashing	tokens & signatures
speed	slow (intentionally)	very fast
salting	auto	manual not needed
best for	login passwords	refresh tokens, signatures
CPU load	high	minimal
🛑 Mistake to avoid

❌ Secret key directly inside model
❌ HMAC for refresh token storage
✔ Use environment variables

🧾 Full Correct Code Snippet
const crypto = require("crypto");

UserSchema.methods.hashToken = function(token) {
  const hashedToken = crypto.createHash("sha256")
    .update(token)
    .digest("hex");

  this.refreshToken = hashedToken;
  return hashedToken;
};

🎯 Final Answer

✔ Node.js crypto module ka best usage refresh token hashing ke liye createHash("sha256")
✔ bcrypt password ke liye
✔ HMAC only jab signature verify karna ho (Webhook style)