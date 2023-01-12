/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["el", "en"],
    defaultLocale: "el",
  },
};

module.exports = nextConfig;
