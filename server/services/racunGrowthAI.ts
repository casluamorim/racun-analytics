import { invokeLLM } from "../_core/llm";

/**
 * Racun Growth AI - 5 Analistas Especializados
 * 
 * Sistema inteligente que gera diagnósticos automáticos baseados em dados
 * de Meta Ads, Google Ads, CRM e Marketplaces.
 */

export interface AIAnalysisRequest {
  clientId: number;
  metaMetrics?: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpm: number;
  };
  googleMetrics?: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpm: number;
  };
  crmMetrics?: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    averageCycleTime: number;
    leadsInFunnel: number;
  };
  productMetrics?: {
    totalProducts: number;
    averageMargin: number;
    lowMarginProducts: number;
    topProduct?: string;
    bottomProduct?: string;
  };
}

export interface AIAnalysis {
  timestamp: Date;
  analyst: 'campaign' | 'sales' | 'product' | 'crm' | 'strategist';
  title: string;
  summary: string;
  insights: string[];
  recommendations: {
    action: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
  }[];
  alerts: {
    type: 'warning' | 'critical' | 'info';
    message: string;
  }[];
}

/**
 * Campaign AI - Analisa performance de campanhas de tráfego pago
 */
export async function analyzeCampaigns(data: AIAnalysisRequest): Promise<AIAnalysis> {
  const metaData = data.metaMetrics;
  const googleData = data.googleMetrics;

  const prompt = `
Você é um especialista em análise de campanhas de tráfego pago (Meta Ads e Google Ads).

Analise os seguintes dados de campanhas:

Meta Ads:
- Investimento: R$ ${metaData?.spend || 0}
- Impressões: ${metaData?.impressions || 0}
- Cliques: ${metaData?.clicks || 0}
- Conversões: ${metaData?.conversions || 0}
- ROAS: ${metaData?.roas || 0}x
- CTR: ${metaData?.ctr || 0}%
- CPC: R$ ${metaData?.cpc || 0}
- CPM: R$ ${metaData?.cpm || 0}

Google Ads:
- Investimento: R$ ${googleData?.spend || 0}
- Impressões: ${googleData?.impressions || 0}
- Cliques: ${googleData?.clicks || 0}
- Conversões: ${googleData?.conversions || 0}
- ROAS: ${googleData?.roas || 0}x
- CTR: ${googleData?.ctr || 0}%
- CPC: R$ ${googleData?.cpc || 0}
- CPM: R$ ${googleData?.cpm || 0}

Gere um diagnóstico detalhado incluindo:
1. Análise de performance de cada plataforma
2. Identificação de problemas (baixo ROAS, alto CPC, baixo CTR, etc)
3. Comparação entre Meta e Google
4. 3-5 recomendações de otimização prioritizadas
5. Alertas críticos se houver

Formato de resposta em JSON:
{
  "title": "Análise de Campanhas de Tráfego Pago",
  "summary": "Resumo executivo",
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": [
    {"action": "descrição", "impact": "high|medium|low", "effort": "low|medium|high"},
    ...
  ],
  "alerts": [
    {"type": "warning|critical|info", "message": "mensagem"},
    ...
  ]
}
  `;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de campanhas de tráfego pago. Responda sempre em JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "campaign_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              insights: { type: "array", items: { type: "string" } },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    impact: { type: "string", enum: ["high", "medium", "low"] },
                    effort: { type: "string", enum: ["low", "medium", "high"] },
                  },
                  required: ["action", "impact", "effort"],
                },
              },
              alerts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["warning", "critical", "info"] },
                    message: { type: "string" },
                  },
                  required: ["type", "message"],
                },
              },
            },
            required: ["title", "summary", "insights", "recommendations", "alerts"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    return {
      timestamp: new Date(),
      analyst: "campaign",
      title: parsed.title,
      summary: parsed.summary,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      alerts: parsed.alerts,
    };
  } catch (error) {
    console.error("[AI] Error analyzing campaigns:", error);
    throw error;
  }
}

/**
 * Sales AI - Analisa performance de vendas e funil
 */
