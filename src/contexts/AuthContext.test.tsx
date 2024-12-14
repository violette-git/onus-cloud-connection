import { render, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const mockSession = {
  user: mockUser,
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Date.now() + 3600000,
};

const TestComponent = () => {
  const { user, loading } = useAuth();
  return (
    <div>
      {loading ? 'Loading...' : user ? `User: ${user.email}` : 'No user'}
    </div>
  );
};

const renderAuthProvider = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should maintain auth state across page loads', async () => {
    // Mock initial session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock auth state change subscription
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      callback('SIGNED_IN', mockSession);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { getByText } = renderAuthProvider();

    await waitFor(() => {
      expect(getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });

    // Simulate page reload by checking localStorage
    const storedSession = localStorage.getItem('supabase.auth.token');
    expect(storedSession).toBeTruthy();
    
    const parsedSession = JSON.parse(storedSession!);
    expect(parsedSession.currentSession.user.id).toBe(mockUser.id);
  });

  it('should handle session expiration', async () => {
    // Mock expired session
    const expiredSession = {
      ...mockSession,
      expires_at: Date.now() - 1000,
    };

    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: expiredSession,
      expiresAt: expiredSession.expires_at,
    }));

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { getByText } = renderAuthProvider();

    await waitFor(() => {
      expect(getByText('No user')).toBeInTheDocument();
    });
  });
});