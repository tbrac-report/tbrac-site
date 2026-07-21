"use client";

import Link from "next/link";
import { Shield, Activity, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f0ebe0] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5">
        <Link
          href="/company/login"
          className="border border-[#1a1f2e] text-[#1a1f2e] text-sm font-medium px-5 py-2 rounded hover:bg-[#1a1f2e] hover:text-white transition-colors"
        >
          Login
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/about" className="text-sm text-[#1a1f2e] hover:opacity-70 transition-opacity">
            About
          </Link>
          <Link href="/case-studies" className="text-sm text-[#1a1f2e] hover:opacity-70 transition-opacity">
            Use Cases
          </Link>
          <Link href="/company/login" className="text-sm text-[#1a1f2e] hover:opacity-70 transition-opacity">
            My Reports
          </Link>
        </nav>

        <span className="text-base font-bold tracking-widest text-[#1a1f2e]">TBRAC AI</span>
      </header>

      {/* Hero */}
      <section
        className="mx-4 sm:mx-8 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1f2e 0%, #1e2a3a 50%, #2a3040 100%)",
          minHeight: 420,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28 relative">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a647]/40 bg-[#c9a647]/10 px-4 py-1.5">
            <span className="text-xs font-semibold tracking-widest text-[#c9a647] uppercase">
              Compliance Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Assess US Market Entry<br />
            Readiness with{" "}
            <span className="text-[#c9a647]">Confidence</span>
          </h1>

          <p className="mt-6 text-base text-white/60 max-w-xl leading-relaxed">
            TBRAC intelligence tool helps compliance analysts evaluate company
            readiness through automated screening, risk scoring, and
            comprehensive reporting.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/company/login"
              className="flex items-center gap-2 bg-[#c9a647] hover:bg-[#b8923a] text-[#1a1f2e] font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Create New Assessment
              <span className="text-base">→</span>
            </Link>
            <Link
              href="/company/login"
              className="border border-white/30 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-4 sm:mx-8 mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Shield,
            title: "Automated Screening",
            desc: "Instantly vet companies against thousands of compliance databases and watchlists with real-time updates.",
          },
          {
            icon: Activity,
            title: "Risk Scoring",
            desc: "The TBRAC scoring methodology calculates a precise readiness score, highlighting critical gaps before they become blockers.",
          },
          {
            icon: FileText,
            title: "Comprehensive Reporting",
            desc: "Generate detailed PDF reports for stakeholders with actionable insights and clear remediation steps.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-7 flex flex-col gap-4 shadow-sm border border-[#e8e2d6]"
          >
            <div className="h-9 w-9 rounded-lg bg-[#f0ebe0] flex items-center justify-center">
              <Icon className="h-5 w-5 text-[#1a1f2e]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1f2e] text-base">{title}</h3>
              <p className="mt-2 text-sm text-[#6b6457] leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Data-Driven Section */}
      <section className="mx-4 sm:mx-8 mt-6 rounded-2xl bg-[#eae4d8] border border-[#ddd6c8] overflow-hidden">
        <div className="grid lg:grid-cols-2 items-center gap-0">
          {/* Left copy */}
          <div className="p-10 sm:p-14 space-y-6">
            <h2 className="text-3xl font-bold text-[#1a1f2e] leading-snug">
              Data-Driven Decisions
            </h2>
            <p className="text-sm text-[#6b6457] leading-relaxed max-w-sm">
              Navigate the complex landscape of US market regulations. Our tool
              simplifies the compliance journey from initial assessment to final
              approval.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-[#ddd6c8]">
                <p className="text-2xl font-bold text-[#1a1f2e]">99.9%</p>
                <p className="text-xs text-[#6b6457] uppercase tracking-widest mt-1">
                  Accuracy Rate
                </p>
              </div>
              <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-[#ddd6c8]">
                <p className="text-2xl font-bold text-[#1a1f2e]">10x</p>
                <p className="text-xs text-[#6b6457] uppercase tracking-widest mt-1">
                  Faster Analysis
                </p>
              </div>
            </div>
          </div>

          {/* Right — mock dashboard card */}
          <div className="p-8 flex items-center justify-center">
            <div
              className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl"
              style={{ background: "#1a1f2e" }}
            >
              {/* Top bar */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-white/10">
                <div>
                  <p className="text-xs text-white/50">Company</p>
                  <p className="text-sm font-semibold text-white">Nicutization Datun</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span>Market Risk</span>
                  <span className="text-[#c9a647]">Score</span>
                  <span>Excellent</span>
                  <span>↑↓</span>
                </div>
              </div>
              {/* Chart area */}
              <div className="px-5 py-5">
                <div className="flex items-end gap-1.5 h-20 mb-3">
                  {[40, 55, 35, 65, 50, 75, 60, 80, 70, 85, 65, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 11
                            ? "#c9a647"
                            : i >= 8
                            ? "rgba(201,166,71,0.5)"
                            : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </div>
                {/* Sparkline */}
                <svg viewBox="0 0 200 30" className="w-full h-6" preserveAspectRatio="none">
                  <polyline
                    points="0,25 20,20 40,22 60,15 80,18 100,10 120,13 140,8 160,6 180,4 200,2"
                    fill="none"
                    stroke="#c9a647"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Stats row */}
              <div className="px-5 pb-5 grid grid-cols-3 gap-2 text-xs text-white/50">
                {["Attrition 5% Incertations area", "Company", "Compliance"].map((label) => (
                  <div key={label} className="bg-white/5 rounded p-2">
                    <p className="text-white/30 text-[10px] mb-1">{label}</p>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#c9a647]/60 rounded-full"
                        style={{ width: `${Math.random() * 60 + 40}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="mx-4 sm:mx-8 mt-6 mb-8 border-t border-[#ddd6c8] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#9b9183]">
          © {new Date().getFullYear()} TBRAC AI. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-xs text-[#6b6457] hover:text-[#1a1f2e] transition-colors">
            About
          </Link>
          <Link href="/case-studies" className="text-xs text-[#6b6457] hover:text-[#1a1f2e] transition-colors">
            Use Cases
          </Link>
          <Link href="/privacy" className="text-xs text-[#6b6457] hover:text-[#1a1f2e] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs text-[#6b6457] hover:text-[#1a1f2e] transition-colors">
            Terms of Use
          </Link>
          <Link
            href="/evaluator-login"
            className="text-xs font-medium text-[#1a1f2e] border border-[#1a1f2e] px-3 py-1.5 rounded hover:bg-[#1a1f2e] hover:text-white transition-colors"
          >
            Evaluator Login
          </Link>
        </nav>
      </footer>
    </div>
  );
}
