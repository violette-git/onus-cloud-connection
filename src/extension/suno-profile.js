// ==UserScript==
// @name         Suno Profile Linker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Link Suno profile to ONUS account
// @author       ONUS
// @match        https://suno.ai/me*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract linking code from URL
    function getLinkingCode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('linking_code');
    }

    // Function to get Suno profile details
    function getSunoDetails() {
        // This would need to be adjusted based on Suno's actual DOM structure
        const usernameElement = document.querySelector('.profile-username');
        const emailElement = document.querySelector('.profile-email');

        if (!usernameElement || !emailElement) {
            console.error("Could not find Suno profile details");
            return null;
        }

        return {
            username: usernameElement.textContent.trim(),
            email: emailElement.textContent.trim()
        };
    }

    // Main function to handle linking
    function handleLinking() {
        const linkingCode = getLinkingCode();
        if (!linkingCode) {
            console.log("No linking code found in URL");
            return;
        }

        const sunoDetails = getSunoDetails();
        if (!sunoDetails) {
            console.log("Could not get Suno profile details");
            return;
        }

        // Call the linkAccounts function from api.js
        window.linkAccounts(sunoDetails.username, sunoDetails.email, linkingCode);
    }

    // Run when the page is loaded
    window.addEventListener('load', handleLinking);
})();