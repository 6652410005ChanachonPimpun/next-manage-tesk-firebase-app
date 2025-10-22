import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'ozzmppiwxnlpzhzuqdmn.supabase.co',
      port: '',
      pathname: '/**',
    },
  ]
}
};

export default nextConfig;
