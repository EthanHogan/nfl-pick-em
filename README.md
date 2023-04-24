## Technologies used in the Chirp app
- [Next.js (React Framework)](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma (ORM)](https://prisma.io)
- [tRPC (TS-based framework for building typesafe APIs)](https://trpc.io)
- [PlanetScale (Serverless MySQL DB)](https://planetscale.com)
- [Clerk (Auth/User Management)](https://clerk.com)
- [Vercel (CI/CD for Serverless Apps)](https://create.t3.gg/en/deployment/vercel)
- [Axiom (Logging)](https://app.axiom.co)

## Steps to start a new project
- Run: 
```sh
npm install
```
- Next.js, Tailwind, Prisma, tRPC: These are already set up with the project.
- Ensure the project is in your GitHub repository.
- **PlanetScale:**
    1. Sign in to PlanetScale at https://planetscale.com.
    2. Click "Create a New Database."
    3. Select the region for your DB, ideally close to where your Vercel functions will be deployed.
    4. Name your DB (e.g., "chirpdb").
    5. Click the "Connect" button.
    6. Change the "Connect with" value to "Prisma."
    7. Copy the "DATABASE_URL" environment variable and paste it into your project's `.env` file.
    8. In your terminal, run `npx prisma db push` to set the database schema based on the current schema in the `schema.prisma` file.
    9. Run `npx prisma studio` in your terminal to test that your DB is working. This should open a page where you can add a record to the "Example" table.
- **Clerk:**
    1. Navigate to https://dashboard.clerk.com and sign in.
    2. Add an application (you may need to create a workspace first, e.g., "Personal").
    3. Set the application name (e.g., "chirp").
    4. Select Identifiers, Auth strategy, and Social Connections as desired.
    5. Click "Create Application."
    6. Navigate to "API Keys" on Clerk to get the "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" and "CLERK_SECRET_KEY". Copy and paste both into your project's `.env` file.
- **Vercel:**
    1. Create a new project in Vercel at https://vercel.com/new.
    2. Import your project from GitHub by finding it in the list and clicking "import."
    3. Add the "DATABASE_URL", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", and "CLERK_SECRET_KEY" environment variables from your `.env` file to the "Environment Variables" section.
    4. Select "Production", "Preview", and "Development" environments (you can do this later after deployment at https://vercel.com/MyGitHubUsername/MyProjectName/settings/environment-variables if needed).
    5. Click "Deploy."
    6. Set the function region to the region closest to your DB deployment at https://vercel.com/MyGitHubUsername/MyProjectName/settings/functions.
- **Axiom:**
    1. Create an Axiom account with your GitHub at https://app.axiom.co.
    2. Navigate to Vercel Integrations at https://vercel.com/dashboard/integrations.
    3. Browse Marketplace.
    4. Search "Axiom" and add it.
    5. Select the Vercel account you want to add the integration to, then click "Continue."
    6. Choose specific projects or all Vercel projects, then click "Continue."
    7. Click "Add Integration".
    8. Click "Connect to Vercel" in Axiom modal.

## Running the app 
```sh
npm run dev
```

## Pushing schema changes to Database
```sh
npx prisma db push
```

## Opening Prisma Studio
```sh
npx prisma studio
```

## Deployment
Deployment should be as easy as pushing changes to `main` or `master` branch if Vercel and PlanetScale are setup correctly.
```sh
git push
```