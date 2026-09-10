"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400 text-xs py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-white text-lg">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-black">
                CC
              </div>
              <span>CareerCompass</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              The AI-Powered Placement Readiness Platform designed to transform students into hireable engineers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#mentor" className="hover:text-white transition-colors">AI Mentors</Link></li>
              <li><Link href="#readiness" className="hover:text-white transition-colors">Readiness Engine</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Placement Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Company Hiring Bars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DSA Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">System Design CheatSheet</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CareerCompass Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = LandingFooter;
