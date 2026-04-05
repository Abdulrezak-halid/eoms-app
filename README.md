# Enterprise Operations Managements System
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)

## Setup Guide

Follow these steps to set up and run the project.

### 1. Install Dependencies

Run the following command to install the required npm packages:

```bash
npm install
```

### 2. Configure Backend Environment Variables

1. Copy the `.env.example` file to create a new `.env` file inside the `packages/back` folder:

   ```bash
   cd packages/back
   cp .env.example .env
   ```

2. Update the `.env` file with your PostgreSQL configuration.

   > If you exposed the PostgreSQL port, skip steps 3 and 4.

3. Find the PostgreSQL container's IP address:

   ```bash
   docker inspect postgres
   ```

4. Update the `DB_HOST` value in the `.env` file with the container's IP address. Example:

   ```env
   DB_HOST=172.17.0.2
   ```
### 3. Generate Required Files

Run all necessary generation commands:

```bash
npm run clean-local-build
```

### 4. Start the Project

Start both the backend and frontend services:

#### Backend

```bash
cd packages/back
npm run dev
```

#### Frontend (Run in a separate terminal)

```bash
cd packages/front
npm run dev
```

Happy coding!

## Maintaining Changes (Optional)

### Run All Generations

To regenerate all necessary files, run the following command in the project root:

```bash
npm run clean-local-build
```

> This command regenerates the API schema and database migrations.

### Generate API Schema

Run this command when API routes change, before using API clients (frontend/tests):

```bash
npm run build:api-schema
```

### Generate Migrations

Navigate to the backend directory and generate the migrations when ORM tables change:

#### Generate Missing Migrations

```bash
cd packages/back
npm run mig:gen:local
```

#### Reset Database and Re-Generate Migrations

```bash
cd packages/back
npm run mig:regen:local
```

## IDE Helper Tasks

Tasks are available for **VSCode** and **Zed**.

### Running Tasks

**VSCode:**

- Press `Ctrl+P`, type `task ` (with a space), and select a task.
- Alternatively, click the `v` icon next to the `+` button in the terminal and select **Run Task...**.

### Available Tasks

```bash
Run Dev (Back)         # Starts the backend development server
Run Dev (Front)        # Starts the frontend development server
Run Dev (Back + Front) # Starts both backend and frontend together
Build API Schema       # Generates the API schema (backend does not need to be running)
Re-Generate Local Migration # Re-generates all database migrations
Clean Local Build      # Runs all necessary generation tasks
Clean Dead Branches    # Deletes local Git branches that no longer exist on the remote
```
