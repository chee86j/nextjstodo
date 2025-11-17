# Jira Phase Plan

1. **Product Brief & Architecture**  
   - Capture PRD.md and TechStack.md in `/Instructions`.  
   - Clarify user stories, UX flow, and acceptance criteria before coding.  
   - *Status: Completed.*

2. **Environment & Tooling**  
   - Bootstrap Next.js 14, Tailwind, Typescript, Prisma, ESLint.  
   - Align linting (single quotes, block comment style) with `.cursor/rules`.  
   - *Status: Completed.* 

3. **Data Modeling & Persistence**  
   - Define the `Todo` model, migrations, and `.env` connection string.  
   - Add Prisma CLI devDependency and ensure fields have defaults (`complete @default(false)`).  
   - *Status: Completed.*

4. **Database Initialization**  
   - Run `prisma migrate dev`, check Prisma client singleton (`src/db.ts`), guard query logging by env.  
   - Seed data when needed for demos/tests.  
   - *Status: Completed.* 

5. **Read (List) Experience**  
   - Home page lists todos via reusable `TodoItem` component and handles empty/loading states.  
   - Ensure `TodoItem` exists under `src/components` and the UI meets Tailwind/UX rules.  
   - *Status: Partially completed (component missing).* 

6. **Update (Toggle) Action**  
   - Implement server action with validation, error handling, and `revalidatePath('/')`.  
   - Provide optimistic feedback or disable controls while pending.  
   - *Status: Partially completed.*

7. **Create Flow**  
   - Build `/new` route (form, validation, server action) and wire navigation from home.  
   - Share validation helpers between create/toggle to keep logic DRY.  
   - *Status: Not started.*

8. **Delete Flow**  
   - Add delete action with confirmation, server mutation, and cache revalidation.  
   - Include accessibility-friendly controls (aria labels, keyboard support).  
   - *Status: Not started.*

9. **Update/Edit Flow**  
   - Allow renaming todos (inline edit or dedicated screen) with shared validation.  
   - Ensure optimistic UX and error surfacing.  
   - *Status: Not started.*

10. **UX & Accessibility Polish**  
    - Fix font application in `layout.tsx`, add focus states, responsive design, and empty/error messaging.  
    - Verify against `.cursor/rules/engineering/design-rules.mdc`.  
    - *Status: Not started.*

11. **Testing & Quality Gates**  
    - Add Jest/unit tests for loaders, server actions, and components.  
    - Configure CI to run `npm run lint` and the future `npm test`.  
    - *Status: Not started.*

12. **Deployment & Ops**  
    - Document deployment steps (e.g., Vercel), environment secrets, and Prisma migrate scripts.  
    - Monitor logging strategy and production observability.  
    - *Status: Not started.*
