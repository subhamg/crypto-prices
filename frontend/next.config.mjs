import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, ".."),
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:9000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/prices/:path*`,
      },
    ];
  },
};

export default nextConfig;
