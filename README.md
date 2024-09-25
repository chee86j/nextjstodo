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

## Technology Stack
- **Frontend:** Next.js 14.1.0
- **Backend:** Prisma 5.8.1
- **Database:** SQLite
- **Styling:** Tailwind CSS 3.3.0
- **Development Tools:** TypeScript 5, ESLint 8, PostCSS 8, Autoprefixer 10.0.1

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