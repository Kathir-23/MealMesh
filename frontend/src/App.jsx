import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Nav from './components/Nav'
import About from './pages/About'
import Donors from './pages/Donors'
import Organizations from './pages/Organizations'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import DonorDashboard from './pages/DonorDashboard'
import OrgDashboard from './pages/OrgDashboard'
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import ErrorBoundary from './components/ErrorBoundary';
import FoodSafety from './pages/FoodSafety';
// Uncomment as you implement these features:
// import Analytics from './pages/Analytics';
// import DonationMap from './pages/DonationMap';

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/donor/dashboard" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
        <Route path="/organization/dashboard" element={<ProtectedRoute><OrgDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/food-safety" element={<FoodSafety />} />
        
        {/* Uncomment as you implement these pages */}
        {/* <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} /> */}
        {/* <Route path="/donation-map" element={<DonationMap />} /> */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
