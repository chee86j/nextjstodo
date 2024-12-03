# Next.js Todo Application

## Overview
This advanced Todo application is built with Next.js and utilizes Prisma as an ORM to manage SQLite database operations. It offers comprehensive task management capabilities, including prioritization, tagging, and handling optional attributes like due dates and recurrence.

## Features
- **CRUD Operations:** Create, read, update, and delete todo items efficiently.
- **Prioritization:** Assign priority levels (High, Medium, Low) to organize tasks based on urgency.
- **Tagging:** Categorize tasks with customizable tags for better organization.
- **Due Dates and Recurrence:** Schedule tasks with due dates and set up recurring tasks to keep track of deadlines.
- **Attachments:** Attach URLs for additional resources directly to tasks.
- **API Endpoints:** Utilize separate endpoints for fetching all todos and managing specific CRUD operations.
- **Accessibility:** Features aria-label attributes and semantic HTML for improved usability.
- **Dynamic UI Updates:** Real-time task updates using optimized state management.

## Technology Stack
- **Frontend:** Next.js 15.03
- **Backend:** Prisma 6.00
- **Database:** SQLite
- **Styling:** Tailwind CSS 3.4.15
- **Development Tools:** TypeScript 5, ESLint 9, PostCSS 8, Autoprefixer 10.4.20

## Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js (v16 or above)**: Check your version by running `node -v`.
- **npm or yarn**: Check installation by running `npm -v` or `yarn -v`.



### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/chee86j/nextjstodo.git
   cd nextjstodo

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/chee86j/nextjstodo.git
   cd nextjstodo

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Setup the environment**
    - Duplicate the `.env.example` file and rename it to `.env`.
    - Update the `DATABASE_URL` to point to your SQLite file. This might look like `file:./dev.db` for a local file.

4. **Generate Prisma client**
    ```bash
    npx prisma generate
    ```

5. **Run migrations (if any)**
    ```bash
    npx prisma migrate dev
    ```

 6. **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Navigate to [http://localhost:3000](http://localhost:3000) to interact with the application.

 7. **Deploying on Railway.app**
    - Deploy nextjstodo
    - Create Postgres database within same production
      - Copy _DATABASE_PUBLIC_URL variable's value to your .env as
        `DATABASE_URL='your_database_url_here'`
    - Delete prisma folder
    - `npm install prisma --save-dev`
    - `npx prisma init`
    - Update the schema.prisma file to define your models (e.g., Todo and Tag) and   ensure the datasource is set to postgresql:
    - Create a new migration file and apply it locally: 
      `npx prisma migrate dev --name init`
    - Generate the Prisma client to interact with the database:
      `npx prisma generate`
    - Deploy the migrations to the Railway PostgreSQL database:
      `npx prisma migrate deploy`


### Project Structure
    - src/app/: Contains application routes and page logic.
        - page.tsx: Displays and manages all todos.
        - new/page.tsx: Handles the creation of new todos.
    - src/components/: Contains reusable UI components.
        - TodoItem.tsx: Represents individual todo items.
        - Modal.tsx: Provides a modal for editing todos.
    - prisma/schema.prisma: Defines the database schema.
    - pages/api/todos: Contains API endpoints for CRUD operations.

### API Endpoints
    - GET /api/todos: Fetch all todos.
    - POST /api/todos: Create a new todo.
    - PUT /api/todos/:id: Update an existing todo.
    - DELETE /api/todos/:id: Delete a todo.

### Key Enhancements
    - Added dynamic form validation and error handling to prevent invalid submissions.
    - Improved state management with isSaving and isLoading flags.
    - Optimized accessibility with semantic HTML and aria-label attributes.
    - Enhanced UI for better user experience, including modals for editing todos.
    - Centralized form reset logic for maintainability.