const AWS = require('aws-sdk');
const { s3Bucket } = require('../../config');
AWS.config.update({ accessKeyId: s3Bucket.ACCESS_KEY_ID, secretAccessKey: s3Bucket.SECRET_ACCESS_KEY });
const AWS_S3 = new AWS.S3();


let fileUploadService = {};
/**
 * function to upload a file to s3(AWS) bucket.
 */
fileUploadService.uploadFileToS3 = (buffer, fileName, bucketName) => {
    return new Promise((resolve, reject) => {
        AWS_S3.upload({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer
        }, function (err, data) {
            if (err) {
                console.log('Error here', err);
                return reject(err);
            }
            let imageUrl = `${s3Bucket.CLOUD_FRONT_URL}/${data.key}`;
            resolve(imageUrl);
        });
    });
};

module.exports = fileUploadService;