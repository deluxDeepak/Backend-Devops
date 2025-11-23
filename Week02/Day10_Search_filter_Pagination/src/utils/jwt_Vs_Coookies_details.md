Question 1 — expiresIn cookie me bhi kyu set karte hai?
JWT ke andar expiry token validate karne ke liye hota hai

cookie ka expiry browser ko batata hai ki kab cookie delete karni hai.

Part	Purpose
JWT expiresIn	token invalid ho jayega verify karte waqt
Cookie maxAge/expires	client browser se cookie auto delete

Dono independent hote hain, isliye dono zaroori hain.



Question 2 — Access Token ko cookie me  bhejte hai kya?
Production standard practice
Method	Why
Access token → Header (Authorization: Bearer token)	frontend JS use karega, fast update
Refresh token → HttpOnly Cookie	secure, JS access nahi kar sakta, XSS safe

👉 Access token ko cookie me mat bhejo — CSRF risk badh jata hai.
Refresh cookie + Access token header = most secure architecture.



crypto use kar sakte hai 
Question 3 — Refresh token ko Hash kyu karte hai?
⚠ Risk:

Aap DB me refresh token plain save kar rahe ho

DB hack = attacker unlimited login generate kar sakta

⭐ Solution: Hash before saving
const crypto = require("crypto");
const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
user.refreshToken = hashedRefreshToken;


Aur jab verify karna ho, phir same hash compare.

Example analogy
Password	Save hashed	Refresh token	Save hashed
real password kabhi store nahi karte	✔ secure	token bhi ek secret hai	✔ secure
