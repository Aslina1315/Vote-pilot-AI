/**
 * AppLayout Component
 * Root layout wrapping all pages: sidebar + header + main content area.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => (
  <div className="flex h-screen overflow-hidden" style={{ background: '#030E20' }}>
    {/* Sidebar (always visible on desktop, slide-in on mobile) */}
    <Sidebar />

    {/* Main content column */}
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto p-4 lg:p-6"
        role="main"
        aria-label="Page content"
      >
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
