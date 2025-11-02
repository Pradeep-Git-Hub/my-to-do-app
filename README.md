# Azure Serverless To-Do App

A minimal example of a serverless full-stack To-Do application using:

- Frontend: React (Vite)
- Backend: Azure Functions (Node.js)
- Database: Azure Cosmos DB (NoSQL)
- Hosting: Azure Static Web Apps

This repo provides a scaffold to run locally and deploy.

Getting started (local):

1. Install Node.js (>=18 recommended).
2. In two terminals:
   - Frontend:
     cd frontend
     npm install
     npm run dev

   - Backend (Azure Functions):
     cd api
     npm install
     # To run locally you should install Azure Functions Core Tools and set environment variables
     # See below for details.

Environment variables (set these for the API):

- COSMOS_ENDPOINT - Cosmos DB account URI
- COSMOS_KEY - Cosmos DB primary key
- COSMOS_DATABASE - database id (e.g. `TodoDb`)
- COSMOS_CONTAINER - container id (e.g. `Tasks`)

Local template (api/local.settings.json) is included with placeholders.

Deploying:

- Deploy the `frontend` to Azure Static Web Apps and set the `api` folder as the functions API.
- Configure Cosmos DB and set the App Settings with the environment variables above in Azure.

Files created:
- `frontend/` - React app (Vite) that calls API endpoints
- `api/` - Azure Functions (CreateTask, GetTasks, UpdateTask, DeleteTask)
- `staticwebapp.config.json` - routing for static web app

Notes:
- This is a scaffold; replace the placeholder Cosmos DB values with real credentials before use.
- For production, add authentication and secure secrets via Azure Key Vault or App Settings.
