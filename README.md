# GK Affiliation Reports

A modern, responsive web application for viewing and analyzing GK affiliation reports with advanced filtering, pagination, and data visualization capabilities.

## 🚀 Features

### **Core Functionality**
- **Dynamic Form Interface**: Interactive form with code input, date range selection, and report type filtering
- **Dual View Modes**: Toggle between detailed reports and summary statistics views
- **Advanced Tab Navigation**: Beautiful tabs interface for seamless switching between report types
- **Real-time Data Fetching**: Efficient API integration with React Query for optimal performance

### **User Experience**
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Complete dark theme implementation with seamless switching
- **Loading States**: Beautiful loading indicators and skeleton screens
- **Error Handling**: Comprehensive error messages with user-friendly displays
- **URL State Management**: Persistent state through URL parameters for bookmarkable views

### **Data Management**
- **Pagination**: Advanced pagination with customizable page sizes
- **Data Filtering**: Filter by code, date range, and report type (Sales/Registration)
- **Sorting**: Column-wise sorting with visual indicators
- **Export Capabilities**: Download reports in various formats

## 🛠 Technology Stack

- **Frontend Framework**: Next.js 16.0.1 with App Router
- **UI Components**:
  - Radix UI for accessible, unstyled components
  - Tailwind CSS v4 for modern, utility-first styling
  - Shadcn/ui for component library
- **Data Fetching**: TanStack Query v5.90.7 for server state management
- **Form Handling**: React Hook Form v7.66.0 with Zod v4.1.12 validation
- **Authentication**: NextAuth v5.0.0-beta.30
- **Styling**: Tailwind CSS v4 with custom design system
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns v4.1.0, dayjs v1.11.19, react-day-picker v9.11.1
- **HTTP Client**: Axios v1.13.2
- **State Management**: nuqs v2.8.1 for URL state management
- **Type Safety**: Full TypeScript v5.9.3 implementation

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm (pnpm recommended for this project)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gk-affiliation
   ```

2. **Install dependencies**
   ```bash
   # Recommended (this project uses pnpm)
   pnpm install

   # Alternative options
   npm install
   yarn install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   # Recommended
   pnpm dev

   # Alternative options
   npm run dev
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Project Structure

```
gk-affiliation/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page component
├── components/                   # React components
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   └── ...                  # More UI components
│   ├── AffiliationPageContent.tsx  # Main page content component
│   ├── DataForm.tsx             # Form component for data input
│   ├── DataTable.tsx            # Detailed reports table
│   ├── SummaryTable.tsx         # Summary statistics table
│   └── DatePicker.tsx           # Custom date picker component
├── hooks/                        # Custom React hooks
│   ├── useAffiliationUsers.ts   # Hook for detailed reports data
│   └── useAffiliationSummary.ts # Hook for summary data
├── lib/                         # Utility functions and configurations
│   └── utils.ts                 # Utility functions
├── providers/                    # React context providers
│   └── provider.tsx             # App-level providers
├── schemas/                     # Form and data validation schemas
│   └── formSchema.ts            # Zod validation schema
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Global type definitions
├── utils/                       # Additional utility functions
│   └── api.ts                   # API-related utilities
├── constants/                   # Application constants
│   └── index.ts                 # Constants definitions
├── public/                      # Static assets
│   └── next.svg                 # Next.js icon
├── auth.ts                      # NextAuth configuration
├── components.json              # shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application Configuration
AUTH_SECRET="w4YIdK5BFV0NdyBVvls4GZZxM0l5m4dVypGO8izuCMs="
NEXT_PUBLIC_API_BASE_URL="https://affiliation-api.gktechbd.com/api/v1"
```

### Configuration Files

The project includes several important configuration files:

- **`next.config.ts`**: Next.js configuration with TypeScript support
- **`tsconfig.json`**: TypeScript compiler configuration with strict mode enabled
- **`eslint.config.mjs`**: ESLint configuration with Next.js and TypeScript rules
- **`postcss.config.mjs`**: PostCSS configuration for Tailwind CSS
- **`components.json`**: Shadcn/ui component library configuration
- **`auth.ts`**: NextAuth configuration for authentication

