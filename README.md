# Field Service System

Field Service System is a web application for coordinating home and equipment service work. Customers can request services and follow their jobs, while operations staff and technicians manage the work from role-specific dashboards.

This repository contains the **web client**. The API server is maintained separately.

## What you can do

- Browse available services and view service details.
- Register and sign in to a customer account.
- Submit and manage service requests, then follow work orders and scheduled visits.
- View invoices, pay issued invoices through the configured bKash flow, and check payment results and history.
- Leave feedback for completed and paid work.
- Manage services, technician applications, requests, work orders, and invoices from the admin and manager workspace.
- Review and accept or reject assigned job offers from the technician workspace.
- Update account details and sign out from the dashboards.

Dashboard routes are protected by role: customers use `/dashboard`, technicians use `/technician`, and admins and managers use `/admin`. The app checks the signed-in user’s active status and role before showing each dashboard.

## Built with

- [Next.js 16](https://nextjs.org/) App Router and React 19
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query) for server state and API mutations
- [Base UI](https://base-ui.com/) and Tailwind CSS 4 for the component and styling foundations
- [Lucide](https://lucide.dev/) for interface icons

## Requirements

- Node.js 20 or later
- Bun 1.4.2 (the package manager declared by this project), or a compatible npm installation
- A running Field Service System API server

## Run locally

1. Install dependencies from the project root:

   ```bash
   bun install
   ```

   With npm, use `npm install` instead.

2. Create `.env.local` in the project root and set the API base URL:

   ```dotenv
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
   ```

   Set this to the API server’s base URL, including `/api/v1` when the server exposes its routes under that prefix. The client reads this value in `src/lib/apiClient.ts` and sends requests with credentials enabled.

3. Start the development server:

   ```bash
   bun run dev
   ```

   Or, with npm:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The API server must be running and configured to accept browser requests from the client origin. Authentication and session behavior are handled by the API and the client’s shared API layer.

## Available commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run lint` | Run ESLint |
| `bun run build` | Create an optimized production build |
| `bun run start` | Serve a production build locally |

The equivalent `npm run <command>` scripts are also available. Run `build` before `start`.

## Main areas of the app

| Area | Routes | Purpose |
| --- | --- | --- |
| Public site | `/`, `/services`, `/services/[serviceId]` | Introduction and service catalogue |
| Authentication | `/login`, `/register` | Account access and registration |
| Customer workspace | `/dashboard` | Requests, work orders, visits, invoices, payments, feedback, and profile |
| Technician workspace | `/technician/dashboard`, `/technician/jobs`, `/technician/work-orders` | Overview, assignment offers, and assigned work |
| Operations workspace | `/admin` | Requests, services, technicians, work orders, invoices, and management overview |

The route groups in `src/app` organize public and dashboard pages without changing their URLs. Shared UI lives in `src/components`; API calls, TanStack Query hooks, and response types live in `src/api`, `src/hooks`, and `src/types` respectively.

## Workflows

### Service request to completed work

1. A customer chooses a service and submits a request.
2. An admin or manager reviews the request. Approving it creates a work order.
3. Operations assigns the work order to a technician.
4. The technician responds to the assignment and carries out the work, with visit and work-order progress shown in the dashboards.
5. After completion, the customer can review the invoice and provide feedback when the invoice is paid.

### Invoice payment

Customers can start payment for an issued invoice. The API starts the bKash checkout and returns a payment URL; the browser then navigates to that URL. When the payment provider sends the user back, the client displays the result indicated by the callback query (`payment=success`, `payment=failure`, or `payment=cancel`) and refreshes invoice and payment history.

## Project conventions

- Make HTTP requests through the shared `apiClient`; keep endpoint details in API modules rather than page components.
- Use TanStack Query hooks for reads and mutations, including query invalidation after updates.
- Keep shared request and response types in `src/types`.
- Build dashboard screens from reusable components and the UI primitives in `src/components/ui`.
- Keep role checks at the dashboard layout boundary, and keep API authorization on the server as the source of truth.
- Do not commit `.env.local`, access tokens, or other secrets. Configure environment values in the deployment environment.

## Production deployment

Build the application with `bun run build` (or `npm run build`) and provide `NEXT_PUBLIC_API_BASE_URL` in the build environment. Deploy the generated Next.js application using a compatible Node.js hosting platform, then run it with `bun run start` or `npm run start`. Configure the API server’s CORS and cookie settings for the deployed client domain, and use HTTPS for both services.

## License

No license is currently specified in this repository.
