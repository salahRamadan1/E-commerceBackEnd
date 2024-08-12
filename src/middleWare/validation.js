import Joi from "joi";
// Define the registration schema with validation rules
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50),// Name must be between 3 and 50 characters
    email: Joi.string().email(),// Email must be valid
    password: Joi.string().min(8).max(16),// Password must be between 8 and 16 characters
    ConfirmEmailNum: Joi.string().length(4).pattern(/^[0-9]+$/),// Confirmation code must be a 4-digit number
    currentPassword: Joi.string().min(8).max(16),
    newPassword: Joi.string().min(8).max(16),
    phone: Joi.string().length(11).pattern(/^(01[0-5]|02|03|04|05|08)\d{8}$/) 

});

// Middleware function to validate user input
export const userValidation = (req, res, next) => {
    // Validate the request body against the registration schema
    const { error } = registerSchema.validate(req.body, { abortEarly: false })

    // If validation errors exist, return a formatted error response
    error ? res.status(201).json(error.details) : next()
}