// Define your API key at the top of the file
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0aWNlb3VvaHRvbWplemVwY3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2NDQ4MDAsImV4cCI6MjAyNDIyMDgwMH0.dPTGXg1zCWU9xpbF2dQsuG8RuOWMEKB_0Ct-ZPGBGFk';

function makeApiCall(method, url, data, callback) {
    console.log("Making API call:", method, url, data);
    GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY
        },
        data: JSON.stringify(data),
        onload: function(response) {
            console.log("API response received:", response);
            try {
                const responseJson = JSON.parse(response.responseText);
                console.log("Parsed API response:", responseJson);
                callback(responseJson, response.status);
            } catch (error) {
                console.error("Error parsing API response:", error, "Raw response:", response.responseText);
                callback(null, response.status);
            }
        },
        onerror: function(response) {
            console.error("Error making API call:", response);
            callback(null, response.status);
        }
    });
}

// Example usage:
const linkAccounts = (username, email, code) => {
    console.log(`Attempting to link accounts for ${username} and email ${email} with code ${code}`);
    
    makeApiCall(
        'POST',
        'https://uticeouohtomjezepctd.functions.supabase.co/link-suno-account',
        {
            username: username,
            email: email,
            code: code
        },
        (response, status) => {
            if (status === 200) {
                console.log("Successfully linked accounts:", response);
                // Handle success (e.g., show success message, update UI)
                window.postMessage({
                    type: 'SUNO_ACCOUNT_LINKED',
                    sunoUsername: username,
                    sunoEmail: email
                }, '*');
            } else {
                console.error(`Error linking accounts (status ${status}) :`, response);
                console.log("Detailed error:", response?.message || "Unknown error");
                // Handle error (e.g., show error message)
            }
        }
    );
};