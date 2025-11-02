Azure Functions API

Endpoints:
- GET /api/GetTasks -> list tasks
- POST /api/CreateTask -> create task (JSON body: { title, completed? })
- PUT /api/UpdateTask/{id} -> update task (JSON body: { title?, completed? })
- DELETE /api/DeleteTask/{id} -> delete task

Set the following App Settings for Cosmos DB:
- COSMOS_ENDPOINT
- COSMOS_KEY
- COSMOS_DATABASE
- COSMOS_CONTAINER
