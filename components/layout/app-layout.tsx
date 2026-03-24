"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AppLayoutProps {
  /** Connected Stellar wallet address (e.g. GABC...XYZ) */
  walletAddress?: string;
  /** Page content */
  children: React.ReactNode;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} aria-hidden="true" />,
  },
  {
    label: "Verify Credential",
    href: "/verify",
    icon: <ShieldCheck size={20} aria-hidden="true" />,
  },
  {
    label: "My Quorum Slice",
    href: "/quorum-slice",
    icon: <Layers size={20} aria-hidden="true" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings size={20} aria-hidden="true" />,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  walletAddress?: string;
  pathname: string;
}

function Sidebar({ collapsed, onToggle, walletAddress, pathname }: SidebarProps) {
  return (
    <aside
      aria-label="Main navigation"
      className={`
        hidden md:flex flex-col h-screen sticky top-0
        bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-gray-700 min-h-[64px]">
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight truncate">
            QuorumProof
          </span>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="ml-auto p-1.5 rounded hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Wallet */}
      {walletAddress && (
        <div
          className={`flex items-center gap-2 px-3 py-3 border-b border-gray-700 text-sm text-gray-300 ${
            collapsed ? "justify-center" : ""
          }`}
          title={walletAddress}
        >
          <Wallet size={16} className="shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span className="truncate font-mono text-xs">
              {truncateAddress(walletAddress)}
            </span>
          )}
        </div>
      )}

      {/* Nav items */}
      <nav aria-label="Sidebar navigation" className="flex-1 py-4">
        <ul role="list" className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-medium
                    transition-colors duration-150
                    ${collapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

// ─── Bottom Nav (mobile) ──────────────────────────────────────────────────────

interface BottomNavProps {
  pathname: string;
}

function BottomNav({ pathname }: BottomNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700"
    >
      <ul role="list" className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium
                  transition-colors duration-150
                  ${isActive ? "text-indigo-400" : "text-gray-400 hover:text-white"}
                `}
              >
                {item.icon}
                <span className="leading-none">{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── AppLayout ────────────────────────────────────────────────────────────────

export function AppLayout({ walletAddress, children }: AppLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Desktop sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        walletAddress={walletAddress}
        pathname={pathname}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-16 bg-gray-900 border-b border-gray-700 shrink-0">
          <span className="font-bold text-lg">QuorumProof</span>
          {walletAddress && (
            <div
              className="flex items-center gap-1.5 text-xs text-gray-300 font-mono"
              title={walletAddress}
            >
              <Wallet size={14} aria-hidden="true" />
              {truncateAddress(walletAddress)}
            </div>
          )}
        </header>

        {/* Page content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-auto p-6 pb-24 md:pb-6"
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav pathname={pathname} />
    </div>
  );
}
