# Plugab Ping-Pong Tournament Platform

A full-stack Next.js application for managing ping-pong tournaments with player registration, match tracking, and admin management.

## 🚀 Features

- **Public Tournament Viewing**: Browse and view tournament details
- **Admin Dashboard**: Manage players, tournaments, and matches
- **Authentication**: JWT-based admin authentication
- **MongoDB Integration**: Full database support with Mongoose ORM
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Type-Safe**: Full TypeScript support with strict mode

## 📦 Tech Stack

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **UI**: Tailwind CSS 4 + shadcn/ui
- **Styling**: Tailwind CSS with CSS variables
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## 🏗️ Project Structure

```
plugab-pingpong/
├── app/
│   ├── api/
│   │   ├── (routes)/              # API endpoints
│   │   │   ├── admin/
│   │   │   ├── players/
│   │   │   ├── tournaments/
│   │   │   └── matches/
│   │   ├── backendServices/       # Backend service layer
│   │   │   ├── mongodb/
│   │   │   │   └── dashboard/
│   │   │   │       ├── schemas/   # Mongoose schemas
│   │   │   │       └── dashboardMongodb.backendService.ts
│   │   │   └── api.backendService.ts
│   │   └── utils/                 # Backend utilities
│   │       ├── jwt.utils.ts
│   │       └── password.utils.ts
│   ├── frontendServices/          # Frontend service layer
│   │   ├── api.frontendService.ts
│   │   ├── admin.frontendService.ts
│   │   ├── player.frontendService.ts
│   │   ├── tournament.frontendService.ts
│   │   └── match.frontendService.ts
│   ├── dashboard/                 # Admin dashboard page
│   ├── login/                     # Admin login page
│   ├── tournaments/               # Public tournaments page
│   ├── layout.tsx
│   ├── page.tsx                   # Homepage
│   └── globals.css
├── components/
│   └── ui/                        # shadcn/ui components
├── lib/
│   └── utils.ts                   # Utility functions
├── middleware.ts                  # Route protection
└── package.json
```

## 🗄️ Database Schemas

### Player
- name, email, phoneNumber
- tournaments (array of ObjectIds)
- status: "ACTIVE" | "INACTIVE" | "BANNED"

### Tournament
- name, description, startDate, endOfRegistration
- players, matches (arrays of ObjectIds)
- format: "league" | "knockout" | "mixed" | "groups"
- status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
- maxPlayers, location, prizePool, isPublished

### Match
- tournament, player1, player2 (ObjectIds)
- player1Score, player2Score, winner
- status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED"
- textNotes, image

### Admin
- name, email, passwordHash
- role: "ADMIN" | "SUPER_ADMIN"
- isActive

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd plugab-pingpong
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment variables**:
   
   Copy `.env.example` and create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** in `.env.local`:
   ```env
   # MongoDB
   MONGODB_DASHBOARD_URI=mongodb+srv://username:password@cluster.mongodb.net/plugab-pingpong

   # JWT Secret (use a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

   # Password Pepper (optional, for extra security)
   PASSWORD_PEPPER=your-optional-pepper-string-for-extra-security

   # Admin Signup Key (used to protect signup route)
   ADMIN_SIGNUP_KEY=your-admin-key-for-signup-route

   # Environment
   NODE_ENV=development
   NEXT_PUBLIC_NODE_ENV=development
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to:
   - Homepage: http://localhost:3000
   - Tournaments: http://localhost:3000/tournaments
   - Admin Login: http://localhost:3000/login
   - Admin Dashboard: http://localhost:3000/dashboard (requires login)

## 👤 Creating Your First Admin

To create the first admin account, use Postman or curl to make a POST request:

**Endpoint**: `POST http://localhost:3000/api/admin/signup`

**Headers**:
```
Content-Type: application/json
x-admin-key: your-admin-key-for-signup-route
```

**Body**:
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securePassword123",
  "role": "SUPER_ADMIN"
}
```

**Example with curl**:
```bash
curl -X POST http://localhost:3000/api/admin/signup \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key-for-signup-route" \
  -d '{
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "securePassword123",
    "role": "SUPER_ADMIN"
  }'
```

## 📝 API Routes

### Admin Routes
- `POST /api/admin/signup` - Create admin (requires x-admin-key header)
- `POST /api/admin/login` - Admin login

### Player Routes
- `POST /api/players/create` - Create player
- `GET /api/players/list` - Get all players
- `GET /api/players/[id]` - Get player by ID
- `PUT /api/players/[id]` - Update player
- `DELETE /api/players/[id]` - Delete player

### Tournament Routes
- `POST /api/tournaments/create` - Create tournament
- `GET /api/tournaments/list` - Get all tournaments
- `GET /api/tournaments/[id]` - Get tournament by ID
- `PUT /api/tournaments/[id]` - Update tournament
- `DELETE /api/tournaments/[id]` - Delete tournament

### Match Routes
- `POST /api/matches/create` - Create match
- `GET /api/matches/[id]` - Get match by ID
- `PUT /api/matches/[id]` - Update match
- `DELETE /api/matches/[id]` - Delete match

## 🔒 Route Protection

The middleware automatically protects routes:

- **Public Routes**: `/`, `/tournaments`, `/login`
- **Protected Routes**: `/dashboard`, all admin API routes (require JWT token)
- **Admin-Only Routes**: `/api/admin/signup` (requires x-admin-key header)

## 🎨 UI Components

Using shadcn/ui components:
- Button, Input, Label
- Card, Dialog, Select, Textarea
- Toast notifications (Sonner)

## 🚢 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your Vercel project settings:
- `MONGODB_DASHBOARD_URI`
- `JWT_SECRET`
- `PASSWORD_PEPPER`
- `ADMIN_SIGNUP_KEY`
- `NODE_ENV=production`

## 📚 Architecture Highlights

- **Service Layer Pattern**: Separation of frontend and backend services
- **MongoDB Singleton**: Efficient connection management with caching
- **JWT Authentication**: Secure token-based authentication
- **Middleware Protection**: Automatic route guarding
- **Type Safety**: Full TypeScript with strict mode

## 🛠️ Development

### Build for production:
```bash
npm run build
```

### Run production build locally:
```bash
npm run start
```

### Lint code:
```bash
npm run lint
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the project maintainer.

---

**Built with ❤️ using Next.js 15, TypeScript, and MongoDB**

