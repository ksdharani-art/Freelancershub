import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context";
import Navbar from "./components/Navbar";

// Import all pages
import Login from "./pages/login";
import Projects from "./pages/projects";
import ProjectDetails from "./pages/project-details";
import DashboardClient from "./pages/dashboard-client";
import DashboardFreelancer from "./pages/dashboard-freelancer";
import Chat from "./pages/chat";
import SubmitReview from "./pages/submit-review";
import Admin from "./pages/admin";

function MainApp() {
  const { user } = useApp();
  const [hash, setHash] = useState(window.location.hash || "#/login");

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || "#/login");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Parse hash router paths
  const parseRoute = () => {
    const path = hash.replace("#", "") || "/login";

    // Exact matches
    if (path === "/login") return { route: "/login" };
    if (path === "/signup") return { route: "/signup" };
    if (path === "/projects") return { route: "/projects" };
    if (path === "/dashboard/client") return { route: "/dashboard/client" };
    if (path === "/dashboard/freelancer") return { route: "/dashboard/freelancer" };
    if (path === "/admin") return { route: "/admin" };

    // Parameterized routes
    // 1. /projects/:id
    const projectDetailsMatch = path.match(/^\/projects\/([^/]+)$/);
    if (projectDetailsMatch) {
      return { route: "/projects/:id", params: { id: projectDetailsMatch[1] } };
    }

    // 2. /project/:id/chat
    const chatMatch = path.match(/^\/project\/([^/]+)\/chat$/);
    if (chatMatch) {
      return { route: "/project/:id/chat", params: { id: chatMatch[1] } };
    }

    // 3. /project/:id/submit
    const submitMatch = path.match(/^\/project\/([^/]+)\/submit$/);
    if (submitMatch) {
      return { route: "/project/:id/submit", params: { id: submitMatch[1] } };
    }

    // Fallback
    return { route: "/login" };
  };

  const parsed = parseRoute();

  // Navigation Guard / Authentication Redirects
  useEffect(() => {
    if (!user) {
      // Allow signup or login
      if (parsed.route !== "/login" && parsed.route !== "/signup") {
        window.location.hash = "#/login";
      }
    } else {
      // Redirect if visiting login/signup while already authenticated
      if (parsed.route === "/login" || parsed.route === "/signup") {
        if (user.role === "client") {
          window.location.hash = "#/dashboard/client";
        } else if (user.role === "admin") {
          window.location.hash = "#/admin";
        } else {
          window.location.hash = "#/projects";
        }
      }
    }
  }, [user, parsed.route]);

  // Page renderer helper
  const renderPage = () => {
    switch (parsed.route) {
      case "/login":
        return <Login mode="login" />;
      case "/signup":
        return <Login mode="signup" />;
      case "/projects":
        return <Projects />;
      case "/projects/:id":
        return <ProjectDetails projectId={parsed.params?.id} />;
      case "/dashboard/client":
        return <DashboardClient />;
      case "/dashboard/freelancer":
        return <DashboardFreelancer />;
      case "/project/:id/chat":
        return <Chat projectId={parsed.params?.id} />;
      case "/project/:id/submit":
        return <SubmitReview projectId={parsed.params?.id} />;
      case "/admin":
        return <Admin />;
      default:
        return <Login mode="login" />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex-grow-1">
        {renderPage()}
      </div>
      {/* Dynamic background aesthetics */}
      <footer className="py-4 text-center mt-auto border-top bg-white" style={{ fontSize: "12px", color: "var(--fh-slate)" }}>
        <div className="container">
          <p>© {new Date().getFullYear()} FreelanceHub Inc. Designed for evaluations & demonstration.</p>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
