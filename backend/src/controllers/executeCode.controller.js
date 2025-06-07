import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js"

export const executeCode = async (req, res) => {

    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body

        const user = req.user.id


        // 1.validate test case
        if (!Array.isArray(stdin) || stdin.length < 1 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
            return res.status(400).json({
                error: "Invalid or missing test cases"
            })
        }

        // 2. Prepare each test cases for judge0 batch submission

        const submission = stdin.map(input => ({
            source_code, language_id, stdin: input,
        }))

        // 3. Send batch of submission to judge0
        const submitResponse = await submitBatch(submission)

        const tokens = submitResponse.map(res => res.token)

        // 4. Poll judge0 for results of all submitted test case
        const results = await pollBatchResults(tokens)

        console.log(results, "Result-------------")

        res.status(200).json({
            success: true,
            message: "Executed submitted successfully",
            data: results
        })

    } catch (error) {
        console.log(error, "Error while executing code");
        res.status(400).json({
            error: "Error while executing code",
        });
    }
}