import axios from "../axios.customize";

/**
 * Translate content to target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (vi, en, fr, es, zh, hi)
 */
export const translateApi = (text, targetLang) => {
    return axios.post("/v1/api/translate", {
        text,
        targetLang
    });
};
