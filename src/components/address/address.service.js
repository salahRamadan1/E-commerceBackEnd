import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import { UserModel } from "../users/users.model.js";

const addAddressList = catchAsyncError(async (req, res, next) => {
 
    const { adresses } = await UserModel.findByIdAndUpdate(req.user._id,
        { $push: { adresses: req.body } }
        , { new: true })
    res.status(200).json({ message: "success" })
})

const removeAddressList = catchAsyncError(async (req, res, next) => {
 
    const  {adresses}  = await UserModel.findByIdAndUpdate(req.user._id,
        { $pull: { adresses: {_id:req.body.addressId} } }
        , { new: true })
    res.status(200).json({ message: "success",adresses })
})
const getUserAddressList = catchAsyncError(async (req, res, next) => {
    console.log(req.user._id);
    const  {adresses}  = await UserModel.findById(req.user._id).populate('product' ,' name')
    res.status(200).json({ message: "success",adresses })
})
export { addAddressList,removeAddressList , getUserAddressList}