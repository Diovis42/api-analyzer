# API Analyzer - AutoStore Monitoring Dashboard

## Project Overview

API Analyzer is a comprehensive web application for monitoring and analyzing AutoStore automated storage systems using the Unify API. The application provides real-time dashboards, analytics, and insights for system operators and managers.

## Architecture

- **Frontend**: Next.js 14 with App Router + TypeScript
- **Authentication**: Supabase Auth (manual user creation only)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Deployment**: Docker Compose + Dokploy
- **Styling**: Tailwind CSS + shadcn/ui components
- **API Integration**: Proxy to Unify API for security

## Database Schema

The application uses the following main tables in Supabase:

### `installations`
- Stores user access to AutoStore installations
- Links users to their installation IDs and API tokens
- Includes installation metadata and credentials

### `api_requests` 
- Logs all API requests for monitoring and debugging
- Tracks response times, status codes, and errors
- Used for usage analytics and performance monitoring

### `dashboards`
- Stores custom dashboard configurations
- Allows users to create personalized views
- Supports JSON configuration for flexibility

### `live_connections`
- Tracks WebSocket connections for live data
- Monitors connection status and activity
- Manages real-time data streams

## Key Features

### 🔐 Secure Authentication
- Supabase Auth with email/password
- Manual user creation (no self-registration)
- Row Level Security for data isolation
- Secure API token management

### 📊 Comprehensive Monitoring
- **System Status**: Real-time system health and uptime
- **Robot Analytics**: Fleet performance, errors, and MTBF
- **Port Operations**: Throughput, wait times, and efficiency
- **Battery Management**: Charging cycles, health, and alerts
- **Grid & Bins**: Occupancy, content codes, and quality
- **Performance Metrics**: KPIs, trends, and benchmarking
- **Live Data**: Real-time events via WebSocket

### 🔌 Unify API Integration
- Supports all 35+ Unify API endpoints
- Secure API proxy protects tokens from frontend
- Automatic request logging and monitoring
- WebSocket integration for live events

### 🚀 Modern Tech Stack
- Next.js 14 with App Router for optimal performance
- TypeScript for type safety
- Tailwind CSS + shadcn/ui for modern UI
- Docker containerization for easy deployment

## Installation & Setup

### 1. Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- Supabase account and project
- Unify API access tokens

### 2. Environment Configuration

Copy the environment example and configure:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nvittugsnjvytppxwnqz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52aXR0dWdzbmp2eXRwcHh3bnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjM1NTQsImV4cCI6MjA3MjI5OTU1NH0.Bigt58_fCqmgEgaaBg2_2_GmGDxPHeqtFx9j1eKfk2o
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Configuration  
NEXTAUTH_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Optional: Default Unify API token (can be set per installation)
DEFAULT_UNIFY_API_TOKEN=your-unify-api-token
```

### 3. Development Setup

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Database Setup

The database schema is already created in the Supabase project "API Analyzer" (ID: nvittugsnjvytppxwnqz).

To verify or recreate the schema, the migration files contain:
- Table creation with proper types and constraints
- Row Level Security policies
- Indexes for performance
- Trigger functions for updated_at timestamps

### 5. User Management

Since self-registration is disabled, users must be created manually in Supabase:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Invite user" or "Add user"
3. Enter user email and temporary password
4. User can then log in and change password

## Deployment with Dokploy

### 1. Prepare Environment Variables

Create a `.env.production` file or set environment variables in Dokploy:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nvittugsnjvytppxwnqz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52aXR0dWdzbmp2eXRwcHh3bnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjM1NTQsImV4cCI6MjA3MjI5OTU1NH0.Bigt58_fCqmgEgaaBg2_2_GmGDxPHeqtFx9j1eKfk2o
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXTAUTH_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
NEXTAUTH_URL=https://your-domain.com
DOMAIN=your-domain.com
```

### 2. Dokploy Deployment Steps

1. **Create New Project in Dokploy**
   - Select "Docker Compose" as the service type
   - Connect your Git repository

2. **Configure Repository**
   - Repository: Your Git repository URL
   - Branch: `main` or your deployment branch
   - Compose Path: `./docker-compose.yml`

3. **Set Environment Variables**
   - Add all required environment variables in Dokploy UI
   - Ensure `DOMAIN` matches your intended domain

4. **Configure Domain**
   - Set up your domain A record to point to Dokploy server
   - Dokploy will automatically handle SSL certificates via Let's Encrypt

5. **Deploy**
   - Click "Deploy" in Dokploy
   - Monitor deployment logs
   - Application will be available at your configured domain

