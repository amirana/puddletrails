import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
    generateAccessToken,
    generateResetToken,
    verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";

const hashedToken = (token) =>
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

    console.log(user);

    // send an email to user with rawToken

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
    const isMatch = await user.comparePassword(password)
    if (!isMatch) throw ApiError.unAuthorized("Invalid email or password")

    if (!user.isVerified) {
        throw ApiError.forbidden("Please verify your email before login");
    }

    const accessToken = generateAccessToken({ id: user._id });

    const refreshToken = generateResetToken({ id: user._id });

    user.refreshToken = hashedToken(refreshToken);
    await user.save({ validateBeforeSave: false }); // stop validation before save

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    // todo: use cookie parser

    return { user: userObj, accessToken, refreshToken };
};

const refresh = async (token) => {
    if (!token) throw ApiError.unAuthorized("Refresh token missing");

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user) throw ApiError.unAuthorized("User not found");

    if (user.refreshToken !== hashedToken(token)) {
        throw ApiError.unAuthorized("Invalid refresh token");
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

    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    // await User.findByIdAndUpdate(userId, { refreshToken: null }); (same as above)
};

const forgotPassword = (email) => {
    const user = await User.findOne({email})

    if (!user) throw ApiError.notFound("No account found associated with this email")

    const { rawToken, hashedToken } = generateResetToken()

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000

    await user.save()


    // todo: verify mail code
}

const profile = async(userId) => {
    const user = await User.findById(userId)

    if (!user) throw ApiError.notFound("User not found")
    return user;
}

export { register, login, logout, forgotPassword, refresh };
