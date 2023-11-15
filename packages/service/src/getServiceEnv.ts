export default () => ({
    RENGIN_SERVICE_PORT: process.env.RENGIN_SERVICE_PORT || 9380,
    RENGIN_SERVICE_MONGO_URI: process.env.RENGIN_SERVICE_MONGO_URI || 'mongodb://127.0.0.1:27017/rengin',
})
