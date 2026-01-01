import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    localPatterns: [
      {
        pathname: "/images/**",
        search: "?v=1",
      },
      {
        pathname: "/images/**",
        search: "?v=2",
      },
      {
        pathname: "/images/**",
      },
      {
        pathname: "/api/storage/file",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
