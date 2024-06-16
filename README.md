<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">File storage API service by Alikhan Sapakov<p align="center">
</p>

## Project Overview
This project is a file management system built using Nest.js and MinIO, focusing on efficient file upload, retrieval, and deletion operations with logging using MongoDB.

Features: </br>
File Upload: Uploads files securely to a MinIO object storage bucket.<br/>
File Retrieval: Retrieves files based on their version from the MinIO storage.<br/>
File Deletion: Deletes files from the MinIO bucket while logging deletion events.<br/>
Logging: Records file creation and deletion events in MongoDB for audit and tracking purposes.<br/>

Technologies Used:<br/>
<b>Nest.js</b>: A progressive Node.js framework for building efficient, scalable applications.<br/>
<b>MinIO</b>: An open-source object storage system compatible with Amazon S3.<br/>
<b>TypeScript</b>: Provides static typing and other advanced features to enhance code quality and maintainability.<br/>
<b>Swagger</b>: As a documentation for endpoints (/api-docs)

Setup:
Clone Repository: git clone https://github.com/asapakov/1inch.git <br/>
Use node version: 18+ (18.16.0)<br/>
Install Dependencies: npm install<br/>
Run Application: <b>npm run start:dev</b>.
Go to http://localhost:3000/api-docs

Usage:
Auth: Make a POST request to /auth/login using username and userId<br/> 
Retrieve Files: Access files via the /file/public/:version endpoint, providing the version identifier. (No need auth)<br/>
Upload Files: Use the /file/private endpoint to upload files. Ensure valid authentication and permissions are set.(Need Authorization header)<br/>
Delete Files: Utilize the /file/private/:version endpoint with a DELETE request to remove files securely.(Need Authorization header)<br/>


## Run using docker

```bash
$ docker compose up
```

## Stay in touch

- Author - [Alikhan Sapakov](https://www.linkedin.com/in/alikhan-sapakov-004a34246/)
