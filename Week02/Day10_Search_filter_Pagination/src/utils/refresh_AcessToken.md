Refresh endpoint banana mandatory hai agar aapka access token short expiry ka hai (15 minutes etc).
Chalo step by step explanation + code + architecture clear karte hain.

🔥 Access Token vs Refresh Token – Difference & Purpose
Type	Where Used	Expiry	Stored In	Purpose
Access Token	Every protected request (Authorization header)	15m – 1h	Frontend memory (JS / Redux / local variable)	Verify user identity fast
Refresh Token	Only /refresh endpoint	7–30 days	HttpOnly Secure Cookie	Generate new access token when expired
🧠 Which token to send in cookies & WHY?
Send in cookie?	Reason
Refresh Token → Cookie ✔	Should be protected from JavaScript (HttpOnly). Very sensitive, long lived
Access Token → No cookie ❌	CSRF attacks ho sakte hain, short lived hai, header me safe hai
🛡 Production-grade Security Reason
Why Refresh Token in Cookies?
Reason	Explanation
HttpOnly Cookie	JavaScript access nahi → XSS safe
Secure & SameSite	cross-site forgery se protection
Long living secret	DB breach protection via hashing
Only one endpoint uses it	very limited exposure
Why NOT Access Token in Cookies?

❌ Browser automatically bhej dega → CSRF vulnerability
❌ Access token har request me required hota hai → exposure high
✔ Better: Authorization: Bearer <access_token>

🌍 Token Flow Diagram
User Login
   ↓
Server generates Access + Refresh Token
   ↓
Access token → Response body
Refresh token → HttpOnly Cookie
   ↓
Client calls API Protected Routes using Access Token
   ↓
Access token expires
   ↓
Client hits /refresh endpoint with refresh cookie
   ↓
Server verifies token + DB hash
   ↓
New Access Token issued

🧾 Refresh Access Token Endpoint (Production Example)
const refreshTokenController = async (req, res, next) => {
    const cookieToken = req.cookies.refreshToken;   // refresh token from HttpOnly cookie

    if (!cookieToken) {
        return next(new UnauthorizedError("Refresh token missing"));
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(cookieToken, process.env.JWT_REFRESH_SECRET);

        // Hash incoming token and compare with DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(cookieToken)
            .digest("hex");

        const user = await User.findOne({ refreshToken: hashedToken });

        if (!user) return next(new ForbiddenError("Invalid refresh token"));

        // Create new access token
        const newAccessToken = signAccessToken(user);

        // Optionally rotate refresh token
        const newRefreshToken = signRefreshToken(user);
        user.hashToken(newRefreshToken);
        await user.save();

        // Update cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (err) {
        return next(new UnauthorizedError("Refresh token expired or invalid"));
    }
};

🎯 Final Summary
Token	Where stored	Why
Access Token	JS memory (frontend), sent in header	prevents CSRF, short lived
Refresh Token	HttpOnly Secure Cookie	Long lived, sensitive, XSS safe
Best Production Security Setup

🔥 Access token → Authorization header
🔥 Refresh token → HttpOnly Cookie
🔥 Refresh token hashed inside DB
🔥 Short expiry access token + rotation refresh token