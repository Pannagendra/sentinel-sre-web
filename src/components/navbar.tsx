"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const links = [
  { label: "Chat", href: "/chat" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Integrations", href: "/integrations" },
  { label: "API", href: "/api-docs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/10 bg-[#03070d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/20">
            <Shield className="h-5 w-5 text-[#03070d]" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Sentinel SRE</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 ${pathname === l.href
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-slate-500 hover:text-white"
            asChild
          >
            <a href="https://github.com/anisri/sentinel-sre" target="_blank" rel="noopener">GitHub</a>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-sm font-semibold text-[#03070d] hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/20"
            asChild
          >
            <Link href="/chat">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
        </div>

        <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-cyan-500/10 bg-[#03070d] px-6 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm ${pathname === l.href ? "text-cyan-400" : "text-slate-400 hover:text-white"
                }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-cyan-500/10">
            <Button
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-[#03070d] font-semibold"
              asChild
            >
              <Link href="/chat">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
