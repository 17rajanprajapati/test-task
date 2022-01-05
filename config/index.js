module.exports = {
    mongoDB: {
        PROTOCOL: process.env.DB_PROTOCOL || 'mongodb',
        HOST: process.env.DB_HOST || '127.0.0.1',
        PORT: process.env.DB_PORT || 27017,
        NAME: process.env.DB_NAME || 'test_task',
        USER: '',
        PASSWORD: '',
        get URL() { return process.env.DB_URL || `${this.PROTOCOL}://${this.HOST}:${this.PORT}/${this.NAME}` }
    },
    server: {
        PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
        HOST: process.env.SERVER_HOST || '0.0.0.0',
        PORT: process.env.SERVER_PORT || '3000',
        get URL() { return `${this.PROTOCOL}://${this.HOST}:${this.PORT}` }
    },
    s3Bucket: {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'aws-s3-access-key-id',
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || 'aws-s3-secret-access-key',
        BUCKET_NAME: process.env.S3_BUCKET_NAME || 's3-bucket-name',
        CLOUD_FRONT_URL: process.env.CLOUD_FRONT_URL || 'cloud-front-url'
    }
};


