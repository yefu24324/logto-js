import { Context, throwContextError } from './context';

export const createPluginMethods = (context: Context) => {
  const { logtoClient, setLoading, setError } = context;

  const signIn = async (redirectUri: string) => {
    if (!logtoClient.value) {
      return throwContextError();
    }

    try {
      setLoading(true);

      await logtoClient.value.signIn(redirectUri);
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while signing in.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (postLogoutRedirectUri: string) => {
    if (!logtoClient.value) {
      return throwContextError();
    }

    try {
      setLoading(true);

      await logtoClient.value.signOut(postLogoutRedirectUri);

      // We deliberately do NOT set isAuthenticated to false here, because the app state may change immediately
      // even before navigating to the oidc end session endpoint, which might cause rendering problems.
      // Instead, we will reload isAuthenticated state when the user is redirected back and the client app is reloaded.
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while signing out.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    if (!logtoClient.value) {
      return throwContextError();
    }

    try {
      setLoading(true);

      return await logtoClient.value.fetchUserInfo();
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while fetching user info.');
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = async (resource?: string) => {
    if (!logtoClient.value) {
      return throwContextError();
    }

    try {
      setLoading(true);

      return await logtoClient.value.getAccessToken(resource);
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while getting access token.');
    } finally {
      setLoading(false);
    }
  };

  const getIdTokenClaims = () => {
    if (!logtoClient.value) {
      return throwContextError();
    }

    try {
      return logtoClient.value.getIdTokenClaims();
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while getting id token claims.');
    }
  };

  const handleSignInCallback = async (callbackUri: string, returnToPageUrl: string) => {
    if (!logtoClient.value) {
      return throwContextError();
    }

    try {
      setLoading(true);
      await logtoClient.value.handleSignInCallback(callbackUri);

      // We deliberately do NOT set isAuthenticated to true here, because the app state may change immediately
      // even before navigating to the return page URL, which might cause rendering problems.
      // Instead, we will reload isAuthenticated state when the user is redirected back and the client app is reloaded.

      window.location.assign(returnToPageUrl);
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while handling sign in callback.');
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    fetchUserInfo,
    getAccessToken,
    getIdTokenClaims,
    handleSignInCallback,
  };
};
