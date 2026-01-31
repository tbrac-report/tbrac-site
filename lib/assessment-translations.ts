import type { Language } from "./translations"

// Translations for all assessment categories, subcategories, and questions
export const assessmentTranslations = {
  en: {
    categories: {
      "regulatory-scrutiny": {
        name: "Regulatory Scrutiny",
        description: "CFIUS reviews, export controls, and sector-specific compliance analysis",
        subcategories: {
          "cfius-review": {
            name: "CFIUS Review Likelihood",
            description: "Evaluation of Committee on Foreign Investment in the United States review probability",
          },
          "export-controls": {
            name: "Export Control Compliance",
            description: "Assessment of dual-use technology and export regulation compliance",
          },
          "sector-compliance": {
            name: "Sector-Specific Regulations",
            description: "Industry-specific regulatory requirements and compliance history",
          },
        },
      },
      "political-geopolitical": {
        name: "Political & Geopolitical Risk",
        description: "Trade tensions, sanctions, tariffs, and political climate assessment",
        subcategories: {
          "trade-tensions": {
            name: "Trade Relations",
            description: "Current state of trade relations between countries",
          },
          "sanctions-risk": {
            name: "Sanctions Exposure",
            description: "Risk of sanctions or trade restrictions",
          },
          "political-climate": {
            name: "Political Environment",
            description: "Current political attitudes toward foreign investment",
          },
        },
      },
      "data-security": {
        name: "Data Security & Privacy",
        description: "CCPA compliance, data localization, and cybersecurity evaluation",
        subcategories: {
          "privacy-compliance": {
            name: "Privacy Law Compliance",
            description: "Adherence to US privacy regulations (CCPA, state laws)",
          },
          "data-localization": {
            name: "Data Storage & Localization",
            description: "Where and how customer data will be stored",
          },
          cybersecurity: {
            name: "Cybersecurity Practices",
            description: "Security infrastructure and incident history",
          },
        },
      },
      "ip-protection": {
        name: "Intellectual Property Protection",
        description: "IP enforcement mechanisms and dispute history analysis",
        subcategories: {
          "ip-compliance": {
            name: "IP Rights & Compliance",
            description: "Company IP portfolio and respect for third-party IP",
          },
          "technology-transfer": {
            name: "Technology Transfer Controls",
            description: "Mechanisms to prevent unauthorized technology transfer",
          },
        },
      },
      reputational: {
        name: "Reputational Risk",
        description: "Media coverage, public opinion, and sentiment analysis",
        subcategories: {
          "media-coverage": {
            name: "Media Presence",
            description: "Nature and sentiment of media coverage",
          },
          "public-sentiment": {
            name: "Public Perception",
            description: "US consumer and stakeholder attitudes",
          },
        },
      },
      "national-security": {
        name: "National Security Concerns",
        description: "Critical infrastructure involvement and technology transfer concerns",
        subcategories: {
          "critical-infrastructure": {
            name: "Critical Infrastructure Involvement",
            description: "Potential impact on US critical infrastructure",
          },
          "security-clearance": {
            name: "Security Clearances",
            description: "Need for security clearances and background checks",
          },
        },
      },
      "supply-chain": {
        name: "Supply Chain Transparency",
        description: "Supply chain visibility and dependency risks",
        subcategories: {
          "supplier-disclosure": {
            name: "Supplier Transparency",
            description: "Ability to disclose and verify supply chain",
          },
          "sourcing-alternatives": {
            name: "Alternative Sourcing",
            description: "Ability to diversify supply sources",
          },
        },
      },
      "market-competition": {
        name: "Market Competition & Behavior",
        description: "Competitive practices and anti-competitive behavior assessment",
        subcategories: {
          "competitive-practices": {
            name: "Competitive Conduct",
            description: "History of fair competition and antitrust compliance",
          },
          "pricing-strategy": {
            name: "Pricing & Market Entry",
            description: "Pricing strategy and market entry approach",
          },
        },
      },
      "labor-practices": {
        name: "Labor & Employment Practices",
        description: "Employment standards, worker rights, and ethical labor practices",
        subcategories: {
          "worker-rights": {
            name: "Worker Rights & Standards",
            description: "Compliance with labor rights and working conditions",
          },
          "us-employment": {
            name: "US Employment Plans",
            description: "Plans for hiring and treating US workers",
          },
        },
      },
      environmental: {
        name: "Environmental & Social Governance",
        description: "ESG commitments, environmental impact, and sustainability practices",
        subcategories: {
          "environmental-impact": {
            name: "Environmental Stewardship",
            description: "Environmental practices and commitments",
          },
          sustainability: {
            name: "Sustainability Practices",
            description: "Long-term sustainability and climate commitments",
          },
        },
      },
    },
    questions: {
      "cfius-1":
        "Does your company operate in a critical infrastructure sector (telecommunications, energy, finance, etc.)?",
      "cfius-2": "What percentage of your US operations would involve sensitive data or technology?",
      "cfius-3": "On a scale of 0-10, how likely is government access to your data in your home country?",
      "cfius-4": "Does your company have any government ownership or control (direct or indirect)?",
      "export-1": "Does your technology have potential military or dual-use applications?",
      "export-2": "How familiar is your company with US export control regulations (EAR, ITAR)?",
      "export-3": "Has your company ever been investigated or sanctioned for export violations?",
      "sector-1": "Which industry sector best describes your business?",
      "sector-2": "Rate your compliance record in your home country (0=poor, 10=excellent)",
      "sector-3": "Do you have existing US regulatory approvals or licenses?",
      "trade-1": "What is your company's country of origin?",
      "trade-2": "Rate the current trade relationship between your country and the US (0=hostile, 10=excellent)",
      "trade-3": "Has your company been affected by tariffs or trade restrictions in the past 5 years?",
      "sanctions-1": "Is your country currently under any US sanctions or trade restrictions?",
      "sanctions-2": "Does your company have business relationships with sanctioned entities?",
      "political-1":
        "Rate the current US political climate toward foreign investment from your country (0=hostile, 10=welcoming)",
      "political-2": "Has your company been mentioned in political discourse or media in the US?",
      "political-3": "Does your company have established relationships with US political or business leaders?",
      "privacy-1": "Is your company familiar with California Consumer Privacy Act (CCPA) requirements?",
      "privacy-2": "Does your company currently comply with GDPR or similar privacy regulations?",
      "privacy-3": "Rate your data privacy program maturity (0=none, 10=world-class)",
      "data-loc-1": "Where would US customer data be primarily stored?",
      "data-loc-2": "Can you guarantee that US data will not be accessible from your home country?",
      "data-loc-3": "Will you use US-based cloud service providers for US operations?",
      "cyber-1": "Does your company have ISO 27001 or SOC 2 certification?",
      "cyber-2": "Has your company experienced any data breaches in the past 5 years?",
      "cyber-3": "Rate your cybersecurity program maturity (0=minimal, 10=enterprise-grade)",
      "ip-1": "Does your company hold US patents or trademarks?",
      "ip-2": "Has your company ever been involved in IP litigation or disputes?",
      "ip-3": "Rate your home country's IP protection enforcement (0=weak, 10=strong)",
      "tech-trans-1": "Does your company have internal policies preventing unauthorized technology transfer?",
      "tech-trans-2": "Would US-developed technology be shared with your home country operations?",
      "media-1": "How would you characterize US media coverage of your company?",
      "media-2": "Has your company faced controversies in the past 3 years?",
      "media-3": "Rate your company's brand reputation in your home market (0=poor, 10=excellent)",
      "sentiment-1": "Do you have existing US customers or users?",
      "sentiment-2": "Rate expected US consumer receptiveness to your brand (0=hostile, 10=enthusiastic)",
      "sentiment-3": "Does your company actively engage in corporate social responsibility?",
      "crit-infra-1": "Would your US operations involve critical infrastructure?",
      "crit-infra-2": "Which sectors would your operations touch?",
      "crit-infra-3": "Would your operations have access to sensitive US infrastructure data?",
      "clearance-1": "Would your US employees require security clearances?",
      "clearance-2": "Are you willing to undergo thorough background checks for key personnel?",
      "supply-1": "Can you provide full transparency of your supply chain?",
      "supply-2": "What percentage of your suppliers are located in your home country?",
      "supply-3": "Are any of your critical suppliers state-owned or controlled?",
      "alt-source-1": "Could you source critical components from US or allied suppliers if required?",
      "alt-source-2": "Rate the flexibility of your supply chain (0=rigid, 10=highly flexible)",
      "compete-1": "Has your company been investigated for anti-competitive practices?",
      "compete-2": "Does your company receive government subsidies or preferential treatment?",
      "compete-3": "Rate your market position in your home country (0=small player, 10=dominant)",
      "pricing-1": "How would you describe your US market entry pricing strategy?",
      "pricing-2": "Are you willing to compete on equal footing with US competitors?",
      "labor-1": "Does your company comply with ILO (International Labour Organization) standards?",
      "labor-2": "Has your company faced labor disputes or violations in the past 5 years?",
      "labor-3": "Rate your workplace safety record (0=poor, 10=excellent)",
      "us-employ-1": "What percentage of your US workforce would be hired locally?",
      "us-employ-2": "Will you offer compensation competitive with US market rates?",
      "us-employ-3": "Are you committed to US labor law compliance?",
      "env-1": "Does your company have published ESG (Environmental, Social, Governance) goals?",
      "env-2": "Rate your company's environmental track record (0=poor, 10=leader)",
      "env-3": "Has your company faced environmental violations or fines?",
      "sustain-1": "Does your company have carbon neutrality or net-zero commitments?",
      "sustain-2":
        "Are you willing to comply with US environmental regulations that may be stricter than your home country?",
      "sustain-3": "Do you have third-party verified sustainability certifications?",
    },
    options: {
      "0-25%": "0-25%",
      "26-50%": "26-50%",
      "51-75%": "51-75%",
      "76-100%": "76-100%",
      "Not familiar": "Not familiar",
      "Somewhat familiar": "Somewhat familiar",
      "Very familiar": "Very familiar",
      "Expert level": "Expert level",
      "Fully compliant": "Fully compliant",
      Never: "Never",
      "Rarely (1-2 times)": "Rarely (1-2 times)",
      "Occasionally (3-10 times)": "Occasionally (3-10 times)",
      "Frequently (10+ times)": "Frequently (10+ times)",
      "US only": "US only",
      "US and home country": "US and home country",
      "Home country only": "Home country only",
      "Distributed globally": "Distributed globally",
      "With restrictions": "With restrictions",
      Freely: "Freely",
      Uncertain: "Uncertain",
      "Mostly positive": "Mostly positive",
      Neutral: "Neutral",
      Mixed: "Mixed",
      "Mostly negative": "Mostly negative",
      "No coverage": "No coverage",
      "Technology/Software": "Technology/Software",
      Telecommunications: "Telecommunications",
      "Financial Services": "Financial Services",
      Healthcare: "Healthcare",
      Energy: "Energy",
      Manufacturing: "Manufacturing",
      Other: "Other",
      Transportation: "Transportation",
      Communications: "Communications",
      "Financial services": "Financial services",
      "Defense industrial base": "Defense industrial base",
      "None of the above": "None of the above",
      "Premium pricing": "Premium pricing",
      "Market rate": "Market rate",
      "Competitive discount": "Competitive discount",
      "Aggressive undercutting": "Aggressive undercutting",
    },
  },
  zh: {
    categories: {
      "regulatory-scrutiny": {
        name: "监管审查",
        description: "CFIUS审查、出口管制和特定行业合规性分析",
        subcategories: {
          "cfius-review": {
            name: "CFIUS审查可能性",
            description: "美国外国投资委员会审查概率的评估",
          },
          "export-controls": {
            name: "出口管制合规",
            description: "双用途技术和出口法规合规性评估",
          },
          "sector-compliance": {
            name: "特定行业法规",
            description: "行业特定监管要求和合规历史",
          },
        },
      },
      "political-geopolitical": {
        name: "政治与地缘风险",
        description: "贸易紧张关系、制裁、关税和政治气候评估",
        subcategories: {
          "trade-tensions": {
            name: "贸易关系",
            description: "国家间贸易关系的当前状态",
          },
          "sanctions-risk": {
            name: "制裁风险",
            description: "制裁或贸易限制的风险",
          },
          "political-climate": {
            name: "政治环境",
            description: "对外国投资的当前政治态度",
          },
        },
      },
      "data-security": {
        name: "数据安全与隐私",
        description: "CCPA合规性、数据本地化和网络安全评估",
        subcategories: {
          "privacy-compliance": {
            name: "隐私法合规",
            description: "遵守美国隐私法规（CCPA、州法律）",
          },
          "data-localization": {
            name: "数据存储与本地化",
            description: "客户数据的存储地点和方式",
          },
          cybersecurity: {
            name: "网络安全实践",
            description: "安全基础设施和事件历史",
          },
        },
      },
      "ip-protection": {
        name: "知识产权保护",
        description: "知识产权执行机制和争议历史分析",
        subcategories: {
          "ip-compliance": {
            name: "知识产权权利与合规",
            description: "公司知识产权组合和对第三方知识产权的尊重",
          },
          "technology-transfer": {
            name: "技术转让控制",
            description: "防止未经授权的技术转让的机制",
          },
        },
      },
      reputational: {
        name: "声誉风险",
        description: "媒体报道、公众舆论和情绪分析",
        subcategories: {
          "media-coverage": {
            name: "媒体存在",
            description: "媒体报道的性质和情绪",
          },
          "public-sentiment": {
            name: "公众认知",
            description: "美国消费者和利益相关者的态度",
          },
        },
      },
      "national-security": {
        name: "国家安全担忧",
        description: "关键基础设施参与和技术转让担忧",
        subcategories: {
          "critical-infrastructure": {
            name: "关键基础设施参与",
            description: "对美国关键基础设施的潜在影响",
          },
          "security-clearance": {
            name: "安全许可",
            description: "安全许可和背景调查的需求",
          },
        },
      },
      "supply-chain": {
        name: "供应链透明度",
        description: "供应链可见性和依赖风险",
        subcategories: {
          "supplier-disclosure": {
            name: "供应商透明度",
            description: "披露和验证供应链的能力",
          },
          "sourcing-alternatives": {
            name: "替代采购",
            description: "多元化供应来源的能力",
          },
        },
      },
      "market-competition": {
        name: "市场竞争与行为",
        description: "竞争实践和反竞争行为评估",
        subcategories: {
          "competitive-practices": {
            name: "竞争行为",
            description: "公平竞争历史和反垄断合规",
          },
          "pricing-strategy": {
            name: "定价与市场进入",
            description: "定价策略和市场进入方法",
          },
        },
      },
      "labor-practices": {
        name: "劳工与就业实践",
        description: "就业标准、工人权利和道德劳工实践",
        subcategories: {
          "worker-rights": {
            name: "工人权利与标准",
            description: "遵守劳工权利和工作条件",
          },
          "us-employment": {
            name: "美国就业计划",
            description: "雇用和对待美国工人的计划",
          },
        },
      },
      environmental: {
        name: "环境与社会治理",
        description: "ESG承诺、环境影响和可持续性实践",
        subcategories: {
          "environmental-impact": {
            name: "环境管理",
            description: "环境实践和承诺",
          },
          sustainability: {
            name: "可持续性实践",
            description: "长期可持续性和气候承诺",
          },
        },
      },
    },
    questions: {
      "cfius-1": "您的公司是否在关键基础设施领域运营（电信、能源、金融等）？",
      "cfius-2": "您的美国业务涉及敏感数据或技术的百分比是多少？",
      "cfius-3": "在0-10的范围内，您所在国家的政府访问您数据的可能性有多大？",
      "cfius-4": "您的公司是否有任何政府所有权或控制权（直接或间接）？",
      "export-1": "您的技术是否有潜在的军事或双重用途应用？",
      "export-2": "您的公司对美国出口管制法规（EAR、ITAR）的熟悉程度如何？",
      "export-3": "您的公司是否曾因出口违规而受到调查或制裁？",
      "sector-1": "哪个行业部门最能描述您的业务？",
      "sector-2": "评价您在本国的合规记录（0=差，10=优秀）",
      "sector-3": "您是否拥有现有的美国监管批准或许可证？",
      "trade-1": "您公司的原籍国是什么？",
      "trade-2": "评价您的国家与美国之间当前的贸易关系（0=敌对，10=优秀）",
      "trade-3": "您的公司在过去5年中是否受到关税或贸易限制的影响？",
      "sanctions-1": "您的国家目前是否受到任何美国制裁或贸易限制？",
      "sanctions-2": "您的公司是否与受制裁实体有业务关系？",
      "political-1": "评价美国当前对来自您国家的外国投资的政治气候（0=敌对，10=欢迎）",
      "political-2": "您的公司是否在美国的政治言论或媒体中被提及？",
      "political-3": "您的公司是否与美国政治或商业领袖建立了关系？",
      "privacy-1": "您的公司是否熟悉《加州消费者隐私法》（CCPA）要求？",
      "privacy-2": "您的公司目前是否遵守GDPR或类似的隐私法规？",
      "privacy-3": "评价您的数据隐私计划成熟度（0=无，10=世界级）",
      "data-loc-1": "美国客户数据主要存储在哪里？",
      "data-loc-2": "您能保证美国数据不会从您的母国访问吗？",
      "data-loc-3": "您是否会为美国业务使用美国的云服务提供商？",
      "cyber-1": "您的公司是否拥有ISO 27001或SOC 2认证？",
      "cyber-2": "您的公司在过去5年中是否经历过任何数据泄露？",
      "cyber-3": "评价您的网络安全计划成熟度（0=最小，10=企业级）",
      "ip-1": "您的公司是否持有美国专利或商标？",
      "ip-2": "您的公司是否曾参与知识产权诉讼或争议？",
      "ip-3": "评价您母国的知识产权保护执法力度（0=弱，10=强）",
      "tech-trans-1": "您的公司是否有防止未经授权技术转让的内部政策？",
      "tech-trans-2": "在美国开发的技术是否会与您母国的业务共享？",
      "media-1": "您如何描述美国媒体对您公司的报道？",
      "media-2": "您的公司在过去3年中是否面临过争议？",
      "media-3": "评价您公司在本国市场的品牌声誉（0=差，10=优秀）",
      "sentiment-1": "您是否有现有的美国客户或用户？",
      "sentiment-2": "评价预期的美国消费者对您品牌的接受度（0=敌对，10=热情）",
      "sentiment-3": "您的公司是否积极参与企业社会责任？",
      "crit-infra-1": "您的美国业务是否会涉及关键基础设施？",
      "crit-infra-2": "您的业务会触及哪些部门？",
      "crit-infra-3": "您的业务是否会访问敏感的美国基础设施数据？",
      "clearance-1": "您的美国员工是否需要安全许可？",
      "clearance-2": "您是否愿意对关键人员进行彻底的背景调查？",
      "supply-1": "您能提供供应链的完全透明度吗？",
      "supply-2": "您的供应商中有多少百分比位于您的母国？",
      "supply-3": "您的任何关键供应商是否由国家拥有或控制？",
      "alt-source-1": "如果需要，您能否从美国或盟国供应商那里采购关键组件？",
      "alt-source-2": "评价您供应链的灵活性（0=僵化，10=高度灵活）",
      "compete-1": "您的公司是否曾因反竞争行为而受到调查？",
      "compete-2": "您的公司是否获得政府补贴或优惠待遇？",
      "compete-3": "评价您在母国的市场地位（0=小参与者，10=主导）",
      "pricing-1": "您如何描述您的美国市场进入定价策略？",
      "pricing-2": "您是否愿意与美国竞争对手在平等的基础上竞争？",
      "labor-1": "您的公司是否遵守ILO（国际劳工组织）标准？",
      "labor-2": "您的公司在过去5年中是否面临过劳工纠纷或违规？",
      "labor-3": "评价您的工作场所安全记录（0=差，10=优秀）",
      "us-employ-1": "您的美国劳动力中有多少百分比会在当地雇用？",
      "us-employ-2": "您是否会提供与美国市场利率竞争的薪酬？",
      "us-employ-3": "您是否承诺遵守美国劳动法？",
      "env-1": "您的公司是否发布了ESG（环境、社会、治理）目标？",
      "env-2": "评价您公司的环境记录（0=差，10=领导者）",
      "env-3": "您的公司是否面临过环境违规或罚款？",
      "sustain-1": "您的公司是否有碳中和或净零排放承诺？",
      "sustain-2": "您是否愿意遵守可能比您母国更严格的美国环境法规？",
      "sustain-3": "您是否拥有第三方验证的可持续性认证？",
    },
    options: {
      "0-25%": "0-25%",
      "26-50%": "26-50%",
      "51-75%": "51-75%",
      "76-100%": "76-100%",
      "Not familiar": "不熟悉",
      "Somewhat familiar": "有些熟悉",
      "Very familiar": "非常熟悉",
      "Expert level": "专家级别",
      "Fully compliant": "完全合规",
      Never: "从未",
      "Rarely (1-2 times)": "很少（1-2次）",
      "Occasionally (3-10 times)": "偶尔（3-10次）",
      "Frequently (10+ times)": "经常（10次以上）",
      "US only": "仅美国",
      "US and home country": "美国和母国",
      "Home country only": "仅母国",
      "Distributed globally": "全球分布",
      "With restrictions": "有限制",
      Freely: "自由",
      Uncertain: "不确定",
      "Mostly positive": "大多数积极",
      Neutral: "中立",
      Mixed: "混合",
      "Mostly negative": "大多数消极",
      "No coverage": "无报道",
      "Technology/Software": "技术/软件",
      Telecommunications: "电信",
      "Financial Services": "金融服务",
      Healthcare: "医疗保健",
      Energy: "能源",
      Manufacturing: "制造业",
      Other: "其他",
      Transportation: "交通运输",
      Communications: "通信",
      "Financial services": "金融服务",
      "Defense industrial base": "国防工业基础",
      "None of the above": "以上都不是",
      "Premium pricing": "优质定价",
      "Market rate": "市场价格",
      "Competitive discount": "竞争折扣",
      "Aggressive undercutting": "激进压价",
    },
  },
}

export function getAssessmentTranslation(
  language: Language,
  category: "categories" | "questions" | "options",
  key: string,
  subkey?: string,
): string {
  const trans = assessmentTranslations[language][category] as any
  if (!trans) return key

  if (category === "categories" && subkey) {
    const categoryTrans = trans[key]
    if (!categoryTrans) return key

    if (subkey === "name") return categoryTrans.name || key
    if (subkey === "description") return categoryTrans.description || key

    // For subcategories
    const parts = subkey.split(".")
    if (parts[0] === "subcategories" && parts.length === 3) {
      const subcatId = parts[1]
      const field = parts[2]
      return categoryTrans.subcategories?.[subcatId]?.[field] || key
    }
  }

  return trans[key] || key
}
