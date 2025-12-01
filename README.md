## Project Overview  
NextJSTodo is a simple but fully functional To-Do application. It supports creating, editing, deleting, and marking tasks as complete. The goal of this project is to combine modern web technologies — Next.js, TypeScript, Prisma, SQLite, and Tailwind — to build a maintainable, clean, and scalable codebase.  

This project serves as a learning ground for full-stack development, demonstrating how to:  
- use Next.js for both frontend and backend / API routes  
- integrate a database via Prisma + SQLite  
- style a responsive UI using Tailwind CSS  
- leverage TypeScript for type safety

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Project Structure

nextjstodo/  
├─ prisma/            # Prisma schema and migration files  
├─ public/            # Static assets (images, favicon, etc.)  
├─ src/               # Application source code  
│   ├─ pages/ / app/  # Next.js pages or app router files  
│   ├─ components/    # React components  
│   └─ styles/        # Tailwind / CSS files  
├─ .eslintrc.json     # Linter configuration  
├─ tailwind.config.ts # Tailwind configuration  
├─ next.config.js     # Next.js configuration  
├─ tsconfig.json      # TypeScript config  
├─ package.json       # npm configuration & scripts  
└─ README.md
