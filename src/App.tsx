import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import SeatBooking from "./pages/SeatBooking";
import Payment from "./pages/Payment";
import Bookings from "./pages/Bookings";
import Footer from "./components/Footer";
import FAQs from "./components/FAQs";
import ContactUs from "./components/ContactUs";
import HelpCenter from "./components/HelpCenter";
import Concerts from "./components/Concerts";
import ConcertDetail from "./pages/ConcertDetail";
import Sports from "./components/Sports";
import TheatreAndArts from "./components/TheatresAndArts";
import OffersOnMovies from "./components/OffersOnMovies";
import NowShowing from "./components/NowShowing";
import ComingSoon from "./components/ComingSoon";
import Chatbot from "./components/Chatbot";
import LocationDropdownDemo from "./components/LocationDropdownDemo";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="mt-0 sm:pt-15 md:pt-12 lg:pt-14">
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route
                path="/booking/:type/:id/:showTimeId"
                element={
                  <ProtectedRoute>
                    <SeatBooking />
                  </ProtectedRoute>
                }
              />
              <Route path="/concert/:id" element={<ConcertDetail />} />
              <Route path="/booking/theatre/:id/:showTimeId" element={<ProtectedRoute><SeatBooking /></ProtectedRoute>} />
              <Route
                path="/payment/:bookingId"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route path="/help" element={<HelpCenter />} />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route path="/faq" element={<FAQs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/concerts" element={<Concerts />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/theatresandarts" element={<TheatreAndArts />} />
              <Route path="/offers" element={<OffersOnMovies />} />
              <Route path="/now-showing" element={<NowShowing />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/location-dropdown" element={<LocationDropdownDemo />} />
            </Routes>
            <Chatbot />
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
