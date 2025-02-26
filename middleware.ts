// // Imports
// // ========================================================
// import { NextResponse, type NextRequest } from "next/server";
// import { cookies } from "next/headers";
// import { createClient } from "@/utils/supabase/server";

// // Config
// // ========================================================
// const corsOptions: {
//   allowedMethods: string[];
//   allowedOrigins: string[];
//   allowedHeaders: string[];
//   exposedHeaders: string[];
//   maxAge?: number;
//   credentials: boolean;
// } = {
//   allowedMethods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS".split(","),
//   allowedOrigins: (process.env?.NEXT_PUBLIC_ALLOWED_ORIGIN || "").split(","),
//   allowedHeaders: "Content-Type, Authorization".split(","),
//   exposedHeaders: (process.env?.NEXT_PUBLIC_EXPOSED_HEADERS || "").split(","),
//   maxAge: process.env?.NEXT_PUBLIC_MAX_AGE && parseInt(process.env?.NEXT_PUBLIC_MAX_AGE) || undefined,
//   credentials: process.env?.NEXT_PUBLIC_CREDENTIALS == "true",
// };

// // Middleware
// // ========================================================
// export async function middleware(request: NextRequest) {
//   const CookieStore = cookies();
//   const Supabase = createClient(CookieStore);

//   // Get data from Supabase
//   const { data, error } = await Supabase.from('origin').select('endpoint');

//   if (error) {
//     return NextResponse.json({ error: 'Failed to fetch origins' }, { status: 500 });
//   }

//   // Ensure the data is valid before adding it to CORS allowedOrigins
//   const FilterData = data?.map((item) => item.endpoint);
//   console.log(FilterData)
//   if (FilterData && FilterData.length > 0) {
//     corsOptions.allowedOrigins.unshift(...FilterData);
//   }

//   const response = NextResponse.next();

//   // CORS: Handle preflight (OPTIONS) request
//   if (request.method === "OPTIONS") {
//     response.headers.set("Access-Control-Allow-Credentials", corsOptions.credentials.toString());
//     response.headers.set("Access-Control-Allow-Methods", corsOptions.allowedMethods.join(","));
//     response.headers.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
//     response.headers.set("Access-Control-Expose-Headers", corsOptions.exposedHeaders.join(","));
//     response.headers.set("Access-Control-Max-Age", corsOptions.maxAge?.toString() ?? "");
//     return response;
//   }

//   // Allowed origins check
//   const origin = request.headers.get('origin') ?? '';
//   if (corsOptions.allowedOrigins.includes(origin)) {
//     response.headers.set('Access-Control-Allow-Origin', origin);
//   }

//   // Set default CORS headers
//   response.headers.set("Access-Control-Allow-Credentials", corsOptions.credentials.toString());
//   response.headers.set("Access-Control-Allow-Methods", corsOptions.allowedMethods.join(","));
//   response.headers.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
//   response.headers.set("Access-Control-Expose-Headers", corsOptions.exposedHeaders.join(","));
//   response.headers.set("Access-Control-Max-Age", corsOptions.maxAge?.toString() ?? "");

//   // Return response
//   return response;
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/api/:path*",
// };
