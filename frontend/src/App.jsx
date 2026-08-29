import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import AdminCategories from "./pages/AdminCategories";



// ======================================================
// PROTECTED ADMIN ROUTE
// ======================================================

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged-in customer trying to access admin
  if (user?.role !== "admin") {
    return <Navigate to="/events" replace />;
  }

  return children;
}

// ======================================================
// NAVBAR
// ======================================================

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error("User data error:", error);
  }

  const isAdmin = user?.role === "admin";

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="navbar">

      {/* ================================================
          BACK BUTTON
      ================================================ */}

      {location.pathname !== "/" && (
        <button
          type="button"
          className="back-btn"
          onClick={handleBack}
        >
          ← Back
        </button>
      )}

      {/* ================================================
          LOGO
      ================================================ */}

      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        Event<span>Hub</span>
      </div>

      {/* ================================================
          NAV LINKS
      ================================================ */}

      <div className="nav-links">

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => navigate("/events")}
        >
          Events
        </button>

        {/* MY BOOKINGS - LOGGED IN USERS */}

        {token && !isAdmin && (
          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              navigate("/my-bookings")
            }
          >
            My Bookings
          </button>
        )}

        {/* ADMIN PANEL - ADMIN ONLY */}

        {token && isAdmin && (
          <button
            type="button"
            className="nav-link-button"
            onClick={() =>
              navigate("/admin")
            }
          >
            Admin Panel
          </button>
        )}

        <a href="/#about">
          About
        </a>

        <a href="/#contact">
          Contact
        </a>

      </div>

      {/* ================================================
          RIGHT SIDE
      ================================================ */}

      <div className="nav-buttons">

        {token ? (
          <>
            <span className="welcome-user">
              Hi, {user?.name || "User"}
            </span>

            {/* ADMIN LABEL */}

            {isAdmin && (
              <span className="admin-badge">
                Admin
              </span>
            )}

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="login-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>

            <button
              type="button"
              className="register-btn"
              onClick={() =>
                navigate("/register")
              }
            >
              Register
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ==================================================
            HOME
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================================================
            REGISTER
        ================================================== */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================================================
            EVENTS
        ================================================== */}

        <Route
          path="/events"
          element={<Events />}
        />

        {/* ==================================================
            EVENT DETAILS
        ================================================== */}

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        {/* ==================================================
            MY BOOKINGS
        ================================================== */}

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        {/* ==================================================
                ADMIN
                ADMIN ONLY
            ================================================== */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/create-event"
              element={
                <AdminRoute>
                  <CreateEvent />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/edit-event/:id"
              element={
                <AdminRoute>
                  <EditEvent />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />

            

        {/* ==================================================
            UNKNOWN ROUTE
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}



// ======================================================
// HOME PAGE
// ======================================================

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error("User data error:", error);
  }

  const isAdmin = user?.role === "admin";

 const handleCreateEvent = () => {
  if (token && isAdmin) {
    navigate("/admin");
    return;
  }

  if (token && !isAdmin) {
    alert("Only administrators can create events.");
    return;
  }

  navigate("/login");
};

  return (
    <div className="app">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-tag">
            ✨ Discover. Connect. Experience.
          </p>

          <h1>
            Find Events That
            <br />
            <span>Inspire You</span>
          </h1>

          <p className="hero-text">
            Discover amazing events, connect with
            people, and create unforgettable
            experiences.
          </p>

          <div className="hero-buttons">

          {/* EXPLORE EVENTS - EVERYONE */}
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/events")}
          >
            Explore Events →
          </button>

          {/* CREATE EVENT - ADMIN ONLY */}
          {token && isAdmin && (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/admin/create-event")}
            >
              Create Event
            </button>
          )}

        </div>

        </div>

        {/* HERO CARD */}

        <div className="hero-card">

          <div className="floating-card card-one">

            🎤

            <div>
              <strong>
                Tech Conferences
              </strong>

              <small>
                50+ Events
              </small>
            </div>

          </div>

          <div className="floating-card card-two">

            🎵

            <div>
              <strong>
                Music & Entertainment
              </strong>

              <small>
                100+ Events
              </small>
            </div>

          </div>

          <div className="hero-circle">
            🎟️
          </div>

        </div>

      </section>

      {/* ==================================================
          CATEGORIES
      ================================================== */}

      <section className="categories">

        <p className="section-label">
          EXPLORE
        </p>

        <h2>
          Event Categories
        </h2>

        <div className="category-grid">

          <div className="category-card">
            <div className="category-icon">
              💻
            </div>

            <h3>
              Technology
            </h3>

            <p>
              Conferences, workshops & tech events
            </p>
          </div>

          <div className="category-card">

            <div className="category-icon">
              🎵
            </div>

            <h3>
              Music
            </h3>

            <p>
              Concerts, festivals & live performances
            </p>

          </div>

          <div className="category-card">

            <div className="category-icon">
              🎨
            </div>

            <h3>
              Arts & Culture
            </h3>

            <p>
              Exhibitions, shows & cultural events
            </p>

          </div>

          <div className="category-card">

            <div className="category-icon">
              🏢
            </div>

            <h3>
              Business
            </h3>

            <p>
              Networking, seminars & conferences
            </p>

          </div>

        </div>

      </section>

      {/* ==================================================
          ABOUT
      ================================================== */}

      <section
        className="about"
        id="about"
      >

        <div>

          <p className="section-label">
            ABOUT EVENTHUB
          </p>

          <h2>
            Making Event Discovery
            <span>
              {" "}Simple & Exciting
            </span>
          </h2>

        </div>

        <p>
          EventHub brings events and people
          together. Browse upcoming events,
          discover new experiences, and book
          your spot in just a few clicks.
        </p>

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer id="contact">

        <div className="logo">
          Event<span>Hub</span>
        </div>

        <p>
          © 2026 EventHub. All rights reserved.
        </p>

        <div className="footer-links">

          <a href="/#events">
            Events
          </a>

          <a href="/#about">
            About
          </a>

          <a href="/#contact">
            Contact
          </a>

        </div>

      </footer>

    </div>
  );
}

export default App;


