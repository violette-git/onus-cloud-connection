export const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: '',
    phone: '',
    confirmed_at: '',
    email_confirmed_at: '',
    last_sign_in_at: '',
    updated_at: '',
    identities: undefined,
    factors: undefined,
};
export const mockSession = {
    user: mockUser,
    access_token: 'mock-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() + 3600,
    token_type: 'bearer'
};
export const mockProfile = {
    id: 'test-user-id',
    username: 'testuser',
    full_name: 'Test User',
    role: 'musician',
    social_links: {
        instagram: '',
        youtube: '',
        linkedin: ''
    },
    comment_preferences: { disable_comments: false },
    theme_colors: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#cccccc',
    },
};
