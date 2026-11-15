import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedPets, seedEvents, seedBlogs } from "../data/seed";
import { hasActiveApplication, isSlotBooked, remainingSeats, validDonationAmount, validAppointment, eventHasEnded } from "../utils/logic";
const AppContext = createContext(null);
const initialState = {
  pets: seedPets,
  events: seedEvents,
  blogs: seedBlogs,
  users: [],
  userOverrides: {},
  applications: [],
  releases: [],
  registrations: [],
  donations: [],
  contacts: [],
  favorites: []
};
const demoUsers = [{
  id: "member-demo",
  name: "Jamie Paw",
  email: "member@petheaven.demo",
  role: "member",
  demoPassword: "Member123!"
}, {
  id: "staff-demo",
  name: "Alex Care",
  email: "staff@petheaven.demo",
  role: "staff",
  demoPassword: "Staff123!"
}];
const STORAGE = "pet-heaven-data-v1";
const SESSION = "pet-heaven-session-v1";
function readData() {
  try {
    const loaded = JSON.parse(localStorage.getItem(STORAGE));
    if (loaded && typeof loaded === "object" && !Array.isArray(loaded)) {
      const restored = {
        ...initialState
      };
      for (const key of Object.keys(initialState)) {
        if (Array.isArray(initialState[key])) {
          if (Array.isArray(loaded[key]) && loaded[key].every(item => item && typeof item === 'object' && !Array.isArray(item))) restored[key] = loaded[key];
        } else if (loaded[key] && typeof loaded[key] === 'object' && !Array.isArray(loaded[key])) restored[key] = loaded[key];
      }
      return restored;
    }
  } catch {}
  return initialState;
}
function readSession() {
  try {
    return localStorage.getItem(SESSION) || null;
  } catch {
    return null;
  }
}
async function digest(password, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map(x => x.toString(16).padStart(2, "0")).join("");
}
export function AppProvider({
  children
}) {
  const [data, setData] = useState(readData);
  const [sessionId, setSessionId] = useState(readSession);
  const [toast, setToast] = useState(null);
  const users = useMemo(() => [...demoUsers.map(u => {
    const override = data.userOverrides?.[u.id];
    return {
      ...u,
      ...(override ? {
        name: override.name || u.name,
        phone: override.phone || '',
        bio: override.bio || ''
      } : {})
    };
  }), ...data.users], [data.users, data.userOverrides]);
  const user = users.find(u => u.id === sessionId) || null;
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(data));
    } catch {
      setToast({
        type: "error",
        message: "Browser storage is full. Remove large images or reset data."
      });
    }
  }, [data]);
  useEffect(() => {
    try {
      if (sessionId) localStorage.setItem(SESSION, sessionId);else localStorage.removeItem(SESSION);
    } catch {}
  }, [sessionId]);
  const notify = (message, type = "success") => setToast({
    message,
    type,
    id: Date.now()
  });
  const update = (key, fn) => setData(prev => ({
    ...prev,
    [key]: fn(prev[key])
  }));
  const login = async (email, password) => {
    const account = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!account) throw new Error("Email or password is incorrect.");
    const valid = account.demoPassword ? account.demoPassword === password : (await digest(password, account.salt)) === account.passwordHash;
    if (!valid) throw new Error("Email or password is incorrect.");
    setSessionId(account.id);
    notify(`Welcome back, ${account.name.split(" ")[0]}!`);
    return account;
  };
  const signUp = async ({
    name,
    email,
    password
  }) => {
    if (!name.trim() || name.trim().length < 2) throw new Error("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error("Enter a valid email address.");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) throw new Error("Password needs at least 8 characters, including a letter and number.");
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) throw new Error("An account with this email already exists.");
    const salt = crypto.randomUUID();
    const passwordHash = await digest(password, salt);
    const account = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: "member",
      salt,
      passwordHash
    };
    update("users", items => [...items, account]);
    setSessionId(account.id);
    notify("Your account is ready!");
    return account;
  };
  const logout = () => {
    setSessionId(null);
    notify("You have been logged out.");
  };
  const saveProfile = fields => {
    if (!user) return;
    if (fields.name.trim().length < 2) {
      notify("Please enter a display name of at least two characters.", "error");
      return;
    }
    const patch = {
      name: fields.name.trim(),
      phone: fields.phone || "",
      bio: fields.bio || ""
    };
    if (user.id.endsWith("-demo")) setData(prev => ({
      ...prev,
      userOverrides: {
        ...prev.userOverrides,
        [user.id]: {
          ...(prev.userOverrides?.[user.id] || {}),
          ...patch
        }
      }
    }));else update("users", items => items.map(item => item.id === user.id ? {
      ...item,
      ...patch
    } : item));
    notify("Profile saved.");
  };
  const toggleFavorite = petId => {
    if (!user) return false;
    update("favorites", items => items.some(f => f.userId === user.id && f.petId === petId) ? items.filter(f => !(f.userId === user.id && f.petId === petId)) : [...items, {
      userId: user.id,
      petId
    }]);
    return true;
  };
  const submitApplication = details => {
    if (!user) throw new Error("Please log in to continue.");
    if (!data.pets.some(pet => pet.id === details.petId && pet.status === 'Available')) throw new Error('This pet is not available for new requests.');
    if (!validAppointment(details.date, details.slot)) throw new Error('Choose a future date and an available appointment time.');
    if (!details.consent || ['name', 'email', 'phone', 'housing', 'experience', 'household', 'reason'].some(key => !String(details[key] || '').trim())) throw new Error('Please complete all required fields and confirm the acknowledgement.');
    if (!/^\S+@\S+\.\S+$/.test(details.email.trim())) throw new Error('Enter a valid email address.');
    const duplicate = isSlotBooked(data.applications, details.petId, details.date, details.slot);
    if (duplicate) throw new Error("This meet-and-greet time is already requested. Please choose another slot.");
    const existing = hasActiveApplication(data.applications, user.id, details.petId);
    if (existing) throw new Error("You already have an active application for this pet.");
    const record = {
      ...details,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: "Pending",
      notes: ""
    };
    update("applications", items => [record, ...items]);
    notify("Request saved. Track it in your profile.");
    return record;
  };
  const cancelApplication = id => {
    if (!user) throw new Error("Please log in.");
    update("applications", items => items.map(a => a.id === id && a.userId === user.id && ["Pending", "Under Review"].includes(a.status) ? {
      ...a,
      status: "Cancelled"
    } : a));
    notify("Application cancelled.");
  };
  const submitRelease = details => {
    if (!user) throw new Error("Please log in first.");
    if (!details.consent || ['owner', 'email', 'phone', 'petName', 'species', 'breed', 'age', 'gender', 'medical', 'temperament', 'reason'].some(key => !String(details[key] || '').trim())) throw new Error('Complete the required details and acknowledge the request.');
    const record = {
      ...details,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    update("releases", items => [record, ...items]);
    notify("Rehoming request saved.");
    return record;
  };
  const joinEvent = id => {
    if (!user) throw new Error("Please log in first.");
    const event = data.events.find(e => e.id === id);
    if (!event || event.status !== "Published") throw new Error("Event is unavailable.");
    if (eventHasEnded(event)) throw new Error('Registration has closed for this activity.');
    if (data.registrations.some(r => r.eventId === id && r.userId === user.id)) throw new Error("You are already registered.");
    if (remainingSeats(data.registrations, event) === 0) throw new Error("This event is full.");
    update("registrations", items => [{
      id: crypto.randomUUID(),
      userId: user.id,
      eventId: id,
      date: new Date().toISOString()
    }, ...items]);
    notify("Your interest is saved. Check your profile for updates.");
  };
  const cancelEvent = id => {
    update("registrations", items => items.filter(r => !(r.eventId === id && r.userId === user?.id)));
    notify("Registration cancelled.");
  };
  const simulateDonation = ({
    amount,
    method
  }) => {
    if (!validDonationAmount(amount)) throw new Error("Choose an amount from S$0.01 to S$10,000, with no more than two decimal places.");
    const record = {
      id: crypto.randomUUID(),
      userId: user?.id || null,
      amount: Number(amount),
      method,
      status: "Donated!",
      createdAt: new Date().toISOString()
    };
    update("donations", items => [record, ...items]);
    notify("Donation Received.");
    return record;
  };
  const submitContact = fields => {
    if (!fields.name?.trim() || !fields.message?.trim() || !/^\S+@\S+\.\S+$/.test(fields.email?.trim() || '')) throw new Error('Please enter your name, a valid email and a message.');
    update("contacts", items => [{
      ...fields,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }, ...items]);
    notify("Message saved. We will respond to your email if needed.");
  };
  const staffChange = (type, id, patch) => {
    if (user?.role !== "staff") throw new Error("Staff access only.");
    if (type === 'applications' && patch.status && !['Rejected', 'Cancelled'].includes(patch.status)) {
      const application = data.applications.find(item => item.id === id);
      const others = data.applications.filter(item => item.id !== id);
      if (application && (isSlotBooked(others, application.petId, application.date, application.slot) || hasActiveApplication(others, application.userId, application.petId))) throw new Error('Another active request already uses this pet or time. Keep this request closed.');
    }
    update(type, items => items.map(item => item.id === id ? {
      ...item,
      ...patch
    } : item));
    notify("Changes saved.");
  };
  const staffUpsert = (type, record) => {
    if (user?.role !== "staff") throw new Error("Staff access only.");
    update(type, items => record.id && items.some(x => x.id === record.id) ? items.map(x => x.id === record.id ? {
      ...x,
      ...record
    } : x) : [{
      ...record,
      id: crypto.randomUUID()
    }, ...items]);
    notify("Changes");
  };
  const resetDemo = () => {
    if (user?.role !== 'staff') {
      notify('Only the staff account can reset all browser records.', 'error');
      return;
    }
    setData(initialState);
    setSessionId(null);
    notify("Browser data reset.");
  };
  return <AppContext.Provider value={{
    ...data,
    user,
    users,
    notify,
    toast,
    setToast,
    login,
    signUp,
    logout,
    saveProfile,
    toggleFavorite,
    submitApplication,
    cancelApplication,
    submitRelease,
    joinEvent,
    cancelEvent,
    simulateDonation,
    submitContact,
    staffChange,
    staffUpsert,
    resetDemo
  }}>
      {children}
    </AppContext.Provider>;
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
