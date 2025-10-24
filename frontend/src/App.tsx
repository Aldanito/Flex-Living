import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import { ConditionalHeader } from "./components/ConditionalHeader";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { Dashboard } from "./pages/Dashboard";
import { ReviewDisplay } from "./pages/ReviewDisplay";
import { Properties } from "./pages/Properties";
import { PropertiesList } from "./pages/PropertiesList";
import PropertyDetails from "./pages/PropertyDetails";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <ScrollToTop />
          <div className="flex-bg min-h-screen flex flex-col">
            <ConditionalHeader />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties" element={<PropertiesList />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />

                {/* Review Display - Public route for showing approved reviews */}
                <Route
                  path="/review-display/:listingId"
                  element={<ReviewDisplay />}
                />
                <Route path="/reviews/:listingId" element={<ReviewDisplay />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Legacy route for old properties page */}
                <Route path="/admin/properties" element={<Properties />} />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
