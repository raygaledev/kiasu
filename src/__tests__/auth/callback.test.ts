import { mockExchangeCodeForSession } from '../helpers/mocks';
import { GET } from '@/app/auth/callback/route';

// Mock NextResponse.redirect to capture the URL
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: string) => ({ redirected: true, url }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function makeRequest(params: Record<string, string>) {
  const url = new URL('http://localhost:3000/auth/callback');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url.toString());
}

describe('GET /auth/callback', () => {
  it('exchanges code and redirects to /dashboard', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    const response = await GET(makeRequest({ code: 'valid-code' }));

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-code');
    expect(response).toEqual({
      redirected: true,
      url: 'http://localhost:3000/dashboard',
    });
  });

  it('redirects to custom next path when provided', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    const response = await GET(
      makeRequest({ code: 'valid-code', next: '/settings' }),
    );

    expect(response).toEqual({
      redirected: true,
      url: 'http://localhost:3000/settings',
    });
  });

  it('redirects to /login?error=auth on failed exchange', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      error: new Error('Invalid code'),
    });

    const response = await GET(makeRequest({ code: 'bad-code' }));

    expect(response).toEqual({
      redirected: true,
      url: 'http://localhost:3000/login?error=auth',
    });
  });

  it('redirects to /login?error=auth when no code provided', async () => {
    const response = await GET(makeRequest({}));

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    expect(response).toEqual({
      redirected: true,
      url: 'http://localhost:3000/login?error=auth',
    });
  });
});
