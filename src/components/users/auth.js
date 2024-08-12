import { json } from "express";
import AppError from "../../utils/HandelError/appError/APPERROR.js";
import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import { deleteImg } from "../../utils/HandlerFactoryEndPoint/handler.factory.js";
import { sendEmail } from "../../utils/nodeMailer/Mailer.js";
import { UserModel } from "./users.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from "google-auth-library";
const googleLogIn = catchAsyncError(async (req, res, next) => {
    // 1. Extract Google ID Token:
    const { credential } = req.body
    if (!credential) {
        return next(new AppError('Missing Google ID token'));
    }
    // 2. Verify Google ID Token (Securely Store CLIENT_ID):
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend

        });
        const payload = ticket.getPayload();
        return payload
    }
    // 3. Extract User Information from Payload:
    const payload = await verify()
    const { email_verified, name, picture, email } = payload
    // 4. Validate Email Verification:
    if (!email_verified) return next(new AppError('Invalid google account'))
    // 5. Check for Existing User or Create New User:
    const user = await UserModel.findOne({ email: email })
    if (user) {

        // Existing User: Generate JWT and Send Response
        var token = jwt.sign({ name: user.name, email: user.email, id: user._id, profileImage: user.profileImage, }, process.env.JWT_KEY); // send token
        res.status(201).json({ message: 'success', token })

    }
    else {
        // New User: Create User, Generate JWT, and Send Response
        const newUser = new UserModel({
            name: name,
            email: email,
            profileImage: picture,
            confirmEmail: true

        });

        await newUser.save()




        var token = jwt.sign({ name: newUser.name, email: newUser.email, id: newUser._id, profileImage: newUser.profileImage, }, process.env.JWT_KEY); // send token
        res.status(201).json({ message: 'success', token })
    }


})
const signUp = catchAsyncError(async (req, res, next) => {
    // Check if a user with the provided email already exists
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
        return next(new AppError('Email already exists', 201)); // Use 400 for Bad Request
    }

    // Generate a random 4-digit verification code
    const verificationCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    // Create a new user with the provided details and verification code
    const user = new UserModel({
        ...req.body, // Spread operator to include all request body properties
        numberToConfirmEmail: verificationCode,
    });

    // Hash the user's password securely
    user.password = bcrypt.hashSync(user.password, parseInt(process.env.SALT));

    // Save the new user to the database
    await user.save();

    // **Improved Email Sending:** (Replace with your actual email sending logic)

    // const emailSent = await sendEmail(user.email, {
    //     subject: 'Welcome! Please verify your email',
    //     text: `Your verification code is: ${verificationCode}`,
    // });
    // if (!emailSent) {
    //     console.error('Error sending verification email');
    //     // Consider retrying or handling the error gracefully (e.g., inform user)
    // }

    // console.error('Error sending verification email:', error);
    // // Handle potential errors during email sending
    // return next(new AppError('Failed to send verification email', 500)); // Consider 500 for Internal Server Error


    // Send a success response with minimal details (optional)
    res.status(201).json({ message: 'Registration successful', email: user.email });
});
/******************************************login************************************************/
const logIn = catchAsyncError(async (req, res, next) => {
    // Find the user by email
    const user = await UserModel.findOne({ email: req.body.email })

    // Check if user exists and password matches
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) // check email and password
        return next(new AppError('incorrect email or password', 201));

    // Check if email is confirmed
    if (user.confirmEmail == false) return next(new AppError('please chek your email to verfiy it', 201)) // check if user make confirm or no
    // if user confirm update number confirm to make it empity
    await UserModel.updateOne(
        { email: user.email },
        { numberToConfirmEmail: "" })

    // Generate JWT token
    var token = jwt.sign({ name: user.name, email: user.email, id: user._id, profileImage: user.profileImage, socketId: user.socketId, }, process.env.JWT_KEY); // send token

    // Send a success response with the token
    res.status(201).json({ message: 'logged in successfully', token })
})
/******************************************verfiyEmail************************************************/
const verfiyEmail = catchAsyncError(async (req, res, next) => {
    // Find the user by email
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) return next(new AppError('user not found', 201));

    // Check if the verification code matches (assuming stored in `numberToConfirmEmail`
    if (user.numberToConfirmEmail != req.body.ConfirmEmailNum) return next(new AppError('this number incorrect', 201))

    // Update user's confirmation status and clear verification code
    await UserModel.updateOne(
        { email: user.email },
        { confirmEmail: true, numberToConfirmEmail: "" }
    )
    // Send a success response
    res.status(200).json({ message: 'success', confirmEmail: user.confirmEmail })
})
/******************************************resetPassWord************************************************/
const resetPassWord = catchAsyncError(async (req, res, next) => {
    // Find the user by email
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) return next(new AppError('user not found', 201));

    // Hash the new password securely
    req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT))

    // Update user's  new password
    await UserModel.findOneAndUpdate({ email: user.email }, req.body)

    // Send a success respons
    res.status(200).json({ message: 'success' })
})
/******************************************sendNumberverifyIfNotsend************************************************/
const sendNumberverifyIfNotsend = catchAsyncError(async (req, res, next) => {
    // Find the user by email
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) return next(new AppError('user not found', 201));

    // Generate a random 4-digit verification code
    const verificationCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    // Update user's verification code
    await UserModel.updateOne({ email: user.email }, { numberToConfirmEmail: verificationCode })
    // sendEmail(user.email, `<h1>${verificationCode}</h1>`)

    // Send a success response without the verification code (security)
    res.status(200).json({ message: 'success', email: user.email })

})