### 3. Docker Compose Configuration

The `docker-compose.yml` is pre-configured for Dokploy with:

- **Traefik Integration**: Automatic HTTPS and routing
- **Health Checks**: Application health monitoring
- **Network Configuration**: Uses `dokploy-network`
- **Environment Variables**: Production-ready configuration

## Usage Guide

### 1. Initial Login

1. Navigate to your deployed application
2. Use the login page with credentials created in Supabase
3. You'll be redirected to the dashboard

### 2. Adding Installations

1. Go to Dashboard (you'll see "No installations found" initially)
2. Click "Add Installation" (you'll need to implement this page)
3. Add your installation details:
   - Installation ID (from your AutoStore system)
   - Installation Name (friendly name)
   - Unify API Token (from Unify dashboard)

### 3. Viewing Analytics

Navigate through the different sections:
- **Overview**: High-level system status and metrics
- **System Status**: Detailed system health and module info
- **Robots**: Fleet analytics and individual robot performance
- **Ports**: Port operations and efficiency metrics
- **Battery & Charging**: Power management and charging analytics
- **Grid & Bins**: Storage optimization and content analysis
- **Performance**: KPIs, trends, and benchmarking
- **Live Data**: Real-time events and system monitoring

## API Endpoints

The application provides several internal APIs:

### Authentication
- `GET /api/auth` - Check authentication status
- `POST /api/auth` - Sign in/out operations

### Installations
- `GET /api/installations` - List user installations
- `POST /api/installations` - Add new installation

### Unify API Proxy
- `GET /api/unify/installations/{id}/*` - Proxy to Unify API
- Automatically handles authentication and logging
- Supports all Unify API endpoints

### WebSocket
- `GET /api/websocket?installation={id}` - Get WebSocket URL for live data

### Health Check
- `GET /api/health` - Application health status

## Monitoring & Debugging

### Request Logging
All API requests are logged in the `api_requests` table:
- Track usage patterns
- Monitor performance
- Debug issues
- Analyze response times

### Error Handling
- All API errors are properly logged
- User-friendly error messages
- Detailed error information for debugging

### Performance Monitoring
- Database query optimization with indexes
- API response time tracking
- Connection monitoring for WebSocket

## Customization

### Adding New Dashboard Sections
1. Create new page in `app/dashboard/[installation]/`
2. Add route to sidebar navigation
3. Implement data fetching from Unify API
4. Use existing UI components for consistency

### Extending API Integration
1. Add new endpoints to `lib/unify-api.ts`
2. Update TypeScript types in `types/unify.ts`
3. Implement in dashboard pages
4. Test with your Unify API tokens

### UI Customization
- Modify `tailwind.config.js` for theme changes
- Update `app/globals.css` for custom styles
- All components use shadcn/ui system for consistency

## Security Considerations

### API Token Security
- Tokens are stored server-side in Supabase
- Never exposed to client-side code
- Encrypted in database
- Per-installation token management

### Authentication
- Supabase Auth with secure sessions
- Row Level Security for data isolation
- No self-registration (admin-managed users)

### Network Security
- HTTPS enforced in production
- Secure headers via Traefik
- CORS properly configured

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Verify `.env.local` exists and has correct values
   - Check Dokploy environment variable configuration
   - Restart the application after changes

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check database migrations are applied
   - Ensure Row Level Security policies are active

3. **Unify API Errors**
   - Verify API tokens are valid
   - Check installation IDs match your systems
   - Monitor rate limits (100 requests per 5 minutes)

4. **WebSocket Connection Issues**
   - Ensure Unify Connect version 1.6.3+
   - Verify live data is enabled for installation
   - Check token permissions for WebSocket access

### Logs and Debugging

- Application logs available in Docker containers
- Database logs in Supabase dashboard
- API request logs in `api_requests` table
- Dokploy provides deployment and runtime logs

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Lint code
npm run type-check      # TypeScript checking

# Database
# Use Supabase CLI or dashboard for database operations

# Docker
docker-compose up -d    # Run in Docker (development)
docker-compose down     # Stop Docker containers
```

## Support & Maintenance

### Updates
- Monitor Next.js, Supabase, and dependency updates
- Test thoroughly before deploying updates
- Keep Docker images updated for security

### Backup
- Supabase provides automatic backups
- Export important dashboard configurations
- Keep environment variables secure and backed up

### Monitoring
- Set up alerts for application errors
- Monitor API usage and rate limits
- Track database performance and storage

For technical support, refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Unify API Documentation: Your Unify dashboard
- Dokploy Documentation: https://dokploy.com/docs