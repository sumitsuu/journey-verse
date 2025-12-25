# JourneyVerse

<div align="center">

**Discover new worlds through movies, games, anime, and books. Rate, review, and share your journey with friends!**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![MinIO](https://img.shields.io/badge/MinIO-S3-orange?style=for-the-badge)](https://min.io/)

</div>

## 📖 About

JourneyVerse is a modern web application for discovering, rating, and reviewing entertainment content including movies, games, anime, and books. Built with Next.js 16 and featuring full internationalization support, it provides a seamless experience for users to track their media consumption and share their journey with friends.

## ✨ Features

- 🎬 **Content Discovery** - Browse and search through movies, games, anime, and books
- ⭐ **Rating System** - Rate and review your favorite content
- 👥 **User Profiles** - Create personalized profiles with avatars and preferences
- 📚 **Personal Library** - Organize your content in custom libraries
- 🔍 **Advanced Filtering** - Filter content by genres, ratings, years, and more
- 🌍 **Internationalization** - Full support for English and Russian (easily extensible)
- 🔐 **Authentication** - Secure user authentication with NextAuth.js
- 📁 **Cloud Storage** - MinIO integration for scalable file storage
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS and Shadcn UI

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Stylus](https://stylus-lang.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)

### Backend
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Storage**: [MinIO](https://min.io/) (S3-compatible)
- **Password Hashing**: [Argon2](https://github.com/ranisalt/node-argon2)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or use [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/) 9.12+
- [Docker](https://www.docker.com/) and Docker Compose
- [PostgreSQL](https://www.postgresql.org/) 18+ (or use Docker)

## 📁 Project Structure

```
journey-verse/
├── src/
│   ├── app/
│   │   └── [locale]/              # Internationalized routes
│   │       ├── arts/              # Arts browsing and details
│   │       ├── users/             # User profiles and settings
│   │       ├── admin/             # Admin panel
│   │       └── _components/       # Shared components
│   ├── lib/
│   │   ├── actions/               # Server actions
│   │   ├── services/              # Business logic
│   │   ├── db/                    # Database schema and connection
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── utils/                 # Utility functions
│   │   └── config/                # Configuration files
│   ├── i18n/                      # Internationalization config
│   └── components/                # Reusable UI components
├── page-content/                  # Translation files
│   ├── en.json                    # English translations
│   └── ru.json                    # Russian translations
├── docker/
│   └── docker-compose.yml         # Docker services configuration
├── components/                    # Shadcn UI components
└── public/                        # Static assets
```

## 🔧 Configuration

### Database

The project uses Drizzle ORM with PostgreSQL. Schema files are located in `src/lib/db/schema.ts`.

### File Storage

Files are stored in MinIO (S3-compatible storage). The application uses signed URLs for secure file access through the `/api/storage/file` endpoint.

### Authentication

Authentication is handled by NextAuth.js with credentials provider. User sessions are managed server-side.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access
- [MinIO](https://min.io/) for object storage solution

---

<div align="center">

Made with ❤️ for media enthusiasts

</div>

