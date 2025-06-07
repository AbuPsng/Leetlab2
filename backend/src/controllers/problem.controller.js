import { db } from "../libs/db.js";
import {
    getJudge0LanguageId,
    pollBatchResults,
    submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    const requiredFields = [
        "title",
        "description",
        "difficulty",
        "tags",
        "examples",
        "constraints",
        "testcases",
        "codeSnippets",
        "referenceSolutions",
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is missing` });
        }
    }

    // Safe destructuring after validation
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
    } = req.body;

    // Role check
    const user = req.user

    if (user.role !== "ADMIN") {
        return res.status(403).json({
            error: "You are not allowed to create a problem",
        });
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    error: `Language ${language} is not supported.`,
                });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResults = await submitBatch(submissions);

            const tokens = submissionResults.map((result) => result.token);

            const results = await pollBatchResults(tokens); //polling => its a strategies where we keep asking the api for data (infinite loop)


            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result?.status?.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`,
                    });
                }
            }


        }

        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: user.id,
            },
        });

        res.status(201).json({
            success: true,
            message: "Problem create successfully",
            data: newProblem,
        });
    } catch (error) {
        console.log(error, "Error while creating problem");
        res.status(400).json({
            error: "Error while creating problem",
        });
    }
};

export const getAllProblem = async (req, res) => {
    try {
        const problems = await db.problem.findMany()

        if (problems.length < 1) {
            return res.status(400).json({
                success: true,
                message: "Problem is not made yet"
            })
        }


        res.status(200).json({
            success: true,
            message: "Problems fetch successfully",
            data: problems
        })

    } catch (error) {
        console.log(error, "Error while fetching problems");
        res.status(400).json({
            error: "Error while fetching problems",
        });
    }
};

export const getProblemById = async (req, res) => {
    try {

        const problemId = req.params.id

        if (!problemId) {
            return res.status(400).json({
                error: "No problem id provided"
            })
        }

        const problem = await db.problem.findUnique({
            where: {
                id: problemId
            }
        })

        if (!problem) {
            return res.status(400).json({
                error: "Problem not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Messages fetch successfully",
            data: problem
        })

    } catch (error) {
        console.log(error, "Error while fetching problem by id ");
        res.status(400).json({
            error: "Error while fetching problem by id",
        });
    }
};

export const updateProblem = async (req, res) => {

    const requiredFields = [
        "title",
        "description",
        "difficulty",
        "tags",
        "examples",
        "constraints",
        "testcases",
        "codeSnippets",
        "referenceSolutions",
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is missing` });
        }
    }

    // Safe destructuring after validation
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
    } = req.body;

    const problemId = req.params.id

    if (!problemId) {
        return res.status(400).json({
            error: "No problem id provided"
        })
    }


    const user = req?.user

    // Role check
    if (user?.role !== "ADMIN") {
        return res.status(403).json({
            error: "You are not allowed to create a problem",
        });
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    error: `Language ${language} is not supported.`,
                });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResults = await submitBatch(submissions);

            const tokens = submissionResults.map((result) => result.token);

            const results = await pollBatchResults(tokens); //polling => its a strategies where we keep asking the api for data (infinite loop)


            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result?.status?.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`,
                    });
                }
            }


        }

        const updateProblem = await db.problem.update({
            where: { id: problemId }, data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: user.id,
            },

        }
        )

        res.status(201).json({
            success: true,
            message: "Problem update successfully",
            data: updateProblem,
        });
    } catch (error) {
        console.log(error, "Error while updating problem");
        res.status(400).json({
            error: "Error while updating problem",
        });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        const user = req.user

        if (user.role !== "ADMIN") {
            return res.status(403).json({
                error: "You are not allowed to create a problem",
            });
        }

        const problemId = req.params?.id

        if (!problemId) {
            return res.status(400).json({
                error: "Please provide problem id"
            })
        }

        const problem = await db.problem.findUnique({
            where: {
                id: problemId
            }
        })

        if (!problem) {
            return res.status(400).json({
                error: "Problem not found"
            })
        }

        await db.problem.delete({
            where: {
                id: problemId
            }
        })
        res.status(200).json({
            success: true,
            message: "Problem deleted successfully"
        })

    } catch (error) {
        console.log(error, "Error while fetching problem by id ");
        res.status(400).json({
            error: "Error while fetching problem by id",
        });
    }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
    try {
        const userId = req.user.id

        const problems = await db.problem.findMany({
            where: {
                some: {
                    userId
                }
            },
            include: {
                solvedBy: {
                    where: {
                        userId
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            data: problems
        })
    } catch (error) {
        console.log(error, "Error while fetching problem by user by id ");
        res.status(400).json({
            error: "Error while get solved problem by user by id",
        });
    }
};







