import React from "react";
import AppRouter from "./routes/Router.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import './styles/components.css';
import './styles/footer-enhanced.css';
import './styles/login-enhanced.css';
import './styles/register-enhanced.css';
import './styles/dashboard-enhanced.css';
import './styles/profile-enhanced.css';
import './styles/dashboard-mytrips-luxury.css';



export default function App() {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <Header />
      <main className="py-8">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}