export async function analyzeSales(data: AIAnalysisRequest): Promise<AIAnalysis> {
  const crmData = data.crmMetrics;

  const prompt = `
Você é um especialista em análise de vendas e funil de conversão.

Analise os seguintes dados de CRM:
- Total de Leads: ${crmData?.totalLeads || 0}
- Leads Convertidos: ${crmData?.convertedLeads || 0}
- Taxa de Conversão: ${crmData?.conversionRate || 0}%
- Ciclo de Vendas Médio: ${crmData?.averageCycleTime || 0} dias
- Leads no Funil: ${crmData?.leadsInFunnel || 0}

Gere um diagnóstico detalhado incluindo:
1. Análise de saúde do funil de vendas
2. Identificação de gargalos
3. Análise de taxa de conversão
4. 3-5 recomendações para melhorar conversão
5. Alertas sobre funil travado ou leads em risco

Formato de resposta em JSON:
{
  "title": "Análise de Vendas e Funil",
  "summary": "Resumo executivo",
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": [
    {"action": "descrição", "impact": "high|medium|low", "effort": "low|medium|high"},
    ...
  ],
  "alerts": [
    {"type": "warning|critical|info", "message": "mensagem"},
    ...
  ]
}
  `;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de vendas. Responda sempre em JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sales_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              insights: { type: "array", items: { type: "string" } },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    impact: { type: "string", enum: ["high", "medium", "low"] },
                    effort: { type: "string", enum: ["low", "medium", "high"] },
                  },
                  required: ["action", "impact", "effort"],
                },
              },
              alerts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["warning", "critical", "info"] },
                    message: { type: "string" },
                  },
                  required: ["type", "message"],
                },
              },
            },
            required: ["title", "summary", "insights", "recommendations", "alerts"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    return {
      timestamp: new Date(),
      analyst: "sales",
      title: parsed.title,
      summary: parsed.summary,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      alerts: parsed.alerts,
    };
  } catch (error) {
    console.error("[AI] Error analyzing sales:", error);
    throw error;
  }
}

/**
 * Product & Pricing AI - Analisa produtos e precificação
 */
export async function analyzeProducts(data: AIAnalysisRequest): Promise<AIAnalysis> {
  const productData = data.productMetrics;

  const prompt = `
Você é um especialista em análise de produtos e precificação.

Analise os seguintes dados de produtos:
- Total de Produtos: ${productData?.totalProducts || 0}
- Margem Média: ${productData?.averageMargin || 0}%
- Produtos com Margem Baixa: ${productData?.lowMarginProducts || 0}
- Produto Melhor: ${productData?.topProduct || "N/A"}
- Produto Pior: ${productData?.bottomProduct || "N/A"}

Gere um diagnóstico detalhado incluindo:
1. Análise de saúde do portfólio de produtos
2. Identificação de produtos com baixa margem
3. Análise de oportunidades de precificação
4. 3-5 recomendações de otimização de preço
5. Alertas sobre produtos obsoletos ou em risco

Formato de resposta em JSON:
{
  "title": "Análise de Produtos e Precificação",
  "summary": "Resumo executivo",
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": [
    {"action": "descrição", "impact": "high|medium|low", "effort": "low|medium|high"},
    ...
  ],
  "alerts": [
    {"type": "warning|critical|info", "message": "mensagem"},
    ...
  ]
}
  `;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de produtos e precificação. Responda sempre em JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "product_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              insights: { type: "array", items: { type: "string" } },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    impact: { type: "string", enum: ["high", "medium", "low"] },
                    effort: { type: "string", enum: ["low", "medium", "high"] },
                  },
                  required: ["action", "impact", "effort"],
                },
              },
              alerts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["warning", "critical", "info"] },
                    message: { type: "string" },
                  },
                  required: ["type", "message"],
                },
              },
            },
            required: ["title", "summary", "insights", "recommendations", "alerts"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    return {
      timestamp: new Date(),
      analyst: "product",
      title: parsed.title,
      summary: parsed.summary,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      alerts: parsed.alerts,
    };
  } catch (error) {
    console.error("[AI] Error analyzing products:", error);
    throw error;
  }
}

/**
 * CRM AI - Analisa qualidade de leads e funil
 */
