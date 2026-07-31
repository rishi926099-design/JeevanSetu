import User from "../models/user.js";
//====================================
//Utiles
//====================================
import { ApiError } from "../utils/apiError.js";
import{ApiResponse} from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//==================================================
//Package
//==================================================
import jwt from "jsonwebtoken";

//==================================================
//Authentication Controllers
//==================================================
//Login User
const login = asyncHandler(async (req, res) => {
    // ==========================================
    // 1. Extract email & password
    // ==========================================
    const { email, password } = req.body;

    // ==========================================
    // 2. Validate required fields
    // ==========================================
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    // ==========================================
    // 3. Validate email format
    // ==========================================
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email address");
    }

    

    // ==========================================
    // 4. Find user
    // ==========================================
    const user = await User.findOne({ email }).select("+password +refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // ==========================================
    // 5. Check account status
    // ==========================================
    if (user.accountStatus !== "Active") {
        throw new ApiError(403, "Your account is not active");
    }

    // ==========================================
    // 6. Compare password
    // ==========================================
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // ==========================================
    // 7. Generate Tokens
    // ==========================================
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // ==========================================
    // 8. Save Refresh Token & Last Login
    // ==========================================
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();

    await user.save({
        validateBeforeSave: false,
    });

   
    // ==========================================
    // 10. Cookie Options
    // ==========================================
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    // ==========================================
    // 11. Send Response
    // ==========================================
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "Login successful"
            )
        );
});
    
 //Logout User
 const logout = asyncHandler(async(req, res) =>{
   // ==========================================
    // 1. Remove Refresh Token from Database
    // ==========================================
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    // ==========================================
    // 2. Cookie Options
    // ==========================================
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    // ==========================================
    // 3. Clear Cookies & Send Response
    // ==========================================
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );

 });
 //Refersh Access Token
    const refreshAccessToken = asyncHandler(async (req, res) => {
    // ==========================================
    // 1. Get Refresh Token
    // ==========================================
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh Token is required");
    }

    // ==========================================
    // 2. Verify Refresh Token
    // ==========================================
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    // ==========================================
    // 3. Find User
    // ==========================================
    const user = await User.findById(decodedToken._id).select("+refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid Refresh Token");
    }

    // ==========================================
    // 4. Compare Refresh Token
    // ==========================================
    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or used");
    }

    // ==========================================
    // 5. Generate New Tokens
    // ==========================================
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // ==========================================
    // 6. Save New Refresh Token
    // ==========================================
    user.refreshToken = refreshToken;

    await user.save({
        validateBeforeSave: false,
    });
    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

    // ==========================================
    // 7. Cookie Options
    // ==========================================
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    // ==========================================
    // 8. Send Response
    // ==========================================
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken,
                },
                "Access Token Refreshed Successfully"
            )
        );
 });
 //Get Current Logged-inUsser
 const getCurrentUser = asyncHandler(async(req,res) =>{
  // ==========================================
    // Return Current Logged-in User
    // ==========================================
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );

 });
  export {
    login,
    logout,
    refreshAccessToken,
    getCurrentUser,
};  