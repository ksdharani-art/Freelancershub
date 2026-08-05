import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

// Preseeded Users
const MOCK_USERS = [
  { id: "u1", name: "Sarah Jenkins", email: "sarah@bakery.com", password: "password123", role: "client", company: "Sarah's Artisan Bakery" },
  { id: "u2", name: "Alex Rivera", email: "alex@developer.com", password: "password123", role: "freelancer", title: "Full Stack Engineer", rating: 4.9, earnings: 385000, skills: ["React", "Node.js", "MongoDB", "Tailwind CSS", "REST APIs"] },
  { id: "u3", name: "Admin User", email: "admin@freelancehub.com", password: "password123", role: "admin" }
];

// Preseeded Projects
const MOCK_PROJECTS = [
  { id: "p1", clientId: "u1", clientName: "Sarah Jenkins", title: "Artisan Bakery E-commerce Website", description: "Looking for an elegant, fast-loading Shopify or React site to showcase our sourdough breads, pastries, and take custom catering pre-orders. Must integrate with local payment gateways.", budget: 45000, category: "Web Development", status: "open", duration: "14 days", createdAt: "2026-08-01" },
  { id: "p2", clientId: "u1", clientName: "Sarah Jenkins", title: "Mobile App for Health & Fitness", description: "Design and build a React Native mobile app for calorie tracking and meal prep planning. Mock screens and wireframes are ready.", budget: 120000, category: "Mobile Apps", status: "completed", duration: "45 days", createdAt: "2026-06-15" },
  { id: "p3", clientId: "u1", clientName: "Sarah Jenkins", title: "Branding & Logo Pack for Eco-Startup", description: "Need a modern brand identity guideline, primary/secondary logos, color palette, and business cards for our organic farm product line.", budget: 25000, category: "Design & Creative", status: "in-progress", duration: "7 days", createdAt: "2026-08-02" }
];

// Preseeded Bids
const MOCK_BIDS = [
  { id: "b1", projectId: "p3", freelancerId: "u2", freelancerName: "Alex Rivera", amount: 22000, message: "Hi Sarah, I would love to build the branding assets for your eco-startup. I have worked with three agricultural brands in the past and can provide a cohesive design system in 5 days.", status: "accepted", days: 5, createdAt: "2026-08-03" }
];

// Preseeded Chat messages
const MOCK_CHATS = {
  p3: [
    { senderId: "u1", senderName: "Sarah Jenkins", message: "Hi Alex! Thanks for bidding. Your past logo designs look great.", timestamp: "2026-08-03T14:30:00.000Z" },
    { senderId: "u2", senderName: "Alex Rivera", message: "Thank you Sarah! I've already started mapping out some color palettes.", timestamp: "2026-08-03T14:32:00.000Z" }
  ]
};

// Preseeded Submissions
const MOCK_SUBMISSIONS = [
  { id: "s1", projectId: "p2", fileUrl: "fitness_app_v2.1_build.zip", submittedAt: "2026-07-28", status: "approved" }
];

// Preseeded Reviews
const MOCK_REVIEWS = [
  { id: "r1", projectId: "p2", reviewerId: "u1", rating: 5, comment: "Alex exceeded expectations! Code structure is super clean and the app runs smooth. Highly recommend." }
];

