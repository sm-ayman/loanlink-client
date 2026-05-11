# LoanLink Client

A modern, responsive React frontend for the LoanLink microloan management system built with Vite, React Router, and Tailwind CSS.

## 🔗 Live Site
[Live Demo](https://loanlink-client.netlify.app/)

## 🔐 Credentials for Testing

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@loanlink.com` | `admin123` |
| **Manager** | `manager@loanlink.com` | `Manager#123` |



## 🚀 Features

- **Modern UI**: Built with React 19, Tailwind CSS, and DaisyUI components
- **Authentication**: Firebase Authentication with JWT integration
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Theme Support**: Dark/Light mode toggle functionality
- **Loan Management**: Complete loan browsing and application system
- **Dashboard System**: Role-based dashboards for Admin, Manager, and Borrower
- **Real-time Updates**: Dynamic content loading and state management
- **Payment Integration**: Stripe payment processing for application fees

## 🛠 Tech Stack

- **Framework**: React 19 with Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: React Context API
- **Authentication**: Firebase Auth + JWT
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form
- **Animations**: Framer Motion

## 📁 Project Structure

```
loan-link-client/
├── public/
│   ├── loans.json          # Static loan data
│   ├── users.json          # Static user data
│   ├── applications.json   # Static application data
│   └── payments.json       # Static payment data
├── src/
│   ├── components/
│   │   ├── common/         # Reusable components
│   │   ├── home/           # Home page components
│   │   └── loans/          # Loan-related components
│   ├── context/            # React Context providers
│   ├── firebase/           # Firebase configuration
│   ├── pages/              # Page components
│   │   ├── dashboard/      # Dashboard pages by role
│   │   └── ...             # Other pages
│   ├── routes/             # Routing configuration
│   ├── utils/              # Utility functions and API client
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── .env.local              # Environment variables
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone and Install**
   ```bash
   cd loan-link-client
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` file with Firebase configuration:
   ```env
   VITE_apiKey=your_firebase_api_key
   VITE_authDomain=your_project.firebaseapp.com
   VITE_projectId=your_project_id
   VITE_storageBucket=your_project.appspot.com
   VITE_messagingSenderId=your_sender_id
   VITE_appId=your_app_id
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
npm run preview
```

## 🔐 Authentication

The app supports multiple authentication methods:
- Email/Password registration and login
- Google OAuth login
- GitHub OAuth login
- Super admin bypass for testing

## 👥 User Roles

### Borrower (Default)
- Browse available loans
- Submit loan applications
- View application status
- Make payments for application fees

### Manager (Loan Officer)
- All borrower permissions
- Create and manage loans
- Approve/reject loan applications
- View approved applications

### Admin
- All manager permissions
- User role management
- Suspend/unsuspend users
- View all applications and statistics

## 📱 Pages & Features

### Public Pages
- **Home**: Hero section, available loans, how it works, testimonials
- **All Loans**: Browse all available loans with filtering
- **Loan Details**: Detailed loan information with application form
- **Login/Register**: Authentication pages

### Dashboard Pages (Role-based)
- **Profile**: User profile management
- **Borrower Dashboard**: My loan applications, payment management
- **Manager Dashboard**: Loan management, application approval
- **Admin Dashboard**: User management, system administration

## 🎨 UI Components

- **Responsive Navbar**: With theme toggle and user menu
- **Loan Cards**: Consistent card design for loan display
- **Data Tables**: Sortable tables with pagination
- **Modals**: Reusable modal components for forms and details
- **Loading States**: Spinners and skeleton loaders
- **Toast Notifications**: Success/error feedback

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- ESLint configuration for code quality
- Prettier for consistent formatting
- Component-based architecture
- Custom hooks for reusable logic

## 🌐 Deployment

### Netlify/Vercel Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables in deployment settings
4. Add your domain to Firebase authorized domains

### Environment Variables for Production
```env
VITE_API_URL=https://your-api-domain.com/api
# Firebase config (same as development)
```

## 📞 Support

For development support:
- Check component documentation in code comments
- Review Firebase console for auth issues
- Check browser console for debugging
- Ensure API server is running for full functionality

## 📄 License

This project is part of the LoanLink assignment submission.

---

**Built with ❤️ using React & Vite**