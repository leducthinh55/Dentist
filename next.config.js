/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    mongodburl: "mongodb://localhost:27017/",
    env_node: "dev"
  }
}