// Preseeded Notifications
const MOCK_NOTIFICATIONS = [
  { id: "n1", text: "Welcome to FreelanceHub! Set up your profile to start bidding.", read: false, time: "2 hours ago" },
  { id: "n2", text: "New Project Posted in Web Development: 'E-commerce Redesign'", read: false, time: "4 hours ago" }
];

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("fh_users");
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("fh_projects");
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [bids, setBids] = useState(() => {
    const saved = localStorage.getItem("fh_bids");
    return saved ? JSON.parse(saved) : MOCK_BIDS;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("fh_chats");
    return saved ? JSON.parse(saved) : MOCK_CHATS;
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem("fh_submissions");
    return saved ? JSON.parse(saved) : MOCK_SUBMISSIONS;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("fh_reviews");
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("fh_notifications");
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fh_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem("fh_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("fh_projects", JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem("fh_bids", JSON.stringify(bids));
  }, [bids]);
  useEffect(() => {
    localStorage.setItem("fh_chats", JSON.stringify(chats));
  }, [chats]);
  useEffect(() => {
    localStorage.setItem("fh_submissions", JSON.stringify(submissions));
  }, [submissions]);
  useEffect(() => {
    localStorage.setItem("fh_reviews", JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem("fh_notifications", JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    if (user) {
      localStorage.setItem("fh_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("fh_current_user");
    }
  }, [user]);

  // Auth Operations
  const login = (email, password) => {
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (match) {
      setUser(match);
      return { success: true, user: match };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const signup = (name, email, password, role) => {
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: "Email already registered" };
    }
    const newUser = {
      id: "u" + (users.length + 1),
      name,
      email,
      password,
      role,
      ...(role === "freelancer" ? { title: "New Freelancer", rating: 5.0, earnings: 0, skills: ["General"], bio: "" } : { company: name + "'s Business" })
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  // Client posts a project
  const postProject = (title, description, budget, duration, category) => {
    if (!user || user.role !== "client") return { success: false, error: "Only clients can post projects" };
    const newProj = {
      id: "p" + (projects.length + 1),
      clientId: user.id,
      clientName: user.name,
      title,
      description,
      budget: Number(budget),
      category,
      status: "open",
      duration,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setProjects(prev => [newProj, ...prev]);
    // Create notifications for all freelancers
    addNotification(`New project posted in ${category}: "${title}"`);
    return { success: true, project: newProj };
  };

  // Freelancer submits a bid
  const submitBid = (projectId, amount, message, days) => {
    if (!user || user.role !== "freelancer") return { success: false, error: "Only freelancers can bid" };
    const newBid = {
      id: "b" + (bids.length + 1),
      projectId,
      freelancerId: user.id,
      freelancerName: user.name,
      amount: Number(amount),
      message,
      days: Number(days),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };
    setBids(prev => [...prev, newBid]);
    
    // Add notification for the project owner
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      addNotification(`New bid on your project "${proj.title}" from ${user.name}: ₹${amount}`);
    }
    return { success: true, bid: newBid };
  };

  // Client accepts a bid
  const acceptBid = (bidId) => {
    if (!user || user.role !== "client") return { success: false, error: "Only clients can accept bids" };
    
    // Update Bid status
    const acceptedBid = bids.find(b => b.id === bidId);
    if (!acceptedBid) return { success: false, error: "Bid not found" };

    setBids(prev => prev.map(b => {
      if (b.id === bidId) return { ...b, status: "accepted" };
      if (b.projectId === acceptedBid.projectId) return { ...b, status: "rejected" };
      return b;
    }));

    // Update Project status to "in-progress" and assign contractor details
    setProjects(prev => prev.map(p => {
      if (p.id === acceptedBid.projectId) {
        return { 
          ...p, 
          status: "in-progress", 
          freelancerId: acceptedBid.freelancerId,
          freelancerName: acceptedBid.freelancerName,
          contractAmount: acceptedBid.amount
        };
      }
      return p;
    }));

    // Initialize or seed chat thread
    setChats(prev => ({
      ...prev,
      [acceptedBid.projectId]: [
        { senderId: user.id, senderName: user.name, message: `Hi ${acceptedBid.freelancerName}! I have accepted your bid for the project. Let's discuss details here.`, timestamp: new Date().toISOString() }
      ]
    }));

    // Notify Freelancer
    addNotification(`Your bid on project was accepted! Work begins on project.`);
    return { success: true };
  };

  // Chat message sending
  const sendChatMessage = (projectId, messageText) => {
    if (!user) return;
    const newMsg = {
      senderId: user.id,
      senderName: user.name,
      message: messageText,
      timestamp: new Date().toISOString()
    };
    setChats(prev => {
      const thread = prev[projectId] || [];
      return {
        ...prev,
        [projectId]: [...thread, newMsg]
      };
    });

    // MOCK RESPONSE BOT for live demo
    // If the freelancer sends a message, have the client reply, and vice-versa
    setTimeout(() => {
      const currentProj = projects.find(p => p.id === projectId);
      const recipientName = user.role === "client" ? (currentProj?.freelancerName || "Alex Rivera") : (currentProj?.clientName || "Sarah Jenkins");
      const recipientId = user.role === "client" ? (currentProj?.freelancerId || "u2") : (currentProj?.clientId || "u1");
      
      const cannedResponses = [
        "That sounds perfect! Let's move ahead with this approach.",
        "Got it. I'm working on the design guidelines right now.",
        "Can you verify the payment status? I want to make sure we're on track.",
        "Great, I will review the file submission as soon as you push it.",
        "Excellent. Let me know if you need any adjustments."
      ];
      
      const randomMsg = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
      
      setChats(prev => {
        const thread = prev[projectId] || [];
        // Prevent double trigger mock response
        if (thread[thread.length - 1]?.senderId === recipientId) return prev;
        
        return {
          ...prev,
          [projectId]: [
            ...thread,
            { senderId: recipientId, senderName: recipientName, message: randomMsg, timestamp: new Date().toISOString() }
          ]
        };
      });
    }, 2500);
  };

  // Freelancer submits codebase/file link
  const submitWork = (projectId, fileUrl, comments) => {
    if (!user || user.role !== "freelancer") return { success: false, error: "Only freelancers can submit work" };
    
    const newSubmission = {
      id: "s" + (submissions.length + 1),
      projectId,
      fileUrl,
      comments,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending"
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // Update project status to "review-pending"
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) return { ...p, status: "review-pending" };
      return p;
    }));

    // Notify client
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      addNotification(`Freelancer ${user.name} submitted work for "${proj.title}"`);
    }

    return { success: true };
  };

  // Client reviews and marks project completed
  const submitReview = (projectId, rating, comment) => {
    if (!user || user.role !== "client") return { success: false, error: "Only clients can review submissions" };

    const newRev = {
      id: "r" + (reviews.length + 1),
      projectId,
      reviewerId: user.id,
      rating: Number(rating),
      comment
    };

    setReviews(prev => [...prev, newRev]);

    // Mark project as Completed
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) return { ...p, status: "completed" };
      return p;
    }));

    // Mark submission as approved
    setSubmissions(prev => prev.map(s => {
      if (s.projectId === projectId) return { ...s, status: "approved" };
      return s;
    }));

    // Update Freelancer stats (increase earnings by project budget)
    const proj = projects.find(p => p.id === projectId);
    if (proj && proj.freelancerId) {
      setUsers(prev => prev.map(u => {
        if (u.id === proj.freelancerId) {
          const totalNewEarnings = u.earnings + (proj.contractAmount || proj.budget);
          return { 
            ...u, 
            earnings: totalNewEarnings,
            rating: Number(((u.rating + Number(rating)) / 2).toFixed(1))
          };
        }
        return u;
      }));

      // Notify Freelancer
      addNotification(`Your work for "${proj.title}" has been approved! Rating: ${rating} Stars. Payment completed.`);
    }

    return { success: true };
  };

  // Notification helper
  const addNotification = (text) => {
    const newNotif = {
      id: "n" + (notifications.length + 1),
      text,
      read: false,
      time: "Just now"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset helper to seeded initial state
  const resetDemoState = () => {
    setUsers(MOCK_USERS);
    setProjects(MOCK_PROJECTS);
    setBids(MOCK_BIDS);
    setChats(MOCK_CHATS);
    setSubmissions(MOCK_SUBMISSIONS);
    setReviews(MOCK_REVIEWS);
    setNotifications(MOCK_NOTIFICATIONS);
    setUser(null);
    window.location.hash = "#/login";
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        projects,
        bids,
        chats,
        submissions,
        reviews,
        notifications,
        login,
        signup,
        logout,
        postProject,
        submitBid,
        acceptBid,
        sendChatMessage,
        submitWork,
        submitReview,
        markAllNotificationsRead,
        resetDemoState
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
