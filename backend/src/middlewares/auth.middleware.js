import jwt from "jsonwebtoken"
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            })
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token provided"
            })
        }

        const user = await db.User.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true,
            }
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        req.user = user

        next()

    } catch (error) {
        console.log(error, "Error in user middleware")
        res.status(500).json({
            error: "Error authenticating user"
        })
    }
}

export const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id

        const user = await db.User.findUnique({
            where: {
                id: userId
            }, select: {
                role: true
            }
        })

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied - Admins only "
            })
        }
        next()
    } catch (error) {
        console.log(error, "Error while checking admin")
        res.status(500).json({
            error: "Error checking admin role"
        })
    }
}