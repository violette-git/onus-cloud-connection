import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Profile } from './Profile';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';
import '@testing-library/jest-dom';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
      url: 'mock-url',
      headers: {},
      insert: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      filter: vi.fn(),
      match: vi.fn(),
      neq: vi.fn(),
      gt: vi.fn(),
      gte: vi.fn(),
      lt: vi.fn(),
      lte: vi.fn(),
      range: vi.fn(),
      like: vi.fn(),
      ilike: vi.fn(),
      is: vi.fn(),
      in: vi.fn(),
      contains: vi.fn(),
      containedBy: vi.fn(),
      overlap: vi.fn(),
      textSearch: vi.fn(),
      not: vi.fn(),
      or: vi.fn(),
      limit: vi.fn(),
      order: vi.fn(),
      range: vi.fn(),
    })),
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

const mockUser: User = {
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
  identities: null,
  factors: null,
};

const mockSession: Session = {
  user: mockUser,
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600,
  token_type: 'bearer'
};

const mockProfile = {
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

const renderProfile = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
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
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
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

  it('should handle auth session persistence', async () => {
    renderProfile();

    // Verify initial session fetch
    expect(supabase.auth.getSession).toHaveBeenCalled();

    // Verify auth state change subscription
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    // Profile data should be displayed
    expect(screen.getByText(mockProfile.full_name)).toBeInTheDocument();
  });
});