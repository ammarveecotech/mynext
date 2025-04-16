# Step-by-Step Signup Form with Next.js

A multi-step signup form built with Next.js and TypeScript, featuring a clean and user-friendly interface.

## Features

- Multi-step form with progress tracking
- Form state management using React Context
- Form validation
- Data persistence across steps
- Responsive design
- Profile picture upload
- Summary page with editable sections

## Tech Stack

- Next.js
- TypeScript
- React Context API
- TanStack Query (React Query)
- Shadcn UI components
- Tailwind CSS

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context for state management
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Next.js pages
│   ├── index.tsx            # Home page
│   ├── personal-information.tsx  # Step 1
│   ├── current-status.tsx        # Step 2
│   ├── preferences.tsx           # Step 3
│   ├── profile-picture.tsx       # Step 4
│   └── overview.tsx              # Final step
└── styles/         # Global styles
```

## Form Steps

1. **Personal Information**: Basic user details
2. **Current Status**: Academic and professional status
3. **Preferences**: Career preferences and interests
4. **Profile Picture**: Upload profile photo
5. **Overview**: Review all information and submit
