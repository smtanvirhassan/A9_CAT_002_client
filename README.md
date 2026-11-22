# SalonBook Client

The official Next.js 16 frontend application for the **SalonBook** salon appointment booking platform.

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript & React 19
- **Styling**: Tailwind CSS v4
- **UI System**: shadcn base-nova with `@base-ui/react` primitives and Lucide React icons
- **Authentication**: Better Auth with JWT plugin and Google OAuth provider
- **Payment Gateway**: Stripe Checkout redirection
- **Image Hosting**: ImgBB API
- **Notifications**: Sonner Toast notifications

## Key Features
- **Public Experience**:
  - Hero banner with CTA linking directly to services.
  - Featured 6 active services grid.
  - Service categories exploration.
  - Why Choose Us and client testimonials section.
  - Browse Services page with real-time search, category filtering pills, and price sorting.
- **Authentication**:
  - Secure Sign Up with password complexity validation (min 6 chars, uppercase, lowercase).
  - Profile avatar upload to ImgBB or hosted URL.
  - Google Social Login and Credential Sign In.
  - Automatic role-based redirection to customer or admin dashboards.
- **Service Details & Booking**:
  - Protected service details page.
  - Booking conflict detection (prevents double-booking slots for active appointments).
  - Clean slot selection and optional stylist notes.
- **Customer Dashboard**:
  - Overview cards: total requests, pending, confirmed, cancelled.
  - My Appointments: real-time status badges, cancellation of pending requests, and Stripe "Pay Now" checkout button.
  - My Profile: update personal contact information and avatar.
- **Admin Dashboard**:
  - Operations overview with customer counts, active service counts, and Stripe revenue metrics.
  - Manage Services: Add, edit, delete, and toggle active status with ImgBB file upload.
  - Manage Appointments: Confirm pending slots and cancel appointments.
  - Manage Users: Complete customer directory with one-click Block / Unblock access controls.
  - Transactions: Read-only verified Stripe payment logs.
  - Admin Profile: Manage staff credentials and telephone.

## Installation & Setup

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Required variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_CLIENT_URL`
   - `BETTER_AUTH_URL`
   - `BETTER_AUTH_SECRET`
   - `MONGODB_URI`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_IMGBB_API_KEY`

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Repository Links
- **Client Repository**: [https://github.com/smtanvirhassan/A9_CAT_002_client](https://github.com/smtanvirhassan/A9_CAT_002_client)
- **Server Repository**: [https://github.com/smtanvirhassan/A9_CAT_002_server](https://github.com/smtanvirhassan/A9_CAT_002_server)
