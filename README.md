## Smart Feedback Portal

A simple feedback portal built with **Next.js 16 App Router** and **Supabase**, featuring authentication and real‑time updates for feedback status.

---

### Prerequisites

- **Node.js**: v22.x or newer  
- **Package manager**: `npm`  
- **Supabase account**: project created with a `feedback` table  
- **Git**: for cloning the repository  

---

### Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aisyahnadhira/smart-feedback-portal.git
   cd smart-feedback-portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

   **Example** (do not commit real keys to a public repo):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open `http://localhost:3000` in your browser.

---

### Database Schema & RLS Policies (Supabase)

#### `feedback` table

Example table structure:

- **id**: `uuid` (primary key, default `uuid_generate_v4()`)
- **user_id**: `uuid` (references `auth.users.id`)
- **title**: `text`
- **description**: `text`
- **status**: `text` (e.g. `Pending`, `Processed`)
- **category**: `text` (nullable)
- **priority**: `text` (nullable)
- **created_at**: `timestamp` (default `now()`)

#### RLS policies

Enable **RLS** on the `feedback` table in Supabase, then create these policies:

1. **Insert: users can insert their own feedback**
   - **Policy name**: `Users can insert their own feedback`
   - **Action**: `INSERT`
   - **Target**: `feedback`
   - **With check**: `auth.uid() = user_id`

2. **Select: users can read only their own feedback**
   - **Policy name**: `Users can select only their feedback`
   - **Action**: `SELECT`
   - **Using expression**: `auth.uid() = user_id`

3. **Update by automation (n8n / service role)**
   - **Policy name**: `Service role can update feedback`
   - **Action**: `UPDATE`
   - **Role**: `service_role` (via service role API key)
   - **Expression**: `true`

#### RLS screenshot

- RLS policy screenshot: [Supabase RLS policies for `feedback`](https://jam.dev/c/56dea02e-f6ad-4730-94f5-6df95f601ac3)  
  _Shows the insert/select/update policies described above._

---

### n8n workflow

The n8n automation workflow JSON is included in this repository under the `workflows/` folder (e.g. `workflows/My workflow.json`).  
You can import it into n8n via **Workflow -> Import from File**.

---

### Real‑time updates

This app uses the **Postgres Changes** channel in Supabase to:

- **INSERT events** on `public.feedback`: push new feedback into the user’s list in real time  
- **UPDATE events** on `public.feedback`: update status/category/priority in the UI without page reload  

---

### Demo video

- User logs in  
- User submits new feedback, which immediately appears in the list  
- Status/category/priority changes are reflected in the UI in real time  
- Web URL : https://smart-feedback-portal-311qpabss-aisyahnadhiras-projects.vercel.app/

- Demo login credentials:
  - user1: `user1@gmail.com` / password: `useruser`
  - user2: `user2@gmail.com` / password: `useruser`

- Demo video: [Smart Feedback Portal Realtime Demo](https://jam.dev/c/9aa8b848-a29a-418f-8c97-85e39f4cba62)