// !!! This is just for local development reasons

import { NuxtHTTPInstance } from '@nuxt/http';
import { Route } from 'vue-router';
import Cookies from 'js-cookie';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const SHORT_LIVED_AUTH_COOKIE = 'ShortLivedAuthCookie';

export default function ({
  $http,
  route,
  env,
}: {
  $http: NuxtHTTPInstance;
  route: Route;
  env: any;
}) {
  // We support setting an access token in query params,
  // mainly to support apps special cases.
  let accessToken = getAccessToken();

  // Check and set token from query or cookie (for apps webview and short lived auth).
  // TODO: This is very critical for some of our flows, not sure if this is the place for it to live?
  if (process.client) {
    if (route.query.access_token) {
      accessToken = route.query.access_token as string;
      setAccessToken(accessToken);
    } else if (Cookies.get(SHORT_LIVED_AUTH_COOKIE)) {
      accessToken = Cookies.get(SHORT_LIVED_AUTH_COOKIE) as string;
      setAccessToken(accessToken);
    }
  }

  const refreshUrl = `${env.sifApi}/account/token/refresh`;
  const loginUrl = `${env.sifApi}/account/login`;
  const logoutUrl = `${env.sifApi}/account/logout`;
  const ssoUrl = `${env.sifApi}/account/sso`;
  const registerUrl = `${env.sifApi}/account/register`;
  const createSubscriptionUrl = `${env.sifApi}/account/subscription/create`;

  $http.onRequest((request) => {
    request.headers.set('Authorization', `Bearer ${getAccessToken()}`);
  });

  $http.onResponse(async (_request, _options, response) => {
    // Check if we are logging out
    if (response.url.startsWith(logoutUrl)) {
      setAccessToken('');
      $http.setHeader('Authorization', '');
      return;
    }

    // Check if the url matches an endpoint that creates a session
    if (
      !response.url.startsWith(refreshUrl) &&
      !response.url.startsWith(loginUrl) &&
      !response.url.startsWith(ssoUrl) &&
      !response.url.startsWith(registerUrl) &&
      !response.url.startsWith(createSubscriptionUrl)
    ) {
      return;
    }

    // get access token. It can be in the root on in the auth prop
    const authResponse = await response.json();

    // If the subscription creation endpoint creates a user, it also authenticates the user and returns an access token
    if (response.url.startsWith(createSubscriptionUrl) && !authResponse.auth) {
      return;
    }

    const { accessToken, refreshToken } = authResponse.auth
      ? authResponse.auth
      : authResponse;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    $http.setHeader('Authorization', `Bearer ${accessToken}`);
  });

  /**
   * onRetry is currently only triggered on 401 (Unauthorized) requests. In that case we refresh the token.
   */
  $http.onRetry(async ({ request }) => {
    // unset access token and the global Authorization header,
    // as they are no longer valid.
    setAccessToken(null);
    $http.setHeader('Authorization', false);

    const prevRefreshToken = getRefreshToken();

    // INFO: nuxt-http uses a special symbol based on the _ky library to stop an ongoing onRetry
    // TODO: Submit a proposal to expose this in the library (https://github.com/nuxt/http)
    if (!prevRefreshToken) {
      // stop the retry, since we have no way of refreshing.
      return ($http as any)._ky.stop;
    }

    try {
      const response = await $http.post(
        `${env.sifApi}/account/token/refresh`,
        { refreshToken: prevRefreshToken },
        {
          retry: 0,
        },
      );

      const { accessToken, refreshToken } = await response.json();
      if (!accessToken) {
        throw new Error('unable to get access token');
      }

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      $http.setHeader('Authorization', `Bearer ${accessToken}`);
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    } catch (err) {
      setRefreshToken(null);
      // stop the retry, since the refresh request failed.
      return ($http as any)._ky.stop;
    }
  });
}

function getAccessToken() {
  if (!process.client) {
    return null;
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  } catch (err) {
    return null;
  }
}

function getRefreshToken() {
  if (!process.client) {
    return null;
  }

  try {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  } catch (err) {
    return null;
  }
}

function setAccessToken(token: string | null): void {
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token ?? '');
  } catch (err) {
    // do nothing
  }
}

function setRefreshToken(token: string | null) {
  try {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token ?? '');
  } catch (err) {
    // do nothing
  }
}
