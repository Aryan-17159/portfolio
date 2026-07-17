# DevOps Portfolio — Full-Stack

A full-stack personal portfolio: vanilla HTML/CSS/JS frontend, Node.js/Express backend,
MongoDB database. Projects and skills are stored in MongoDB and rendered live via a
REST API — nothing is hardcoded in the HTML.

## Stack
- **Frontend:** HTML, CSS, JavaScript (no framework, no build step)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Deploy target:** Render (or Railway/Fly.io) for the app, MongoDB Atlas for the DB

## Project structure
```
portfolio/
├── server.js            # Express app entry point
├── seed.js               # populates MongoDB with sample projects/skills
├── models/
│   ├── Project.js
│   ├── Skill.js
│   └── Message.js
├── routes/
│   ├── projects.js       # GET/POST/PUT/DELETE /api/projects
│   ├── skills.js          # GET/POST/DELETE /api/skills
│   └── contact.js         # POST /api/contact, GET /api/contact (admin)
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
├── .env.example
└── package.json
```

## 1. Local setup

**Requirements:** Node.js 18+, a MongoDB connection string (local MongoDB or a free
MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas).

```bash
cd portfolio
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/portfolio
PORT=5000
ADMIN_KEY=pick-a-long-random-string
```

Seed the database with your projects/skills (edit the arrays in `seed.js` first —
they currently contain your CareerAI Coach, RD INFRO Android app, and AI Notes clone):
```bash
npm run seed
```

Run it:
```bash
npm run dev        # with nodemon, auto-restarts on changes
# or
npm start
```

Visit `http://localhost:5000`.

## 2. Managing content

There's no admin UI built in (kept the scope tight) — you manage projects two ways:

**A. Re-run the seed script** after editing `seed.js` — simplest for a one-person
portfolio.

**B. Use the API directly** with your `ADMIN_KEY`, e.g. with curl:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{
    "title": "New Project",
    "slug": "new-project",
    "summary": "One-line summary",
    "stack": ["React", "Node.js"],
    "pipeline": ["Code", "Build", "Deploy"],
    "status": "live",
    "featured": true
  }'
```

## 3. Deployment

### MongoDB Atlas (free tier)
1. Create a free cluster at https://cloud.mongodb.com
2. Database Access → add a user with a password
3. Network Access → allow access from anywhere (`0.0.0.0/0`) for simplicity
4. Get your connection string from "Connect" → "Drivers"

### Option A — Render (recommended, single service serves API + frontend)
1. Push this folder to a GitHub repo
2. On https://render.com, New → Web Service → connect the repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGODB_URI`, `ADMIN_KEY`, `NODE_ENV=production`
6. Deploy — Render gives you a live URL

### Option B — Split deploy (Vercel/Netlify for frontend + Render/Railway for API)
If you want the frontend on Vercel/Netlify separately:
1. Deploy `server.js` + `routes/` + `models/` to Render/Railway as the API (drop the
   `public/` static serving if you like, or keep it as a fallback)
2. Deploy the `public/` folder to Vercel or Netlify as a static site
3. In `public/js/main.js`, change the `fetch('/api/...')` calls to your full API URL,
   e.g. `fetch('https://your-api.onrender.com/api/projects')`
4. Enable CORS for your frontend's domain (already enabled for all origins via `cors()`
   in `server.js` — tighten this to your domain in production if you want)

### Option C — Railway / Fly.io
Same idea as Render: connect the repo, set the same environment variables, Railway/Fly
auto-detect the Node app from `package.json`.

## 4. Notes on the design
The frontend uses a "systems dashboard" visual language — a pipeline strip animation
in the hero, metric panels, and a live health-check indicator in the nav — since the
content is genuinely CI/CD- and DevOps-flavored. Colors, type (JetBrains Mono + Inter),
and the pipeline signature element are defined in `public/css/style.css`.

## 5. Security notes for a real deployment
- `ADMIN_KEY` gates write endpoints (`POST`/`PUT`/`DELETE`) — keep it secret, never
  commit `.env`
- Contact form is rate-limited (5 requests / 15 min per IP) via `express-rate-limit`
- Consider adding HTTPS-only cookies / a proper auth system if you build out a real
  admin panel later instead of using the raw API
