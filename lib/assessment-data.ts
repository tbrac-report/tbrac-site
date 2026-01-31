// Assessment Data Structure: 10 Categories with Subcategories and Questions

export type QuestionType = "rating" | "boolean" | "multipleChoice" | "text"

export interface Question {
  id: string
  text: string
  type: QuestionType
  options?: string[] // For multiple choice
  weight: number // Weight in scoring (0-1)
  required: boolean
}

export interface Subcategory {
  id: string
  name: string
  description: string
  questions: Question[]
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  subcategories: Subcategory[]
}

export const ASSESSMENT_CATEGORIES: Category[] = [
  {
    id: "regulatory-scrutiny",
    name: "Regulatory Scrutiny",
    icon: "Shield",
    description: "CFIUS reviews, export controls, and sector-specific compliance analysis",
    subcategories: [
      {
        id: "cfius-review",
        name: "CFIUS Review Likelihood",
        description: "Evaluation of Committee on Foreign Investment in the United States review probability",
        questions: [
          {
            id: "cfius-1",
            text: "Does your company operate in a critical infrastructure sector (telecommunications, energy, finance, etc.)?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
          {
            id: "cfius-2",
            text: "What percentage of your US operations would involve sensitive data or technology?",
            type: "multipleChoice",
            options: ["0-25%", "26-50%", "51-75%", "76-100%"],
            weight: 0.25,
            required: true,
          },
          {
            id: "cfius-3",
            text: "On a scale of 0-10, how likely is government access to your data in your home country?",
            type: "rating",
            weight: 0.25,
            required: true,
          },
          {
            id: "cfius-4",
            text: "Does your company have any government ownership or control (direct or indirect)?",
            type: "boolean",
            weight: 0.2,
            required: true,
          },
        ],
      },
      {
        id: "export-controls",
        name: "Export Control Compliance",
        description: "Assessment of dual-use technology and export regulation compliance",
        questions: [
          {
            id: "export-1",
            text: "Does your technology have potential military or dual-use applications?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "export-2",
            text: "How familiar is your company with US export control regulations (EAR, ITAR)?",
            type: "multipleChoice",
            options: ["Not familiar", "Somewhat familiar", "Very familiar", "Expert level"],
            weight: 0.25,
            required: true,
          },
          {
            id: "export-3",
            text: "Has your company ever been investigated or sanctioned for export violations?",
            type: "boolean",
            weight: 0.4,
            required: true,
          },
        ],
      },
      {
        id: "sector-compliance",
        name: "Sector-Specific Regulations",
        description: "Industry-specific regulatory requirements and compliance history",
        questions: [
          {
            id: "sector-1",
            text: "Which industry sector best describes your business?",
            type: "multipleChoice",
            options: [
              "Technology/Software",
              "Telecommunications",
              "Financial Services",
              "Healthcare",
              "Energy",
              "Manufacturing",
              "Other",
            ],
            weight: 0.2,
            required: true,
          },
          {
            id: "sector-2",
            text: "Rate your compliance record in your home country (0=poor, 10=excellent)",
            type: "rating",
            weight: 0.4,
            required: true,
          },
          {
            id: "sector-3",
            text: "Do you have existing US regulatory approvals or licenses?",
            type: "boolean",
            weight: 0.4,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "political-geopolitical",
    name: "Political & Geopolitical Risk",
    icon: "Globe",
    description: "Trade tensions, sanctions, tariffs, and political climate assessment",
    subcategories: [
      {
        id: "trade-tensions",
        name: "Trade Relations",
        description: "Current state of trade relations between countries",
        questions: [
          {
            id: "trade-1",
            text: "What is your company's country of origin?",
            type: "text",
            weight: 0.3,
            required: true,
          },
          {
            id: "trade-2",
            text: "Rate the current trade relationship between your country and the US (0=hostile, 10=excellent)",
            type: "rating",
            weight: 0.4,
            required: true,
          },
          {
            id: "trade-3",
            text: "Has your company been affected by tariffs or trade restrictions in the past 5 years?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
        ],
      },
      {
        id: "sanctions-risk",
        name: "Sanctions Exposure",
        description: "Risk of sanctions or trade restrictions",
        questions: [
          {
            id: "sanctions-1",
            text: "Is your country currently under any US sanctions or trade restrictions?",
            type: "boolean",
            weight: 0.5,
            required: true,
          },
          {
            id: "sanctions-2",
            text: "Does your company have business relationships with sanctioned entities?",
            type: "boolean",
            weight: 0.5,
            required: true,
          },
        ],
      },
      {
        id: "political-climate",
        name: "Political Environment",
        description: "Current political attitudes toward foreign investment",
        questions: [
          {
            id: "political-1",
            text: "Rate the current US political climate toward foreign investment from your country (0=hostile, 10=welcoming)",
            type: "rating",
            weight: 0.4,
            required: true,
          },
          {
            id: "political-2",
            text: "Has your company been mentioned in political discourse or media in the US?",
            type: "multipleChoice",
            options: ["Never", "Rarely (1-2 times)", "Occasionally (3-10 times)", "Frequently (10+ times)"],
            weight: 0.3,
            required: true,
          },
          {
            id: "political-3",
            text: "Does your company have established relationships with US political or business leaders?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "data-security",
    name: "Data Security & Privacy",
    icon: "Lock",
    description: "CCPA compliance, data localization, and cybersecurity evaluation",
    subcategories: [
      {
        id: "privacy-compliance",
        name: "Privacy Law Compliance",
        description: "Adherence to US privacy regulations (CCPA, state laws)",
        questions: [
          {
            id: "privacy-1",
            text: "Is your company familiar with California Consumer Privacy Act (CCPA) requirements?",
            type: "multipleChoice",
            options: ["Not familiar", "Somewhat familiar", "Very familiar", "Fully compliant"],
            weight: 0.3,
            required: true,
          },
          {
            id: "privacy-2",
            text: "Does your company currently comply with GDPR or similar privacy regulations?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "privacy-3",
            text: "Rate your data privacy program maturity (0=none, 10=world-class)",
            type: "rating",
            weight: 0.35,
            required: true,
          },
        ],
      },
      {
        id: "data-localization",
        name: "Data Storage & Localization",
        description: "Where and how customer data will be stored",
        questions: [
          {
            id: "data-loc-1",
            text: "Where would US customer data be primarily stored?",
            type: "multipleChoice",
            options: ["US only", "US and home country", "Home country only", "Distributed globally"],
            weight: 0.4,
            required: true,
          },
          {
            id: "data-loc-2",
            text: "Can you guarantee that US data will not be accessible from your home country?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
          {
            id: "data-loc-3",
            text: "Will you use US-based cloud service providers for US operations?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
        ],
      },
      {
        id: "cybersecurity",
        name: "Cybersecurity Practices",
        description: "Security infrastructure and incident history",
        questions: [
          {
            id: "cyber-1",
            text: "Does your company have ISO 27001 or SOC 2 certification?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
          {
            id: "cyber-2",
            text: "Has your company experienced any data breaches in the past 5 years?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "cyber-3",
            text: "Rate your cybersecurity program maturity (0=minimal, 10=enterprise-grade)",
            type: "rating",
            weight: 0.35,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "ip-protection",
    name: "Intellectual Property Protection",
    icon: "FileText",
    description: "IP enforcement mechanisms and dispute history analysis",
    subcategories: [
      {
        id: "ip-compliance",
        name: "IP Rights & Compliance",
        description: "Company IP portfolio and respect for third-party IP",
        questions: [
          {
            id: "ip-1",
            text: "Does your company hold US patents or trademarks?",
            type: "boolean",
            weight: 0.25,
            required: true,
          },
          {
            id: "ip-2",
            text: "Has your company ever been involved in IP litigation or disputes?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "ip-3",
            text: "Rate your home country's IP protection enforcement (0=weak, 10=strong)",
            type: "rating",
            weight: 0.4,
            required: true,
          },
        ],
      },
      {
        id: "technology-transfer",
        name: "Technology Transfer Controls",
        description: "Mechanisms to prevent unauthorized technology transfer",
        questions: [
          {
            id: "tech-trans-1",
            text: "Does your company have internal policies preventing unauthorized technology transfer?",
            type: "boolean",
            weight: 0.4,
            required: true,
          },
          {
            id: "tech-trans-2",
            text: "Would US-developed technology be shared with your home country operations?",
            type: "multipleChoice",
            options: ["Never", "With restrictions", "Freely", "Uncertain"],
            weight: 0.6,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "reputational",
    name: "Reputational Risk",
    icon: "Users",
    description: "Media coverage, public opinion, and sentiment analysis",
    subcategories: [
      {
        id: "media-coverage",
        name: "Media Presence",
        description: "Nature and sentiment of media coverage",
        questions: [
          {
            id: "media-1",
            text: "How would you characterize US media coverage of your company?",
            type: "multipleChoice",
            options: ["Mostly positive", "Neutral", "Mixed", "Mostly negative", "No coverage"],
            weight: 0.4,
            required: true,
          },
          {
            id: "media-2",
            text: "Has your company faced controversies in the past 3 years?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "media-3",
            text: "Rate your company's brand reputation in your home market (0=poor, 10=excellent)",
            type: "rating",
            weight: 0.25,
            required: true,
          },
        ],
      },
      {
        id: "public-sentiment",
        name: "Public Perception",
        description: "US consumer and stakeholder attitudes",
        questions: [
          {
            id: "sentiment-1",
            text: "Do you have existing US customers or users?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
          {
            id: "sentiment-2",
            text: "Rate expected US consumer receptiveness to your brand (0=hostile, 10=enthusiastic)",
            type: "rating",
            weight: 0.35,
            required: true,
          },
          {
            id: "sentiment-3",
            text: "Does your company actively engage in corporate social responsibility?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "national-security",
    name: "National Security Concerns",
    icon: "ShieldAlert",
    description: "Critical infrastructure involvement and technology transfer concerns",
    subcategories: [
      {
        id: "critical-infrastructure",
        name: "Critical Infrastructure Involvement",
        description: "Potential impact on US critical infrastructure",
        questions: [
          {
            id: "crit-infra-1",
            text: "Would your US operations involve critical infrastructure?",
            type: "boolean",
            weight: 0.4,
            required: true,
          },
          {
            id: "crit-infra-2",
            text: "Which sectors would your operations touch?",
            type: "multipleChoice",
            options: [
              "Energy",
              "Transportation",
              "Communications",
              "Financial services",
              "Defense industrial base",
              "Healthcare",
              "None of the above",
            ],
            weight: 0.35,
            required: true,
          },
          {
            id: "crit-infra-3",
            text: "Would your operations have access to sensitive US infrastructure data?",
            type: "boolean",
            weight: 0.25,
            required: true,
          },
        ],
      },
      {
        id: "security-clearance",
        name: "Security Clearances",
        description: "Need for security clearances and background checks",
        questions: [
          {
            id: "clearance-1",
            text: "Would your US employees require security clearances?",
            type: "boolean",
            weight: 0.5,
            required: true,
          },
          {
            id: "clearance-2",
            text: "Are you willing to undergo thorough background checks for key personnel?",
            type: "boolean",
            weight: 0.5,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "supply-chain",
    name: "Supply Chain Transparency",
    icon: "Truck",
    description: "Supply chain visibility and dependency risks",
    subcategories: [
      {
        id: "supplier-disclosure",
        name: "Supplier Transparency",
        description: "Ability to disclose and verify supply chain",
        questions: [
          {
            id: "supply-1",
            text: "Can you provide full transparency of your supply chain?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "supply-2",
            text: "What percentage of your suppliers are located in your home country?",
            type: "multipleChoice",
            options: ["0-25%", "26-50%", "51-75%", "76-100%"],
            weight: 0.35,
            required: true,
          },
          {
            id: "supply-3",
            text: "Are any of your critical suppliers state-owned or controlled?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
        ],
      },
      {
        id: "sourcing-alternatives",
        name: "Alternative Sourcing",
        description: "Ability to diversify supply sources",
        questions: [
          {
            id: "alt-source-1",
            text: "Could you source critical components from US or allied suppliers if required?",
            type: "boolean",
            weight: 0.5,
            required: true,
          },
          {
            id: "alt-source-2",
            text: "Rate the flexibility of your supply chain (0=rigid, 10=highly flexible)",
            type: "rating",
            weight: 0.5,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "market-competition",
    name: "Market Competition & Behavior",
    icon: "TrendingUp",
    description: "Competitive practices and anti-competitive behavior assessment",
    subcategories: [
      {
        id: "competitive-practices",
        name: "Competitive Conduct",
        description: "History of fair competition and antitrust compliance",
        questions: [
          {
            id: "compete-1",
            text: "Has your company been investigated for anti-competitive practices?",
            type: "boolean",
            weight: 0.4,
            required: true,
          },
          {
            id: "compete-2",
            text: "Does your company receive government subsidies or preferential treatment?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "compete-3",
            text: "Rate your market position in your home country (0=small player, 10=dominant)",
            type: "rating",
            weight: 0.25,
            required: true,
          },
        ],
      },
      {
        id: "pricing-strategy",
        name: "Pricing & Market Entry",
        description: "Pricing strategy and market entry approach",
        questions: [
          {
            id: "pricing-1",
            text: "How would you describe your US market entry pricing strategy?",
            type: "multipleChoice",
            options: ["Premium pricing", "Market rate", "Competitive discount", "Aggressive undercutting"],
            weight: 0.5,
            required: true,
          },
          {
            id: "pricing-2",
            text: "Are you willing to compete on equal footing with US competitors?",
            type: "boolean",
            weight: 0.5,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "labor-practices",
    name: "Labor & Employment Practices",
    icon: "Briefcase",
    description: "Employment standards, worker rights, and ethical labor practices",
    subcategories: [
      {
        id: "worker-rights",
        name: "Worker Rights & Standards",
        description: "Compliance with labor rights and working conditions",
        questions: [
          {
            id: "labor-1",
            text: "Does your company comply with ILO (International Labour Organization) standards?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
          {
            id: "labor-2",
            text: "Has your company faced labor disputes or violations in the past 5 years?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
          {
            id: "labor-3",
            text: "Rate your workplace safety record (0=poor, 10=excellent)",
            type: "rating",
            weight: 0.35,
            required: true,
          },
        ],
      },
      {
        id: "us-employment",
        name: "US Employment Plans",
        description: "Plans for hiring and treating US workers",
        questions: [
          {
            id: "us-employ-1",
            text: "What percentage of your US workforce would be hired locally?",
            type: "multipleChoice",
            options: ["0-25%", "26-50%", "51-75%", "76-100%"],
            weight: 0.4,
            required: true,
          },
          {
            id: "us-employ-2",
            text: "Will you offer compensation competitive with US market rates?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
          {
            id: "us-employ-3",
            text: "Are you committed to US labor law compliance?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "environmental",
    name: "Environmental & Social Governance",
    icon: "Leaf",
    description: "ESG commitments, environmental impact, and sustainability practices",
    subcategories: [
      {
        id: "environmental-impact",
        name: "Environmental Stewardship",
        description: "Environmental practices and commitments",
        questions: [
          {
            id: "env-1",
            text: "Does your company have published ESG (Environmental, Social, Governance) goals?",
            type: "boolean",
            weight: 0.25,
            required: true,
          },
          {
            id: "env-2",
            text: "Rate your company's environmental track record (0=poor, 10=leader)",
            type: "rating",
            weight: 0.4,
            required: true,
          },
          {
            id: "env-3",
            text: "Has your company faced environmental violations or fines?",
            type: "boolean",
            weight: 0.35,
            required: true,
          },
        ],
      },
      {
        id: "sustainability",
        name: "Sustainability Practices",
        description: "Long-term sustainability and climate commitments",
        questions: [
          {
            id: "sustain-1",
            text: "Does your company have carbon neutrality or net-zero commitments?",
            type: "boolean",
            weight: 0.4,
            required: true,
          },
          {
            id: "sustain-2",
            text: "Are you willing to comply with US environmental regulations that may be stricter than your home country?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
          {
            id: "sustain-3",
            text: "Do you have third-party verified sustainability certifications?",
            type: "boolean",
            weight: 0.3,
            required: true,
          },
        ],
      },
    ],
  },
]

// Helper functions
export function getAllQuestions(): Question[] {
  const questions: Question[] = []
  ASSESSMENT_CATEGORIES.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      questions.push(...subcategory.questions)
    })
  })
  return questions
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  const category = ASSESSMENT_CATEGORIES.find((c) => c.id === categoryId)
  if (!category) return []

  const questions: Question[] = []
  category.subcategories.forEach((subcategory) => {
    questions.push(...subcategory.questions)
  })
  return questions
}

export function getCategoryById(categoryId: string): Category | undefined {
  return ASSESSMENT_CATEGORIES.find((c) => c.id === categoryId)
}

export const TOTAL_QUESTIONS = getAllQuestions().length
