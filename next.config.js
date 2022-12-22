
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/sakai-react/upload.php' : '/api/upload',
        port:process.env.PORT,
        dbUser:process.env.DB_USER,
        dbPass: process.env.DB_PWD,
        dbServer: process.env.DB_SERVER,
        dbName: process.env.DB_NAME,
    }
};

module.exports = nextConfig;
