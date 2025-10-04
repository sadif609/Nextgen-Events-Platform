# NextGen Events Frontend

A modern React-based event management system built with Vite.

## Features

- 🎫 **Event Management**: Create, edit, and delete events
- 🖼️ **Flexible Image Upload**: Support for both file uploads and image URLs
- 🔐 **User Authentication**: Sign up, sign in, and profile management
- 📱 **Responsive Design**: Mobile-friendly interface
- 🔍 **Event Search**: Find events by title, description, or venue

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup
Make sure your backend server is running on `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Bootstrap, Custom CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **Image Handling**: Multer (backend), File Upload + URL support+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
