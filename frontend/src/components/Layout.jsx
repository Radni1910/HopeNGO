import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
export default function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="main">
        <Navbar onMenu={() => setOpen(!open)} />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
