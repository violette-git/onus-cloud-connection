function makeApiCall(method, url, data, callback) {
    console.log("Making API call:", method, url, data);
    GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: {
            'Authorization': `Bearer ${SUNO_API_KEY}`,
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