export async function analyzeCRM(data: AIAnalysisRequest): Promise<AIAnalysis> {
  const crmData = data.crmMetrics;

  const prompt = `
Você é um especialista em análise de CRM e qualidade de leads.

Analise os seguintes dados de CRM:
- Total de Leads: ${crmData?.totalLeads || 0}
- Leads Convertidos: ${crmData?.convertedLeads || 0}
- Taxa de Conversão: ${crmData?.conversionRate || 0}%
- Ciclo de Vendas Médio: ${crmData?.averageCycleTime || 0} dias
- Leads no Funil: ${crmData?.leadsInFunnel || 0}

Gere um diagnóstico detalhado incluindo:
1. Análise de qualidade de leads
2. Identificação de leads em risco
3. Análise de perfil de cliente ideal
4. 3-5 recomendações de segmentação e follow-up
5. Alertas sobre oportunidades perdidas

Formato de resposta em JSON:
{
  "title": "Análise de CRM e Qualidade de Leads",
  "summary": "Resumo executivo",
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": [
    {"action": "descrição", "impact": "high|medium|low", "effort": "low|medium|high"},
    ...
  ],
  "alerts": [
    {"type": "warning|critical|info", "message": "mensagem"},
    ...
  ]
}
  `;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de CRM. Responda sempre em JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "crm_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              insights: { type: "array", items: { type: "string" } },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    impact: { type: "string", enum: ["high", "medium", "low"] },
                    effort: { type: "string", enum: ["low", "medium", "high"] },
                  },
                  required: ["action", "impact", "effort"],
                },
              },
              alerts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["warning", "critical", "info"] },
                    message: { type: "string" },
                  },
                  required: ["type", "message"],
                },
              },
            },
            required: ["title", "summary", "insights", "recommendations", "alerts"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    return {
      timestamp: new Date(),
      analyst: "crm",
      title: parsed.title,
      summary: parsed.summary,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      alerts: parsed.alerts,
    };
  } catch (error) {
    console.error("[AI] Error analyzing CRM:", error);
    throw error;
  }
}

/**
 * Growth Strategist - Consolida insights de todos os analistas
 */
export async function generateGrowthStrategy(
  analyses: AIAnalysis[],
  data: AIAnalysisRequest
): Promise<AIAnalysis> {
  const analysisText = analyses
    .map(
      (a) => `
${a.analyst.toUpperCase()}:
Título: ${a.title}
Resumo: ${a.summary}
Insights: ${a.insights.join(", ")}
Recomendações: ${a.recommendations.map((r) => `${r.action} (impacto: ${r.impact})`).join(", ")}
Alertas: ${a.alerts.map((al) => `${al.type}: ${al.message}`).join(", ")}
    `
    )
    .join("\n");

  const prompt = `
Você é um estrategista de crescimento sênior.

Você recebeu análises de 4 especialistas:
${analysisText}

Com base nessas análises, gere um diagnóstico consolidado e roadmap de crescimento incluindo:
1. Resumo executivo com os principais achados
2. Análise cruzada de dados (como campanhas impactam vendas, etc)
3. Identificação de oportunidades de crescimento rápido
4. 5-7 recomendações prioritizadas por impacto potencial
5. Roadmap de 30 dias com ações prioritizadas
6. Alertas críticos que precisam de ação imediata

Formato de resposta em JSON:
{
  "title": "Diagnóstico de Crescimento e Roadmap Estratégico",
  "summary": "Resumo executivo consolidado",
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": [
    {"action": "descrição", "impact": "high|medium|low", "effort": "low|medium|high"},
    ...
  ],
  "alerts": [
    {"type": "warning|critical|info", "message": "mensagem"},
    ...
  ]
}
  `;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um estrategista de crescimento sênior. Responda sempre em JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "growth_strategy",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              insights: { type: "array", items: { type: "string" } },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    impact: { type: "string", enum: ["high", "medium", "low"] },
                    effort: { type: "string", enum: ["low", "medium", "high"] },
                  },
                  required: ["action", "impact", "effort"],
                },
              },
              alerts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["warning", "critical", "info"] },
                    message: { type: "string" },
                  },
                  required: ["type", "message"],
                },
              },
            },
            required: ["title", "summary", "insights", "recommendations", "alerts"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    return {
      timestamp: new Date(),
      analyst: "strategist",
      title: parsed.title,
      summary: parsed.summary,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      alerts: parsed.alerts,
    };
  } catch (error) {
    console.error("[AI] Error generating growth strategy:", error);
    throw error;
  }
}

/**
 * Executar análise completa com todos os 5 analistas
 */
export async function runCompleteAnalysis(data: AIAnalysisRequest): Promise<AIAnalysis[]> {
  try {
    console.log(`[AI] Starting complete analysis for client ${data.clientId}`);

    // Executar análises em paralelo
    const [campaignAnalysis, salesAnalysis, productAnalysis, crmAnalysis] = await Promise.all([
      analyzeCampaigns(data),
      analyzeSales(data),
      analyzeProducts(data),
      analyzeCRM(data),
    ]);

    // Gerar estratégia consolidada
    const strategyAnalysis = await generateGrowthStrategy(
      [campaignAnalysis, salesAnalysis, productAnalysis, crmAnalysis],
      data
    );

    console.log(`[AI] Complete analysis finished for client ${data.clientId}`);

    return [campaignAnalysis, salesAnalysis, productAnalysis, crmAnalysis, strategyAnalysis];
  } catch (error) {
    console.error("[AI] Error running complete analysis:", error);
    throw error;
  }
}
