// Ensure functions
export function ensureCommentPreferences(commentPreferences) {
    if (typeof commentPreferences !== 'object' || commentPreferences === null) {
        throw new Error('Invalid comment preferences');
    }
    return {
        email_notifications: Boolean(commentPreferences.email_notifications),
        push_notifications: Boolean(commentPreferences.push_notifications),
        disable_comments: Boolean(commentPreferences.disable_comments),
        // Add other expected properties here
    };
}
export function ensureSocialLinks(socialLinks) {
    if (typeof socialLinks !== 'object' || socialLinks === null) {
        throw new Error('Invalid social links');
    }
    return {
        instagram: typeof socialLinks.instagram === 'string' ? socialLinks.instagram : '',
        youtube: typeof socialLinks.youtube === 'string' ? socialLinks.youtube : '',
        linkedin: typeof socialLinks.linkedin === 'string' ? socialLinks.linkedin : '',
        // Add other expected social media platforms here
    };
}
export function ensureThemeColors(themeColors) {
    if (typeof themeColors !== 'object' || themeColors === null) {
        throw new Error('Invalid theme colors');
    }
    return {
        primary: typeof themeColors.primary === 'string' ? themeColors.primary : '#000000',
        secondary: typeof themeColors.secondary === 'string' ? themeColors.secondary : '#FFFFFF',
        accent: typeof themeColors.accent === 'string' ? themeColors.accent : '#333333', // Add this line
        // Add other expected properties here
    };
}