### Tailwind Configuration

The project uses Tailwind CSS v4 with:

- Extended color palette for consistent theming
- Custom animations and transitions with tw-animate-css
- Responsive breakpoints optimization
- Dark mode support
- CSS variables for dynamic theming

## 🎨 UI/UX Features

### **Form Interface**
- **Inline Layout**: Code, from date, and to date fields displayed horizontally
- **Smart Validation**: Real-time form validation with user-friendly error messages
- **Type Selection**: Radio buttons for Sales/Registration report types
- **Summary Toggle**: Interactive switch for summary/detailed views

### **Tab Navigation**
- **Beautiful Design**: Modern tabs with icons and smooth transitions
- **Active State Indicators**: Clear visual feedback for selected tabs
- **Hover Effects**: Interactive hover states for enhanced UX
- **Responsive Layout**: Tabs adapt to different screen sizes

### **Data Tables**
- **Sortable Columns**: Click headers to sort data
- **Pagination Controls**: Navigate through large datasets efficiently
- **Responsive Design**: Tables work on all device sizes
- **Loading States**: Skeleton loaders during data fetching
- **Empty States**: Friendly messages when no data is available

## 🔄 State Management

### **URL Persistence**
All form state is persisted in URL parameters:
- `/` - Default view
- `/?code=ABC&start_date=2024-01-01&summary=true&page=2` - Filtered and paginated view

### **React Query Integration**
- **Caching**: Intelligent data caching for improved performance
- **Background Updates**: Automatic data refetching when parameters change
- **Error Handling**: Comprehensive error state management
- **Optimistic Updates**: Smooth user experience during data operations

## 📱 Responsive Design

The application features a mobile-first responsive design:

- **Mobile**: Stacked layout with optimized touch targets
- **Tablet**: Adjusted spacing and component sizing
- **Desktop**: Full-featured interface with optimal use of screen space

## 🌙 Dark Mode

Complete dark theme implementation:
- **System Detection**: Automatically detects user's preferred color scheme
- **Manual Toggle**: User can manually switch between light and dark modes
- **Consistent Styling**: All components properly styled for both themes
- **Smooth Transitions**: Smooth color transitions when switching themes

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Optimized image loading and serving
- **Bundle Optimization**: Optimized JavaScript bundles
- **Caching Strategy**: Intelligent caching for API responses
- **Lazy Loading**: Components loaded only when needed

## 🔒 Type Safety

Full TypeScript implementation with:
- **Strict Type Checking**: Comprehensive type coverage
- **API Type Definitions**: Typed API responses and requests
- **Form Validation**: Type-safe form handling
- **Component Props**: Fully typed component interfaces

## 🧪 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
pnpm dev             # Start development server (recommended)

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
pnpm lint            # Run ESLint
```

### **Code Style**

The project follows a strict code style:
- **ESLint**: Configured with Next.js and TypeScript rules
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Component Library**: Uses shadcn/ui for consistent design system
- **Path Aliases**: Uses `@/` prefix for cleaner imports

### **Authentication**

The application includes authentication setup with:
- **NextAuth**: Configured for authentication
- **Session Management**: Secure session handling
- **Type Safety**: Fully typed authentication context

## 📚 API Integration

The application integrates with a RESTful API for:

- **Reports Data**: Fetching detailed and summary affiliation reports
- **Data Filtering**: Server-side filtering and pagination
- **Error Handling**: Comprehensive API error responses
- **Data Validation**: Client-side and server-side validation

## 🐛 Troubleshooting

### **Common Issues**

1. **Development Server Won't Start**
   - Ensure all dependencies are installed
   - Check if port 3000 is available
   - Verify Node.js version (18+)

2. **Build Errors**
   - Run `npm run type-check` to check for TypeScript errors
   - Ensure all environment variables are set
   - Check for missing dependencies

3. **API Issues**
   - Verify API endpoint configuration
   - Check network connectivity
   - Review API response format

## 🤝 Contributing

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
