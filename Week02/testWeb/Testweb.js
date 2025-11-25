const axios = require("axios");

const TARGET_URL = "https://results.beup.ac.in/";
const TOTAL_REQUESTS = 500;
const CONCURRENCY = 50;

async function sendRequest() {
    try {
        const response = await axios.get(TARGET_URL, {
            validateStatus: () => true // ← lets us receive non-200 responses
        });

        console.log(`✔ SUCCESS → Status: ${response.status}`);
    } catch (err) {
        const status = err.response?.status || "NO_RESPONSE";
        console.log(`❌ FAILED → Status: ${status}, Error: ${err.code || err.message}`);
    }
}

sendRequest();


