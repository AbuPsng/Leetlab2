import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"

import authRoutes from "./src/routes/auth.routes.js";
import problemRoutes from "./src/routes/problem.routes.js";
import executionRoute from "./src/routes/executeCode.routes.js";
import submissionRoutes from "./src/routes/submission.routes.js";
import playlistRoutes from "./src/routes/playlist.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.get("/", (req, res) => {
    res.send("Hello guys, Welcome to leetlab");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port : ${process.env.PORT}`);
});
