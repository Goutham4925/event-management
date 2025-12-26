🎉 Event Management Platform

A full-stack Event Management Platform built with React, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.
The platform includes a powerful Admin Dashboard for managing events, gallery, testimonials, stats, users, and fully dynamic pages like About, Contact, Works, Gallery, and Testimonials.

🚀 Tech Stack
Frontend

⚡ Vite

⚛️ React + TypeScript

🎨 Tailwind CSS

🧩 shadcn/ui

🎥 Framer Motion

🔐 React Router

🔔 Sonner / Toaster

🔑 JWT-based auth handling

Backend

🟢 Node.js + Express

🧬 Prisma ORM

🐘 PostgreSQL (Aiven / Render)

☁️ Cloudinary (image uploads)

📦 Multer (file middleware)

🔐 JWT Authentication

🧠 Role-based access control

📁 Project Structure (High Level)
frontend/
 ├─ src/
 │  ├─ pages/
 │  │  ├─ public/        # Home, About, Works, Gallery, Testimonials, Contact
 │  │  └─ admin/         # Dashboard, Events, Gallery, Stats, About, Users, Messages
 │  ├─ components/
 │  ├─ contexts/
 │  ├─ lib/
 │  │  ├─ api.ts         # Central API helper
 │  │  └─ iconMap.ts     # Dynamic icon resolver
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
 │  ├─ contact.route.js
 │  ├─ contactPage.route.js
 │  ├─ pageHero.route.js
 │  └─ users.route.js
 ├─ middlewares/
 ├─ prisma/
 └─ server.js

🔐 Authentication & Roles
User Roles

ADMIN – Full access to admin dashboard

USER – Public website access only

Authentication Flow

Admin logs in

JWT token is issued

Token stored in localStorage

Protected routes validated via backend middleware

API requests attach token in headers

🔌 API CALLING SYSTEM (IMPORTANT)

All frontend API calls go through a central API helper.

lib/api.ts
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

export async function apiPut(
  path: string,
  body: any,
  token?: string
) {
  return fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
}


✅ Centralized authentication
✅ Consistent API usage
✅ Cleaner frontend code

📊 API ENDPOINTS OVERVIEW
🎯 Events
GET    /events
POST   /events              (admin)
PUT    /events/:id          (admin)
DELETE /events/:id          (admin)

🖼 Gallery
GET    /gallery
POST   /gallery/:eventId    (admin + upload)
DELETE /gallery/:id         (admin)

💬 Testimonials
GET    /testimonials
POST   /testimonials        (admin)
DELETE /testimonials/:id    (admin)

📈 Stats (Reusable Across Pages)
GET    /stats?page=HOME | ABOUT | TESTIMONIALS
POST   /stats               (admin)
PUT    /stats/:id           (admin)
DELETE /stats/:id           (admin)

🧾 Page Hero (Reusable CMS Section)
GET    /page-hero/:PAGE_ID
PUT    /page-hero/:PAGE_ID  (admin)


Used for:

Works

Gallery

Testimonials

📖 About Page
GET    /about
PUT    /about                 (admin)
POST   /about/upload-hero     (admin + image)

📬 Contact Page
GET    /contact-page
PUT    /contact-page          (admin)
POST   /contact               (public form submission)

👤 Users (Admin)
GET    /users
PUT    /users/:id/role
PUT    /users/:id/status
DELETE /users/:id

🧠 Dynamic Pages Explained
✅ Fully CMS-Driven Pages

About

Works

Gallery

Testimonials

Contact

Each page hero (badge, title, subtitle) is editable from the Admin Dashboard using a reusable Page Hero system.

🎯 Values Section – Dynamic Icons

Admins choose icon names; frontend resolves icons dynamically.

import * as Icons from "lucide-react";

export const iconMap = {
  Heart: Icons.Heart,
  Award: Icons.Award,
  Target: Icons.Target,
  Eye: Icons.Eye,
};

☁️ Image Upload Flow (Cloudinary)

Admin selects an image

Image sent via FormData

Multer stores file in memory

Cloudinary uploads the image

Secure URL stored in database

UI updates instantly

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


⚠️ Backend must be running separately with .env configured.

🌍 Deployment
Backend

Render / Railway / VPS

PostgreSQL via Aiven / Supabase

Frontend

Any static hosting (Vercel, Netlify, Cloudflare Pages)

🔒 Environment Variables
Frontend (.env)
VITE_API_URL=http://localhost:5000/api

Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_URL=...

✅ Key Features Summary

✔ Admin dashboard
✔ Role-based access control
✔ Fully dynamic CMS-driven pages
✔ Reusable Page Hero system
✔ Event-wise gallery
✔ Testimonials & stats system
✔ Cloudinary image uploads
✔ Modern UI & animations

🧩 Future Enhancements

SEO meta editor per page

Draft / publish workflow

Multi-language support

Admin preview mode

Activity & audit logs

👨‍💻 Maintained By

Ineffable Design Solutions