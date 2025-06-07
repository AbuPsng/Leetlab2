import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import {
    createProblem,
    deleteProblem,
    getAllProblem,
    getAllProblemsSolvedByUser,
    getProblemById,
    updateProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post(
    "/create-problem",
    authMiddleware,
    checkAdmin,
    createProblem,
);

problemRoutes.get("/get-all-problem", authMiddleware, getAllProblem);

problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

problemRoutes.put(
    "/update-problem/:id",
    authMiddleware,
    checkAdmin,
    updateProblem,
);

problemRoutes.delete(
    "/delete-problem/:id",
    authMiddleware,
    checkAdmin,
    deleteProblem,
);

problemRoutes.get(
    "/get-solved-problem",
    authMiddleware,
    getAllProblemsSolvedByUser,
);

export default problemRoutes;
