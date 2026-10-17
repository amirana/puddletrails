import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
    const user = await authService.register(req.body);
    const verificationEmailSent = user.verificationEmailSent;
    ApiResponse.created(
        res,
        verificationEmailSent
            ? "Registration successful. Check your inbox for a verification link."
            : "Account created, but we couldn't send the verification email. Try requesting a new link.",
        user,
    );
};

const resendVerificationEmail = async (req, res) => {
    await authService.resendVerificationEmail(req.body.email);
    ApiResponse.ok(
        res,
        "If an unverified account exists for that email, a verification link will be sent. Check your inbox shortly.",
    );
};

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(
        req.body,
    );

    // Refresh token goes in httpOnly cookie — not accessible to JS
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: none,
    });

    // res.cookie("accessToken", accessToken, {
    //     httpOnly: true,
    //     maxAge: 15 * 60 * 1000,
    //     secure: true,
    // });

    ApiResponse.ok(res, "Login successfully", { user, accessToken });
};

const refreshToken = async (req, res) => {
    const token = req.cookies?.refreshToken;
    const { accessToken, refreshToken } = await authService.refresh(token);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: none,
    });

    ApiResponse.ok(res, "Token refreshed", { accessToken });
};

const logout = async (req, res) => {
    await authService.logout(req.user.id);
    res.clearCookie("refreshToken");
    ApiResponse.ok(res, "Logout successfully");
};

const verifyEmail = async (req, res) => {
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "Email verified successfully");
};

const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body.email);
    ApiResponse.ok(res, "Password reset email sent");
};

const resetPassword = async (req, res) => {
    await authService.resetPassword(req.params.token, req.body.password);
    ApiResponse.ok(res, "Password reset successful");
};

const profile = async (req, res) => {
    const user = await authService.profile(req.user.id);
    ApiResponse.ok(res, "User profile", user);
};

const updateProfile = async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    ApiResponse.ok(res, "Profile updated", user);
};

const updateAvatar = async (req, res) => {
    const user = await authService.updateAvatar(req.user.id, req.file);
    ApiResponse.ok(res, "Profile photo updated", user);
};

export {
    register,
    resendVerificationEmail,
    login,
    refreshToken,
    logout,
    profile,
    updateProfile,
    updateAvatar,
    verifyEmail,
    forgotPassword,
    resetPassword,
};