/******************************************ChangeProfileImage************************************************/
const changeProfileImage = catchAsyncError(async (req, res, next) => {
    // Extract token and verify
    const token = req.headers.token
    let user = await jwt.verify(token, process.env.JWT_KEY)

    // Check if existing picture needs deletion
    if (!user.profileImage.startsWith('https://')) {
        deleteImg(`./src/uploads/imageUser/${user.profileImage}`)
    }

    // Update profile picture
    req.body.profileImage = req.file?.filename;
    const userUpdate = await UserModel.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true })
    // Generate new token
    var newToken = jwt.sign({
        name: userUpdate.name,
        id: userUpdate._id,
        profileImage: userUpdate.profileImage,
        socketId: userUpdate.socketId,
    }, process.env.JWT_KEY);
    console.log(newToken);
    res.status(200).json({ message: 'success', newToken })
})
/******************************************ChangePassword************************************************/
const changePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    // Find the user by their ID (assuming you have user ID from authentication)
    const user = await UserModel.findById(req.user._id); // Replace with your user ID retrieval logic

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new AppError('Incorrect current password'), 401)
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT));

    // Update the user's password
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'success' });

})
/******************************************ChangeName************************************************/
const ChangeName = catchAsyncError(async (req, res, next) => {
    // Find the user
    const user = await UserModel.findById(req.user._id);
    if (!user) return next(new AppError('user not found', 201));

    // Update the user's name
    const userUpdate = await UserModel.findByIdAndUpdate({ _id: req.user._id }, { name: req.body.name }, { new: true })

    // Generate new token
    var newToken = jwt.sign({
        name: userUpdate.name,
        id: userUpdate._id,
        profileImage: userUpdate.profileImage,
        socketId: userUpdate.socketId,
    }, process.env.JWT_KEY);

    res.status(200).json({ message: 'success', newToken, userUpdate })
})
const protectedRoutes = catchAsyncError(async (req, res, next) => {
    const token = req.headers.token
    if (!token) return next(new AppError('token not provided', 201))
    let decode = await jwt.verify(token, process.env.JWT_KEY)
    const user = await UserModel.findById(decode.id)
    if (!user) return next(new AppError('user not found', 201))
    if (user.passwordChangedAt) var changePassword = parseInt(user.passwordChangedAt.getTime() / 1000)
    if (changePassword > decode.iat) return next(new AppError('password changed', 201))
    req.user = user
    next()
})
const allowed = (...roles) => {
    return catchAsyncError(async (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new AppError('you are not authorized to access this route', 201))
        next()
    })
}

export { signUp, logIn, protectedRoutes, allowed, verfiyEmail, sendNumberverifyIfNotsend, changeProfileImage, changePassword, resetPassWord, googleLogIn }