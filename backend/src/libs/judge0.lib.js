import axios from "axios";

const languageIdMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
};

const languageNameMap = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java"
}

export const getJudge0LanguageId = (language) => {
    return languageIdMap[language.toUpperCase()];
};

export const getLanguageName = (languageId) => {
    return languageIdMap[languageId] || "Unknown"
}

const sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

export const pollBatchResults = async (tokensArray) => {
    while (true) {
        const { data } = await axios.get(
            `${process.env.JUDGE0_API_URL}/submissions/batch`,
            {
                params: {
                    tokens: tokensArray.join(","),
                    base64_encoded: false,
                },
            },
        );

        const results = data.submissions;



        let isAllDone = results.every(
            (result) => result.status.id !== 1 && result.status.id !== 2,
        );

        if (isAllDone) {

            return results;
        }

        await sleep(2000);
    }
};

export const submitBatch = async (submissionsArray) => {
    const { data } = await axios.post(
        `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        { submissions: submissionsArray },
    );

    return data;
};
