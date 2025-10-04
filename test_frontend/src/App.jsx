import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';

// Events
import AddEvent from './pages/AddEvent';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvent';
import UserEvents from './pages/UserEvents';

// Registration & Auth
import Registration from './pages/Registration';
import AuthCallback from './pages/AuthCallback';
import ResetPassword from './pages/ResetPassword';

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route path="/add-event" element={<PrivateRoute><AddEvent /></PrivateRoute>} />
              <Route path="/my-events" element={<PrivateRoute><UserEvents /></PrivateRoute>} />
              <Route path="/added-events" element={<PrivateRoute><UserEvents /></PrivateRoute>} />
              <Route path="/edit-event/:id" element={<PrivateRoute><EditEvent /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;