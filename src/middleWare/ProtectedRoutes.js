import jwt from "jsonwebtoken";
import { UserModel } from "../components/users/users.model";
import AppError from "../utils/HandelError/appError/APPERROR";


const protectedRoutes = () => {
    return async (req, res, next) => {
        const headerToken = req.headers["authorization"];
        if (headerToken && headerToken.startsWith(process.env.TOKEN_KEYWORD)) {
            const token = headerToken.split(" ")[1];
            const userData = jwt.verify(
                token,
                process.env.JWT_KEY
            );
            const user = await UserModel.findById(userData._id);
            if (user) {
                if (user.passwordChangedAt) var changePassword = parseInt(user.passwordChangedAt.getTime() / 1000)
                if (changePassword > decode.iat) return next(new AppError('password changed', 201))
                req.user = user;
                next();
            } else {
                return next(new AppError('user not existed from auth', 201))
            }
        } else {
            return next(new AppError('in-valid token header', 201))
        }

    }
}

export default protectedRoutes


