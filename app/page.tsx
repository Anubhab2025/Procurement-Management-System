"use client";

import { useState } from "react";
import { LoginPage } from "@/components/login-page";
import { Layout } from "@/components/layout";
import { ProcurementProvider } from "@/contexts/procurement-context";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<{ email: string; name: string }>({
    email: 'admin@example.com',
    name: 'Admin User'
  });

  const handleLogin = (email: string, name: string) => {
    setIsLoggedIn(true);
    setUser({ email, name });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ email: '', name: '' });
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ProcurementProvider>
      <Layout user={user} onLogout={handleLogout} />
    </ProcurementProvider>
  );
}
