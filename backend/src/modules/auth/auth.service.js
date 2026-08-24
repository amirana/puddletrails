import crypto from "crypto";
import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
    generateAccessToken,
    generateResetToken,
    verifyRefreshToken,
    generateRefreshToken,
} from "../../common/utils/jwt.utils.js";
import {
    sendVerificationEmail,
    sendResetPasswordEmail,
} from "../../common/config/email.js";

// Hash refresh token before storing — same approach as reset tokens
const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ firstName, lastName, email, password }) => {
    // user registration
    const existing = await User.findOne({ email });

    if (existing) throw ApiError.conflict("Email already exists");

    const { rawToken, hashedToken } = generateResetToken();

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        verificationToken: hashedToken,
    });

    // Don't let email failure crash registration — user is already created
    try {
        await sendVerificationEmail(email, rawToken);
    } catch (error) {
        console.error("Failed to send verification email:", error.message);
    }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    delete userObj._id;

    return userObj;
};

const login = async ({ email, password }) => {
    // take email and check in db
    // check if password is correct
    // check if user is verified or not

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw ApiError.unAuthorized("Invalid email or password");

    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unAuthorized("Invalid email or password");

    if (!user.isVerified) {
        throw ApiError.forbidden("Please verify your email before login");
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateResetToken({ id: user._id });

    // Store hashed refresh token in DB so it can be invalidated on logout
    user.refreshToken = hashedToken(refreshToken);
    await user.save({ validateBeforeSave: false }); // stop validation before save

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    // todo: use cookie parser

    return { user: userObj, accessToken, refreshToken };
};

// Issues a new access token using a valid refresh token
const refresh = async (token) => {
    if (!token) throw ApiError.unAuthorized("Refresh token missing");

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user) throw ApiError.unAuthorized("User no longer exists");

    // Verify the refresh token matches what's stored (prevents reuse of old tokens)
    if (user.refreshToken !== hashedToken(token)) {
        throw ApiError.unAuthorized(
            "Invalid refresh token — please log in again",
        );
    }

    const accessToken = generateAccessToken({ id: user._id });

    const refreshToken = generateResetToken({ id: user._id });

    user.refreshToken = hashedToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const logout = async (userId) => {
    const user = await User.findById(userId);

    if (!user) throw ApiError.unAuthorized("User not found");

    // Clear stored refresh token so it can't be reused
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    // await User.findByIdAndUpdate(userId, { refreshToken: null }); (same as above)
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user)
        throw ApiError.notFound("No account found associated with this email");

    const { rawToken, hashedToken } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    try {
        await sendResetPasswordEmail(email, rawToken);
    } catch (err) {
        console.error("Failed to send reset email:", err.message);
    }
};

const resetPassword = async (token, newPassword) => {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) throw ApiError.badRequest("Invalid or expired reset token");

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
};

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return user;
};

const verifyEmail = async (token) => {
    const trimmed = String(token).trim();
    if (!trimmed) {
        throw ApiError.badRequest("Invalid or expired verification token");
    }

    // DB stores SHA256(raw). Links / email use the raw token — we hash for lookup.
    // If you paste the hash from MongoDB into Postman, hashing again would not match;
    // so we also try a direct match on the stored value.

    const hashedInput = hashedToken(trimmed);
    const user = await User.findOne({ verificationToken: hashedInput }).select(
        "+verificationToken",
    );

    // if user not found
    if (!user) {
        user = await User.findOne({ verificationToken: trimmed }).select(
            "+verificationToken",
        );
    }

    if (!user)
        throw ApiError.badRequest("Invalid or expired verification token");

    await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true },
        $unset: { verificationToken: 1 },
    });

    return user;
};

const profile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) throw ApiError.notFound("User not found");
    return user;
};

export {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refresh,
    profile,
    verifyEmail,
};
