<h1 align="center">🌱 Greener - Carbon Footprint Tracker</h1>

<p align="center">
 Track your carbon emissions and discover sustainable alternatives for every purchase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

### 🛍️ Purchase Tracking

- **Transaction Monitoring**: Integrates with Knot Transaction API to track all purchases
- **Carbon Score Analysis**: Uses LLM to estimate carbon emissions for each item bought
- **Category Classification**: Automatically categorizes purchases (Fashion, Electronics, Food, etc.)
- **Purchase History**: Comprehensive view of all transactions with carbon impact

### 📊 Dashboard & Analytics

- **Carbon Footprint Overview**: Real-time tracking of your monthly carbon emissions
- **Progress Visualization**: Charts showing emissions trends and category breakdowns
- **Goal Setting**: Set and track monthly carbon reduction targets
- **Impact Metrics**: Track savings and environmental improvements over time

### 💡 Smart Recommendations

- **AI-Powered Alternatives**: LLM-generated sustainable product recommendations
- **Amazon Affiliate Integration**: Direct links to eco-friendly alternatives
- **Comparison Tool**: Side-by-side comparison of carbon footprint and pricing
- **Sustainability Scoring**: Rate products based on environmental impact

### 🏆 Gamification

- **Achievement System**: Earn badges for sustainable shopping milestones
- **Streak Tracking**: Monitor consecutive days of eco-friendly purchases
- **Monthly Challenges**: Carbon reduction goals and sustainable purchase targets

### 🔧 Technical Features

- **Next.js 15** with App Router
- **Supabase Authentication** with secure user management
- **Responsive Design** with Tailwind CSS
- **Modern UI Components** with shadcn/ui
- **Real-time Data Visualization** with Recharts
- **TypeScript** for type safety

## How It Works

### 1. Purchase Tracking

The app connects to your bank account via the Knot Transaction API to automatically track all purchases in real-time.

### 2. Carbon Analysis

For each purchase, an LLM (GPT/Gemini/Perplexity) analyzes the product and estimates its carbon footprint based on:

- Product type and materials
- Manufacturing location and processes
- Transportation and packaging
- Industry-standard carbon emission data

### 3. Scoring System

Each purchase receives an arbitrary carbon score (1-10 scale):

- **1-2**: Low impact (sustainable choices)
- **3-4**: Medium impact (could be improved)
- **5-10**: High impact (needs alternatives)

### 4. Recommendations

The AI searches for better alternatives using:

- Product databases
- Amazon affiliate links
- Sustainability ratings
- Price comparisons
- Carbon footprint analysis

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
