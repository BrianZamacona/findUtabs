# 🎸 findUtabs - Guitar Tablatures Platform

A modern, full-stack web application for discovering, sharing, and learning guitar tablatures. Built with Spring Boot 4.0.1 and Next.js 16.1.

[![Backend CI](https://github.com/BrianZamacona/findUtabs/workflows/Backend%20CI/badge.svg)](https://github.com/BrianZamacona/findUtabs/actions)
[![Frontend CI](https://github.com/BrianZamacona/findUtabs/workflows/Frontend%20CI/badge.svg)](https://github.com/BrianZamacona/findUtabs/actions)

## 🚀 Tech Stack

### Backend
- **Spring Boot 4.0.1** - Latest stable release
- **Java 21** - LTS version
- **PostgreSQL 16** - Primary database
- **Redis 7** - Caching layer
- **Maven 3.9+** - Build tool
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Flyway** - Database migrations
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Next.js 16.1** - React framework with Turbopack
- **React 19** - UI library
- **TypeScript 5.7+** - Type safety
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - UI components
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipelines

## 📋 Features

- 🔐 **User Authentication** - Secure JWT-based auth system
- 🎵 **Tab Management** - Create, browse, and manage guitar tabs
- 🔍 **Advanced Search** - Search by artist, title, or difficulty
- 📊 **Trending Content** - Discover popular tabs
- 👤 **User Profiles** - Manage your tabs and account
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 📱 **Mobile-Friendly** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Optimized with caching and indexing

## 🏗️ Project Structure

```
findUtabs/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/findutabs/
│   │   │   │   ├── config/    # Configuration classes
│   │   │   │   ├── controller/ # REST controllers
│   │   │   │   ├── service/    # Business logic
│   │   │   │   ├── repository/ # Data access layer
│   │   │   │   ├── model/      # JPA entities
│   │   │   │   ├── dto/        # Data transfer objects
│   │   │   │   ├── security/   # Security components
│   │   │   │   └── exception/  # Exception handlers
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/ # Flyway migrations
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── store/             # State management
│   │   └── types/             # TypeScript types
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.ts
├── .github/
│   └── workflows/             # CI/CD pipelines
├── docker-compose.yml
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Java 21** or higher
- **Node.js 20** or higher
- **Maven 3.9+**
- **Docker & Docker Compose** (optional, for containerized deployment)
- **PostgreSQL 16** (if not using Docker)
- **Redis 7** (if not using Docker)

### Installation

#### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/BrianZamacona/findUtabs.git
   cd findUtabs
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

#### Option 2: Manual Setup

**Backend Setup:**

1. **Configure PostgreSQL and Redis**
   - Create a database named `findutabs`
   - Ensure PostgreSQL is running on port 5432
   - Ensure Redis is running on port 6379

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your configuration**

5. **Build and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

**Frontend Setup:**

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Copy environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run lint
npm run build
```

## 📚 API Documentation

After starting the backend, visit:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Tabs:**
- `GET /api/tabs` - List all tabs (paginated)
- `GET /api/tabs/{id}` - Get tab by ID
- `POST /api/tabs` - Create new tab (authenticated)
- `DELETE /api/tabs/{id}` - Delete tab (authenticated)
- `GET /api/tabs/search/artist?artist={name}` - Search by artist
- `GET /api/tabs/search/title?title={name}` - Search by title
- `GET /api/tabs/top` - Get top 10 tabs

**Users:**
- `GET /api/users/me` - Get current user profile
- `GET /api/users/{id}` - Get user by ID

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Encrypted password
- `role` - User role (USER, ADMIN)
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### Tabs Table
- `id` - Primary key
- `title` - Song title
- `artist` - Artist name
- `difficulty` - Difficulty level (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `tuning` - Guitar tuning (default: Standard)
- `user_id` - Foreign key to users
- `file_url` - Tab file location
- `views` - View count
- `created_at` - Upload timestamp
- `updated_at` - Last update timestamp

## 🔐 Security

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for frontend integration
- Secure session management
- SQL injection prevention with JPA
- XSS protection with Spring Security

## 🎨 UI Components

Built with **shadcn/ui** components:
- Button
- Input
- Card
- Label
- And more...

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd backend
mvn clean package -DskipTests
java -jar target/findutabs-backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Docker Production
```bash
docker-compose up -d
```

## 🛣️ MVP Roadmap

- [x] User authentication & authorization
- [x] Basic tab CRUD operations
- [x] Tab browsing & search
- [x] User profiles
- [x] View tracking
- [ ] Tab rating system
- [ ] Comments & discussions
- [ ] Favorites/bookmarks
- [ ] Advanced tab editor
- [ ] Audio playback
- [ ] Social features (follow users)
- [ ] Tab versions & history
- [ ] Mobile apps

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Brian Zamacona** - Initial work - [BrianZamacona](https://github.com/BrianZamacona)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Next.js team for the amazing React framework
- shadcn for the beautiful UI components
- The open-source community

## 📞 Support

For support, please open an issue on GitHub or contact support@findutabs.com

---

**Happy playing! 🎸**
