import {  validationResult } from "express-validator";

export const validateMiddleware = (req, res, next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }
    next();
};

