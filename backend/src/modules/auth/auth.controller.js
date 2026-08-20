import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async () => {
    const user = await authService.register(req.body);
    ApiResponse.created(res, "Registration success", user);
};

const login = async () => {
    const { user, accessToken, refreshToken } = await authService.login(
        req.body,
    );
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
    });

    // res.cookie("accessToken", accessToken, {
    //     httpOnly: true,
    //     maxAge: 15 * 60 * 1000,
    //     secure: true,
    // });

    ApiResponse.ok(res, "Login successfully", { user, accessToken });
};

const logout = async (req, res) => {
    await authService.logout(req.user.id)
    res.clearCookie("refreshToken")
    ApiResponse.ok(res, "Logout successfully")
};

const profile = async(req, res) => {
    const user = await authService.profile(req.user.id)
    ApiResponse.ok(res, "User profile", user)
}

export { register, login, logout, profile };
