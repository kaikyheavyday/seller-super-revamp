/**
 * Centralized service URL configuration
 * Shared between axiosClient and API proxy
 */

const BACKEND_URL =
  process.env.INTERNAL_API_HOST ||
  process.env.NEXT_PUBLIC_API_HOST_URL ||
  'https://marketplace-api-dev.allkons.com';

/**
 * Get service URL mappings for direct backend calls
 * Used by:
 * - Server-side calls (SSR, Server Components, Server Actions)
 * - API proxy route to forward requests to backend
 *
 * @param {string} baseUrl - Base backend URL
 * @returns {Object} Service URL mappings
 */
export const getServiceUrls = (baseUrl = BACKEND_URL) => ({
  customer: `${baseUrl}/api-customer`,
  product: `${baseUrl}/api-product`,
  order: `${baseUrl}/api-order`,
});

/**
 * Get proxy URL mappings for client-side requests
 * Client-side ALWAYS uses these proxy routes to ensure:
 * - httpOnly cookies are set properly (same-origin requirement)
 * - Backend URLs are hidden from browser
 * - Consistent request handling through Next.js middleware
 *
 * @returns {Object} Proxy URL mappings
 */
export const getProxyUrls = () => ({
  customer: '/api/customer',
  product: '/api/product',
  order: '/api/order',
});

export default {
  getServiceUrls,
  getProxyUrls,
};
