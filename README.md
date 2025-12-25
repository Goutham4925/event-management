🎉 Event Management Platform (Lovable + React + Node)

A full-stack Event Management Platform built with React, TypeScript, Tailwind, Prisma, and PostgreSQL, featuring a powerful Admin Dashboard to manage events, gallery, testimonials, stats, users, and dynamic pages like About.

🌐 Live Project

Lovable URL
👉 https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

🚀 Tech Stack
Frontend

⚡ Vite

⚛️ React + TypeScript

🎨 Tailwind CSS

🧩 shadcn/ui

🎥 Framer Motion

🔐 React Router

🔔 Sonner / Toaster

Backend

🟢 Node.js + Express

🧬 Prisma ORM

🐘 PostgreSQL (Aiven / Render)

☁️ Cloudinary (Image uploads)

📦 Multer (file middleware)

🔐 JWT Authentication

📁 Project Structure (High Level)
frontend/
 ├─ src/
 │  ├─ pages/
 │  │  ├─ public/        # Home, About, Works, Gallery, Testimonials
 │  │  └─ admin/         # Dashboard, Events, Gallery, Stats, About, Users
 │  ├─ components/
 │  ├─ contexts/
 │  ├─ lib/api.ts        # API helper
 │  ├─ lib/iconMap.ts    # Dynamic icon resolver
 │  └─ types/
 │
backend/
 ├─ routes/
 │  ├─ auth.route.js
 │  ├─ events.route.js
 │  ├─ gallery.route.js
 │  ├─ testimonials.route.js
 │  ├─ stats.route.js
 │  ├─ about.route.js
 │  └─ users.route.js
 ├─ middlewares/
 ├─ prisma/
 └─ server.js

🔐 Authentication & Roles
User Roles

ADMIN – Full access to admin dashboard

USER – Public access only

Auth Flow

Admin logs in → JWT issued

Token stored in localStorage

Protected routes validated via middleware

API calls attach token in headers

🔌 API CALLING SYSTEM (IMPORTANT)
Central API Helper – lib/api.ts
export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`);
  return res.json();
}

export async function apiPut(url: string, body: any, token?: string) {
  return fetch(`${API_URL}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
}


✔ All frontend API calls go through this helper
✔ Cleaner code
✔ Easy auth handling

📊 API ENDPOINTS OVERVIEW
🔹 Events
GET    /events
POST   /events        (admin)
PUT    /events/:id    (admin)
DELETE /events/:id    (admin)

🖼 Gallery
GET    /gallery
POST   /gallery/:eventId   (admin + upload)
DELETE /gallery/:id        (admin)

💬 Testimonials
GET    /testimonials
POST   /testimonials       (admin)
DELETE /testimonials/:id   (admin)

📈 Stats (Reusable on any page)
GET    /stats?page=HOME | ABOUT | TESTIMONIALS
POST   /stats              (admin)
PUT    /stats/:id          (admin)
DELETE /stats/:id          (admin)

📖 About Page (Dedicated)
GET    /about
PUT    /about              (admin)
POST   /about/upload-hero  (admin + image)

👤 Users (Admin)
GET    /users
PUT    /users/:id/role
PUT    /users/:id/status
DELETE /users/:id

🧠 Dynamic Pages Explained
✅ About Page (Fully Dynamic)

Hero Title & Subtitle

Story Section

Vision & Mission

Values (icon + title + description)

Years of Experience

Stats (reused from Admin Stats)

All content is controlled from Admin → About Page.

🎯 Values Section (Dynamic Icons)

Admin selects icon name → frontend resolves icon dynamically

import * as Icons from "lucide-react";

export const iconMap = {
  Heart: Icons.Heart,
  Award: Icons.Award,
  Target: Icons.Target,
  Eye: Icons.Eye,
};

☁️ Image Upload Flow (Cloudinary)

Admin selects image

Image sent using FormData

Multer stores file in memory

Cloudinary uploads image

Secure URL saved to DB

Frontend updates instantly

✔ Used for:

Event cover images

Gallery images

About page hero image

🛠 How to Run Locally
# Clone repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start frontend
npm run dev


Backend must be running separately with .env configured.

🌍 Deployment
Frontend

Deploy via Lovable → Share → Publish

Backend

Render / Railway / VPS

PostgreSQL via Aiven / Supabase

🔒 Environment Variables
Frontend (.env)
VITE_API_URL=http://localhost:5000/api

Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_URL=...

✅ Key Features Summary

✔ Admin Dashboard
✔ Role-based access
✔ Dynamic About Page
✔ Event-wise Gallery
✔ Featured Testimonials
✔ Reusable Stats system
✔ Cloudinary uploads
✔ Modern UI / Animations

🧩 Future Enhancements

SEO meta editor per page

Draft / publish mode

Multi-language support

Admin preview mode

Audit logs

👨‍💻 Maintained By

Your Ineffable Design Solutions
