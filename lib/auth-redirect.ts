import type { Href } from 'expo-router';

const FALLBACK_ROUTE = '/';
const BLOCKED_REDIRECT_PREFIXES = ['/auth'];

type SearchParamValue = string | string[] | undefined;
type SearchParams = Record<string, SearchParamValue>;

export const getSafeRedirectPath = (
  redirectTo?: SearchParamValue,
  fallback = FALLBACK_ROUTE
) => {
  const candidate = Array.isArray(redirectTo) ? redirectTo[0] : redirectTo;

  if (!candidate?.startsWith('/') || candidate.startsWith('//')) {
    return fallback;
  }

  if (
    BLOCKED_REDIRECT_PREFIXES.some((prefix) => candidate.startsWith(prefix))
  ) {
    return fallback;
  }

  return candidate;
};

export const getSafeRedirectHref = (
  redirectTo?: SearchParamValue,
  fallback = FALLBACK_ROUTE
) => getSafeRedirectPath(redirectTo, fallback) as Href;

export const buildCurrentRoute = (
  pathname: string,
  params: SearchParams = {}
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(key, item);
      });
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
};
