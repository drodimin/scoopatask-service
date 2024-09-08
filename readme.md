# ScoopATask Service

## Description
ScoopATask Service is REST API backend for the ScoopATask application. It provides features such as user authentication, task management, and integration with user's Google Drive for data storage. 

## Features
- User authentication and management
- Task creation, editing, deletion, and completion
- Integration with Google Drive for data storage
- Caching user data for performance optimization


## API Endpoints
### User Routes
- `POST /user`: Create a new user
- `POST /user/login`: Login a user
- `POST /user/logout`: Logout a user

### Bucket Routes
- `POST /bucket`: Create a new bucket
- `DELETE /bucket/:bucketId`: Delete a bucket
- `POST /bucket/:bucketId/task`: Add a task to a bucket
- `DELETE /bucket/:bucketId/task/:taskId`: Delete a task from a bucket
- `PUT /bucket/:bucketId/task/:taskId`: Update a task in a bucket
- `GET /bucket/:bucketId/task/:taskId/complete`: Complete a task in a bucket

### AppData Routes
- `GET /appdata`: Get application data
- `POST /appdata`: Update application data

### History Routes
- `GET /history`: Get user history data

### Utility Routes
- `GET /files`: List files in Google Drive
- `GET /file/:filename`: Get a specific file from Google Drive

## Project Status: Archived

⚠️ **Note: This project is no longer actively maintained.**

This project has been archived and is no longer being actively developed or supported. The code and documentation are preserved here for reference purposes only. We recommend exploring more up-to-date alternatives for your needs.

Reasons for archiving:
- The project has reached its end-of-life
- Newer technologies or solutions have superseded this project
- Limited resources for ongoing maintenance

While you're welcome to fork and use this code as a starting point for your own projects, please be aware that it may contain outdated dependencies or unresolved issues.

