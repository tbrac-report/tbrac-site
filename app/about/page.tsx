"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Shield, Cpu, Calendar } from "lucide-react"

const TEAM = [
  {
    name: "Yanyu Zhang",
    role: "Co-Founder · Methodology Lead",
    contribution:
      "Leads the development of TBRAC's core methodology and assessment framework. She created the substantive framework, including the cross-border risk architecture and evaluation model.",
    background:
      "Over a decade of experience building an education company in China, with experience in publishing and knowledge-system design.",
  },
  {
    name: "Ken Chester",
    role: "Co-Founder · Market Entry Lead",
    contribution:
      "Leads market entry strategy and the application of risk frameworks to real-world commercial expansion. Alongside Ashwin, he co-founded and invented the Vybd protocol, the agentic commerce foundation layer that underpins the TBRAC assessment system.",
    background:
      "Serial entrepreneur with a background in technology, investment, and U.S.-China commercial relations. Regional NSF Innovation Corps grant recipient.",
  },
  {
    name: "Ashwin Dhanasamy",
    role: "Co-Founder · Platform Engineering Lead",
    contribution:
      "Leads the technical architecture and engineering development, transforming the TBRAC framework into a functional digital system. As the primary architect of the Vybd protocol, he designed the agentic infrastructure that provides the technical foundation for TBRAC.",
    background:
      "Experienced machine learning and AI engineer focused on developing decentralized protocols and autonomous agent infrastructure for global commerce.",
  },
]

const MILESTONES = [
  { date: "January 2024", event: "Concept and framework direction developed." },
  { date: "June 2024", event: "Assurance Pacific Assessments LLC formed." },
  {
    date: "June 2025",
    event: "Published Trans-Border Risk Assessment and Certification for Chinese Companies Exploring US Market Entry.",
  },
  { date: "March 2026", event: "Website launched and first client assessments initiated." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            About TBRAC
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            A structured cross-border risk assessment platform built for the complexity of US market entry.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* What TBRAC Is */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">What We Do</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      TBRAC is a structured cross-border risk assessment and reporting platform designed to help
                      organizations navigate international business decisions. The platform is uniquely powered by the
                      Vybd protocol — an agentic commerce foundation layer working collaboratively with the TBRAC
                      framework — enabling highly dynamic, automated risk assessments for global commerce.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">Purpose:</span> To provide clarity, consistency,
                        and usability in assessing regulatory, operational, geopolitical, and reputational risks.
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Nature:</span> A framework-driven system to
                        support decision-making — not legal advice or formal due diligence.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why TBRAC Exists */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Why We Exist</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Chinese companies face an increasingly complex regulatory and geopolitical landscape when
                      entering the US market. CFIUS scrutiny, export controls, entity list exposure, and data
                      sovereignty requirements create risk that is difficult to assess without a structured framework.
                      TBRAC was built to give companies a clear, consistent picture of where they stand before
                      they encounter these barriers — not after.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Milestones */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Platform Milestones</h2>
                    <div className="space-y-4">
                      {MILESTONES.map((m, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {i < MILESTONES.length - 1 && (
                              <div className="w-px flex-1 bg-border mt-1" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
                              {m.date}
                            </p>
                            <p className="text-sm text-muted-foreground">{m.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Founding Team */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Founding Team</h2>
              </div>
              <div className="space-y-6">
                {TEAM.map((member) => (
                  <Card key={member.name} className="border-border">
                    <CardContent className="p-8">
                      <div className="mb-1">
                        <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                        <p className="text-sm text-primary font-medium">{member.role}</p>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-3">
                        {member.contribution}
                      </p>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed border-t border-border pt-3">
                        <span className="font-medium text-muted-foreground">Background: </span>
                        {member.background}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
