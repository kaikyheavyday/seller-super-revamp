import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

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
    const auth = Cookies.get("auth");
    const authData = auth ? JSON.parse(auth) : null;

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_HOST_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "app-id": process.env.NEXT_PUBLIC_ALLKONS_APP_ID,
        Authorization: `Bearer ${authData?.accessToken || ""}`,
      },
      ...config, // Merge custom configuration props
    });
  }

  private setupInterceptors() {
    // Request interceptor to always get fresh auth token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const auth = Cookies.get("auth");
        const authData = auth ? JSON.parse(auth) : null;

        if (authData?.accessToken) {
          config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error("Axios error:", error);
        return Promise.reject(error);
      }
    );
  }

  public updateAuthToken(token?: string) {
    if (token) {
      this.instance.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      const auth = Cookies.get("auth");
      const authData = auth ? JSON.parse(auth) : null;
      this.instance.defaults.headers.Authorization = `Bearer ${
        authData?.accessToken || ""
      }`;
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
