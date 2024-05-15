/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://ws-old.parlament.ch/:path*', // Proxy to external API
            },
        ];
    },
};

export default nextConfig;
