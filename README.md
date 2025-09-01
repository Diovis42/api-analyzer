# API Analyzer - AutoStore Monitoring Dashboard

A comprehensive web application for monitoring and analyzing AutoStore automated storage systems using the Unify API.

## Features

- 🔐 **Secure Authentication** with Supabase Auth
- 📊 **Comprehensive Monitoring** across 7 dashboard sections
- 🤖 **Robot Analytics** - Fleet performance and MTBF tracking
- ⚡ **Port Operations** - Throughput and efficiency metrics
- 🔋 **Battery Management** - Charging cycles and health monitoring
- 📦 **Grid & Bins** - Storage optimization and content analysis
- 📈 **Performance Metrics** - KPIs, trends, and benchmarking
- 🔴 **Live Data** - Real-time events via WebSocket
- 🚀 **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS

## Quick Start

1. **Deploy with Dokploy**:
   - Create new project in Dokploy
   - Connect this repository
   - Set environment variables (see CLAUDE.md)
   - Deploy using docker-compose.yml

2. **Configure Environment**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DOMAIN=your-domain.com
   ```

3. **Add Users**:
   - Create users manually in Supabase Dashboard
   - Users can then add their AutoStore installations

## Documentation

See [CLAUDE.md](./CLAUDE.md) for comprehensive setup instructions, configuration details, and deployment guide.

## Architecture

- **Frontend**: Next.js 14 with App Router + TypeScript
- **Database**: Supabase PostgreSQL with RLS
- **Authentication**: Supabase Auth (manual user creation)
- **Deployment**: Docker Compose + Dokploy
- **API Integration**: Secure proxy to Unify API

## Support

Built for monitoring AutoStore systems through the Unify API. Supports all 35+ Unify API endpoints with secure token management and real-time WebSocket integration.