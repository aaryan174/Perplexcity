import { body } from "express-validator";


export const  registerUserValidator = [
    body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
     .matches(/^[a-zA-Z0-9_]+$/)
    .isLength({ min: 5 }).withMessage("Username must be at least 5 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")

]