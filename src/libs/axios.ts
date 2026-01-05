import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Microservice URL builder
const getServiceUrl = (service: "product" | "order" | "customer") => {
  const localUrls = {
    product: process.env.NEXT_PUBLIC_LOCAL_PRODUCT_SERVICE_URL,
    order: process.env.NEXT_PUBLIC_LOCAL_ORDER_SERVICE_URL,
    customer: process.env.NEXT_PUBLIC_LOCAL_CUSTOMER_SERVICE_URL,
  };

  // Use local URL if set, otherwise use gateway + path
  return (
    localUrls[service] ||
    `${process.env.NEXT_PUBLIC_API_HOST_URL}/api-${service}`
  );
};

class AxiosClient {
  private instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = this.createInstance(config);
    this.setupInterceptors();
  }

  private createInstance(config?: AxiosRequestConfig): AxiosInstance {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_HOST_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "app-id": process.env.NEXT_PUBLIC_ALLKONS_APP_ID,
      },
      ...config,
    });
  }

  private setupInterceptors() {
    // Request interceptor to add auth token from NextAuth session
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // In the browser, NextAuth session token is stored in cookies
        // The auth() function will handle it server-side
        // For client-side requests, the token will be in the session cookie
        // which is automatically sent with requests
        
        // If you need to manually add the token from session storage or elsewhere:
        if (typeof window !== 'undefined') {
          // Client-side: Token will be included automatically via cookies
          // Or you can get it from session if needed
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error("Axios error:", error);
        
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          console.log("[Axios] 401 Unauthorized - Session expired");
          
          // Redirect to NextAuth signout which will clear session and redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/api/auth/signout?callbackUrl=/login";
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  public updateAuthToken(token?: string) {
    if (token) {
      this.instance.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create a singleton instance
const axiosClientInstance = new AxiosClient({
  headers: {
    "app-id": process.env.NEXT_PUBLIC_ALLKONS_APP_ID,
  },
});

const api = axiosClientInstance.getInstance();

// Simple microservice helpers
export const productAPI = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, { ...config, baseURL: getServiceUrl("product") }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, { ...config, baseURL: getServiceUrl("product") }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, { ...config, baseURL: getServiceUrl("product") }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, { ...config, baseURL: getServiceUrl("product") }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, { ...config, baseURL: getServiceUrl("product") }),
};

export const orderAPI = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, { ...config, baseURL: getServiceUrl("order") }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, { ...config, baseURL: getServiceUrl("order") }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, { ...config, baseURL: getServiceUrl("order") }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, { ...config, baseURL: getServiceUrl("order") }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, { ...config, baseURL: getServiceUrl("order") }),
};

export const customerAPI = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, { ...config, baseURL: getServiceUrl("customer") }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, { ...config, baseURL: getServiceUrl("customer") }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, { ...config, baseURL: getServiceUrl("customer") }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, { ...config, baseURL: getServiceUrl("customer") }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, { ...config, baseURL: getServiceUrl("customer") }),
};

export default api;
export { axiosClientInstance };
