import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //get user from frontend
  //validation from user-not empty
  //check if user already exist
  // check if user have avatar
  // if available then upload them on cloudinary
  const { fullName, email, username, password } = req.body;
  console.log(
    "Email: ",
    email,
    "Passwod: ",
    password,
    "fullName: ",
    fullName,
    "username: ",
    username
  );
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is requireds");
  }
  const avatar = (await avatarLocalPath)
    ? uploadOnCloudinary(avatarLocalPath)
    : new ApiError(400, "Failed to upload avatar");
  const coverImage = (await coverImageLocalPath)
    ? uploadOnCloudinary(coverImageLocalPath)
    : new ApiError(400, "Failed to upload coverImage");
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUsername = await user
    .findById(user._id)
    .select("-password -refreshToken");
  if (!createdUsername) {
    throw new ApiError(500, "something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUsername, "User Registered successfully")
    );
});

export { registerUser };
