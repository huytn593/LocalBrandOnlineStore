const ABSOLUTE_URL_PATTERN = /^(?:https?:)?\/\//i;

const DEFAULT_LOCAL_API_URL = 'http://localhost:8080/api';
const DEFAULT_PRODUCTION_API_URL = 'https://localbrandonlinestore.onrender.com/api';

const configuredApiUrl = import.meta.env.VITE_API_URL;
const fallbackApiUrl = import.meta.env.PROD ? DEFAULT_PRODUCTION_API_URL : DEFAULT_LOCAL_API_URL;

export const API_BASE_URL = (configuredApiUrl || fallbackApiUrl).replace(/\/+$/, '');
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export const resolveAssetUrl = (value, subDir) => {
  if (!value) {
    return '';
  }

  if (
    ABSOLUTE_URL_PATTERN.test(value) ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${API_ORIGIN}${value}`;
  }

  if (subDir) {
    return `${API_ORIGIN}/uploads/${subDir}/${value}`;
  }

  return `${API_ORIGIN}/${value.replace(/^\/+/, '')}`;
};
