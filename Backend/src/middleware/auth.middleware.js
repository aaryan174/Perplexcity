import jwt from "jsonwebtoken";



export async function authUserMiddleware(req, res, next) {
    const token  = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized",
            success: false,
            err:"Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN);

        req.user = decoded;

        next();                                 
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized",
            success:"false",
            err:"Invalid token"
        })
    }
}
