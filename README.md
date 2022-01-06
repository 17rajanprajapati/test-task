# Practical Task(NodeJS)
In this task we have used `NodeJS(14.17.3)` with `Express` framework to create APIs and for database we have user `MongoDB`. We have used `JWT` authentication strategy.

# Installation: 
1. Install  [NodeJS](https://nodejs.org/en/) & [MongoDB](https://docs.mongodb.com/manual/installation/) on your machine.
2. Inside this directory create `.env` file(All environment variables that are needed are listed below).
3. Install the dependencies using `npm install`
4. Start the server using `npm start` after this command you will see output on the console that node server is running.

## Environment variables that needed to be in `.env` file: 

1. `AWS_ACCESS_KEY_ID`: AWS access key id to access `aws-sdk` in our code.
2. `SECRET_ACCESS_KEY`: AWS secret access key to access `aws-sdk` in our code.
3. `SERVER_PORT`: Server port on which node server will run. Default is `3000`
4. `DB_NAME`: This variable denotes to database name. Default is `practical_task`
5. `S3_BUCKET_NAME`: This variable denotes to s3 bucket name on which we will upload our images.
6. `CLOUD_FRONT_URL`: This is the URL of cloud-front distribution to which we have binded our s3 bucket so that our bucket's content will not be publicly available and it is available through cloud front.

> Note: Server base url is like `http://localhost:3000`

## Modules that are covered in this project: 
- User
    - Sign in - API endpoint is `/v1/user/login` POST method
    - Sign up - API endpoint is `/v1/user/` POST method
- Show user details - API endpoint is `/v1/user` GET method
- Edit user details - API endpoint is `/v1/user` PUT method
- Image file upload to s3 bucket: API endpoint is `/v1/file/upload` POST method