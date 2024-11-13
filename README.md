# Experiment web page 🖼️

### What it does 

This webpage shows the user a different picture depending on the experiment variant.

It records the time spent on the page in a database as well as various data such as: device, browser, time, location and more.

### How to recreate

#### Third party steps

NextJS, React, Tailwind CSS:

- `npx create-next-app@latest`
- Select App router, Tailwind, Typescript

Prisma:

- `npm install prisma typescript tsx @types/node --save-dev`
- `npx prisma generate` (creates local types)
- `npx prisma db push` (pushes remote changes)
- get database url from Supabase:
  - Go to supabase
  - Go to project
  - Go to settings
  - Go to Database
  - Select Session mode as the pooler (ends in 5432)
  - Copy and paste the connection string into env under DATABASE_URL
- Create database schema ([example](/prisma/schema.prisma))

Growthbook:

- `npm install --save @growthbook/growthbook`  
- `npm install --save @growthbook/growthbook-react` (another way that works. Both can be used)
- setup feature flags on Growthbook Dashboard:
  - Add Experiment
  - Add Feature
  - Link Feature to Experiment
- Create tracking callback to Growthbook ([example](/lib/growthbook.ts))
- Call init before the experiment page in a useEffect

#### The rest of the implementation

REST API:

- Create endpoints as needed ([example route](/app/api/record/route.ts) and [example route](/app/api/record/[recordId]/route.ts))

Tracker:

- Create tracking as needed ([example](/lib/Tracker.ts))

Front end:

- Design prototype on Figma:
  - View all projects
  - Create different pages for Mobile and Desktop versions
- Create CSS variables ([example](/tailwind.config.ts))
- Download UI components for example `npx shadcn@latest add skeleton`

Images:

- use a fun AI Image generator (I used [this](https://perchance.org/ai-text-to-image-generator))
- use image upscaler (I used this [one](https://www.iloveimg.com/upscale-image))
- move images to `/public`
  
Deployment on AWS Amplify:

- Select Amplify
- Select correct region
- Create new app
- Select github and branch
- Fill in environment variables
- Deploy for now (will fail)
- Edit build settings
- need the build settings to be
  - preBuild:
    - commands:
      - npm ci --cache .npm --prefer-offline
      - npx prisma generate
  - build:
    - commands:
      - echo "DATABASE_URL=$DATABASE_URL" >> .env
      - npm run build

(We did this because prisma is build at compile time and environment variables on Amplify are filled after everything has built)