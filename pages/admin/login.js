import { useState, useEffect, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const lastAttemptRef = useRef(Date.now());
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');

  // If already signed in and session is loaded, redirect to admin dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/admin');
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Input validation
    if (!username.trim() || !password.trim()) {
      setError(t('error.enterBoth'));
      return;
    }

    // Basic rate limit: allow max 3 attempts per 30 seconds
    const now = Date.now();
    if (attempts >= 3 && now - lastAttemptRef.current < 30000) {
      setError(t('error.rateLimit'));
      return;
    } else if (now - lastAttemptRef.current > 30000) {
      setAttempts(0);
    }

    setAttempts((prev) => prev + 1);
    lastAttemptRef.current = now;

    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    setLoading(false);
    if (result.error) {
      console.error("Login error:", result.error);
      setError(result.error);
    } else {
      const callbackUrl = router.query.callbackUrl || '/admin';
      router.push(callbackUrl);
    }
  };

  return (
    <>
      <Head>
        <title>{t('adminLoginTitle', 'Admin Login | Fantastic AI Studio')}</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center text-primary mb-6">
              {t('adminLogin', 'Admin Login')}
            </h1>

            {error && (
              <div id="login-error" role="alert" className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('username', 'Username')}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password', 'Password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? t('loggingIn', 'logging in...') : t('login', 'Log In')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
