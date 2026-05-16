import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { mapAuthUser } from './auth.mapper';
import { getLinkedProviders } from './auth.service';
import type { OAuthProvider } from './auth.types';

WebBrowser.maybeCompleteAuthSession();

type OAuthCallbackParams = {
  access_token: string | null;
  refresh_token: string | null;
  code: string | null;
};

const providerLabels: Record<OAuthProvider, string> = {
  apple: 'Apple',
  facebook: 'Facebook',
  github: 'GitHub',
  google: 'Google',
  instagram: 'Instagram',
  x: 'X (Twitter)',
};

const getRedirectUrl = () => Linking.createURL('/');

export const parseOAuthCallback = (url: string): OAuthCallbackParams => {
  const parsedUrl = new URL(url);
  logger.info('Parsed URL', parsedUrl);
  const params = new URLSearchParams(parsedUrl.hash.substring(1));
  logger.info('Params', params);
  if (!params.get('access_token') && parsedUrl.search) {
    const searchParams = new URLSearchParams(parsedUrl.search);
    return {
      access_token: searchParams.get('access_token'),
      refresh_token: searchParams.get('refresh_token'),
      code: searchParams.get('code'),
    };
  }

  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    code: params.get('code'),
  };
};

export const restoreSession = async (
  params: OAuthCallbackParams,
  fallbackSession: Awaited<
    ReturnType<typeof supabase.auth.getSession>
  >['data']['session']
) => {
  logger.info('params', params);
  if (params.access_token && params.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (error) {
      logger.error('Error setting session', error);
      throw error;
    }

    return;
  }

  if (fallbackSession) {
    await supabase.auth.setSession({
      access_token: fallbackSession.access_token,
      refresh_token: fallbackSession.refresh_token,
    });
  }
};

export const startOAuthFlow = async (
  provider: OAuthProvider,
  currentUserId?: string
) => {
  if (provider === 'instagram') {
    throw new Error('Instagram OAuth is not supported yet');
  }

  logger.info(`Starting ${provider} OAuth`);
  const oldSession = (await supabase.auth.getSession()).data.session;
  const redirectTo = getRedirectUrl();

  const oauthResponse = currentUserId
    ? await supabase.auth.linkIdentity({
        provider: provider as never,
        options: { redirectTo },
      })
    : await supabase.auth.signInWithOAuth({
        provider: provider as never,
        options: { redirectTo },
      });

  if (oauthResponse.error) {
    logger.error('OauthResponseError', oauthResponse);
    throw oauthResponse.error;
  }

  const oauthUrl = oauthResponse.data.url;

  if (!oauthUrl) {
    throw new Error('No OAuth URL returned from Supabase');
  }

  const result = await WebBrowser.openAuthSessionAsync(oauthUrl, redirectTo, {
    showInRecents: true,
  });

  if (result.type === 'cancel') {
    throw new Error('OAuth flow was cancelled');
  }

  if (result.type !== 'success') {
    throw new Error(`OAuth flow failed with type: ${result.type}`);
  }
  logger.info('Oauth Result', result);
  await restoreSession(parseOAuthCallback(result.url), oldSession);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    logger.error('Error getting user', error);
    throw error;
  }

  const authUser = mapAuthUser(user);

  if (currentUserId && user && user.id !== currentUserId) {
    if (oldSession) {
      await supabase.auth.setSession({
        access_token: oldSession.access_token,
        refresh_token: oldSession.refresh_token,
      });
    } else {
      await supabase.auth.signOut();
    }

    throw new Error(
      `This ${providerLabels[provider]} account is already linked to another AroundMe account.`
    );
  }

  logger.info('Reached End here');
  return {
    session,
    authUser:
      user && authUser
        ? {
            ...authUser,
            providers: await getLinkedProviders(user.identities),
          }
        : null,
  };
};

export const unlinkOAuthProvider = async (provider: OAuthProvider) => {
  const { data, error } = await supabase.auth.getUserIdentities();

  if (error) {
    throw error;
  }

  const identity = data.identities.find(
    (item) =>
      item.provider === provider ||
      (provider === 'x' && item.provider === 'twitter')
  );

  if (!identity) {
    return;
  }

  const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity);

  if (unlinkError) {
    throw unlinkError;
  }
};
