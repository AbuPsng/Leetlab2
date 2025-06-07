export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id

        const submissions = await db.submission.findMay({
            where: {
                userId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            data: submissions
        })

    } catch (error) {
        console.log(error, "Error while fetching all submissions")
        res.status(500).json({
            error: "Failed to fetch submissions"
        })
    }
}

export const getSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id

        const problemId = req.params.problemId



        const submissions = await db.submission.findMay({
            where: {
                userId,
                problemId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submissions for problem fetched successfully",
            data: submissions
        })

    } catch (error) {
        console.log(error, "Error while fetching all submissions for problem")
        res.status(500).json({
            error: "Failed to fetch submissions for problem"
        })
    }
}

//globally---it will show the number of submission from all the user
export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {

        const problemId = req.params.problemId

        const submissions = await db.submission.count({
            where: {
                problemId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submissions for problem fetched successfully",
            data: { count: submissions }
        })

    } catch (error) {
        console.log(error, "Error while fetching all submissions")
        res.status(500).json({
            error: "Failed to fetch submissions"
        })
    }
}