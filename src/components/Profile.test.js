import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Profile } from './Profile';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { createSupabaseMock } from '@/test/supabaseMock';
import { mockSession, mockProfile } from '@/test/mockData';
// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
        },
        from: vi.fn(() => createSupabaseMock()),
        storage: {
            from: vi.fn().mockReturnThis(),
            upload: vi.fn(),
            getPublicUrl: vi.fn(),
        },
    },
}));
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const renderProfile = () => {
    return render(_jsx(BrowserRouter, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(Profile, {}) }) }) }));
};
describe('Profile Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock successful auth session
        vi.mocked(supabase.auth.getSession).mockResolvedValue({
            data: { session: mockSession },
            error: null,
        });
        // Mock auth state change subscription
        vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
            callback('SIGNED_IN', mockSession);
            return { data: { subscription: { id: '1', callback, unsubscribe: vi.fn() } } };
        });
        // Mock profile fetch
        vi.mocked(supabase.from).mockImplementation(() => ({
            ...createSupabaseMock(),
            single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }));
    });
    it('should maintain auth state and show profile data', async () => {
        renderProfile();
        await waitFor(() => {
            expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
        });
        expect(screen.getByText(mockProfile.full_name)).toBeInTheDocument();
    });
});
