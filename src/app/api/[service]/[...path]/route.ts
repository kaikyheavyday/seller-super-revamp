/**
 * Generic API Proxy Route
 *
 * Routes: /api/{service}/{...path}
 * Services: customer, product, order
 *
 * Features:
 * - Forwards cookies and headers to backend services
 * - Handles file downloads (Excel, PDF, images) via arraybuffer
 * - Returns Set-Cookie headers from backend to browser
 * - Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 *
 * Usage:
 * Client: axios.get('/api/customer/v1/user/profile')
 * Proxy → Backend: https://backend.com/api-customer/v1/user/profile
 */
import { getServiceUrls } from "@/utils/serviceConfig";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SERVICE_MAP_URL = getServiceUrls();

type ServiceType = keyof typeof SERVICE_MAP_URL;

interface RouteContext {
  params: Promise<{
    service: string;
    path: string[];
  }>;
}

async function proxyRequest(req: NextRequest, context: RouteContext) {
  const { service, path } = await context.params;

  // Validate service
  const serviceBaseUrl = SERVICE_MAP_URL[service as ServiceType];
  if (!serviceBaseUrl) {
    return NextResponse.json(
      {
        error: "Invalid service",
        validServices: Object.keys(SERVICE_MAP_URL),
      },
      { status: 400 },
    );
  }

  // Build target URL
  const targetPath = Array.isArray(path) ? path.join("/") : path;
  const targetUrl = `${serviceBaseUrl}/${targetPath}`;

  // Get query params
  const searchParams = req.nextUrl.searchParams;
  const queryParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  // Get responseType from header (sent by client)
  const useArrayBuffer = req.headers.get("x-response-type") === "arraybuffer";

  try {
    // Prepare request data
    let requestBody = null;
    let contentTypeHeader = req.headers.get("content-type");

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (contentTypeHeader?.includes("application/json")) {
        try {
          requestBody = await req.json();
        } catch {
          // If parsing fails, body is empty
        }
      } else if (contentTypeHeader?.includes("multipart/form-data")) {
        // Handle FormData (file uploads)
        try {
          requestBody = await req.formData();
        } catch (error) {
          console.error("Error parsing FormData:", error);
        }
      }
    }

    const hasBody = requestBody !== null && requestBody !== undefined;
    const response = await axios({
      method: req.method,
      url: targetUrl,
      ...(hasBody && { data: requestBody }),
      params: queryParams,
      headers: {
        // Don't manually set Content-Type for FormData, axios will set it with boundary
        ...(hasBody &&
          !contentTypeHeader?.includes("multipart/form-data") && {
            "Content-Type": contentTypeHeader || "application/json",
          }),
        "app-id":
          process.env.NEXT_PUBLIC_ALLKONS_APP_ID ||
          process.env.NEXT_PUBLIC_APP_ID ||
          "",
        // Forward cookies to backend
        Cookie: req.headers.get("cookie") || "",

        ...(req.headers.get("authorization") && {
          Authorization: req.headers.get("authorization")!,
        }),
        ...(req.headers.get("currentmerchantslug") && {
          CurrentMerchantSlug: req.headers.get("currentmerchantslug")!,
        }),
        ...(req.headers.get("lang") && {
          lang: req.headers.get("lang")!,
        }),
        ...(req.headers.get("organization-uuid") && {
          "organization-uuid": req.headers.get("organization-uuid")!,
        }),
      },
      // Use arraybuffer based on client request
      ...(useArrayBuffer && { responseType: "arraybuffer" }),
      // Don't throw on non-2xx status
      validateStatus: () => true,
    });

    // Prepare response headers
    const responseHeaders = new Headers();

    // Forward Set-Cookie from backend to browser
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => {
          responseHeaders.append("Set-Cookie", cookie);
        });
      } else {
        responseHeaders.set("Set-Cookie", setCookieHeader);
      }
    }

    // Handle response based on content-type and request
    const contentType = response.headers["content-type"];

    // Case 1: Error responses (4xx, 5xx) are usually JSON, even if we requested arraybuffer
    if (response.status >= 400 && contentType?.includes("application/json")) {
      // Backend returned JSON error despite arraybuffer request
      const jsonData = useArrayBuffer
        ? JSON.parse(Buffer.from(response.data).toString("utf-8"))
        : response.data;
      return NextResponse.json(jsonData, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    // Case 2: Binary file download (explicit request or binary content-type)
    if (
      useArrayBuffer ||
      contentType?.includes("application/octet-stream") ||
      contentType?.includes("application/vnd") ||
      contentType?.includes("application/pdf") ||
      contentType?.includes("image/")
    ) {
      // Forward all relevant headers
      if (contentType) {
        responseHeaders.set("Content-Type", contentType);
      }
      if (response.headers["content-disposition"]) {
        responseHeaders.set(
          "Content-Disposition",
          response.headers["content-disposition"],
        );
      }
      if (response.headers["content-length"]) {
        responseHeaders.set(
          "Content-Length",
          response.headers["content-length"],
        );
      }
      return new NextResponse(response.data, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    // Case 3: Default JSON response
    return NextResponse.json(response.data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[Proxy Error] ${req.method} ${targetUrl}:`, error.message);

    // Network error or other axios error
    if (error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    return NextResponse.json(
      {
        error: "Proxy Error",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// Export named HTTP method handlers
export async function GET(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}
