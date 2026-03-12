import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AIAnalysis {
  analyst: "campaign" | "sales" | "product" | "crm" | "strategist";
  title: string;
  summary: string;
  insights: string[];
  recommendations: {
    action: string;
    impact: "high" | "medium" | "low";
    effort: "low" | "medium" | "high";
  }[];
  alerts: {
    type: "warning" | "critical" | "info";
    message: string;
  }[];
  timestamp: string;
}

const analystColors: Record<string, string> = {
  campaign: "bg-blue-500",
  sales: "bg-green-500",
  product: "bg-purple-500",
  crm: "bg-orange-500",
  strategist: "bg-red-500",
};

const analystLabels = {
  campaign: "Campaign AI",
  sales: "Sales AI",
  product: "Product & Pricing AI",
  crm: "CRM AI",
  strategist: "Growth Strategist",
};

export default function AIInsights() {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<AIAnalysis["analyst"]>("strategist");

  const runAnalysisMutation = trpc.ai.runCompleteAnalysis.useMutation({
    onSuccess: (data: any) => {
      setAnalyses(data.analyses);
      setIsLoading(false);
    },
    onError: (error: any) => {
      console.error("Error running analysis:", error);
      setIsLoading(false);
    },
  });

  const handleRunAnalysis = () => {
    setIsLoading(true);
    runAnalysisMutation.mutate({
      clientId: 1, // TODO: Get from context
      metaMetrics: {
        spend: 5000,
        impressions: 100000,
        clicks: 5000,
        conversions: 250,
        roas: 2.5,
        ctr: 5.0,
        cpc: 1.0,
        cpm: 50,
      },
      googleMetrics: {
        spend: 3000,
        impressions: 80000,
        clicks: 4000,
        conversions: 200,
        roas: 3.0,
        ctr: 5.0,
        cpc: 0.75,
        cpm: 37.5,
      },
      crmMetrics: {
        totalLeads: 450,
        convertedLeads: 45,
        conversionRate: 10,
        averageCycleTime: 15,
        leadsInFunnel: 200,
      },
      productMetrics: {
        totalProducts: 50,
        averageMargin: 35,
        lowMarginProducts: 5,
        topProduct: "Produto A",
        bottomProduct: "Produto Z",
      },
    });
  };

  const selectedAnalysis = analyses.find((a) => a.analyst === selectedAnalyst);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Racun Growth AI</h1>
          <p className="text-gray-400 mt-1">Diagnósticos inteligentes de crescimento</p>
        </div>
        <Button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="gap-2"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Executar Análise Completa
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      {analyses.length > 0 && (
        <Tabs
          value={selectedAnalyst}
          onValueChange={(value) => setSelectedAnalyst(value as AIAnalysis["analyst"])}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            {(["campaign", "sales", "product", "crm", "strategist"] as const).map((analyst) => (
              <TabsTrigger key={analyst} value={analyst}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${analystColors[analyst]}`} />
                  <span className="hidden sm:inline">{analystLabels[analyst].split(" ")[0]}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {(["campaign", "sales", "product", "crm", "strategist"] as const).map((analyst) => {
            const analysis = analyses.find((a) => a.analyst === analyst);
            if (!analysis) return null;

            return (
              <TabsContent key={analyst} value={analyst} className="space-y-6">
                {/* Summary Card */}
                <Card className="border-l-4" style={{ borderLeftColor: analystColors[analyst].replace("bg-", "#") }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{analysis.title}</h2>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(analysis.timestamp).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <Badge className={analystColors[analyst]}>
                        {analystLabels[analyst]}
                      </Badge>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
                  </div>
                </Card>

                {/* Insights */}
                {analysis.insights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Insights Principais
                    </h3>
                    <div className="grid gap-3">
                      {analysis.insights.map((insight, idx) => (
                        <Card key={idx} className="p-4 bg-gray-900">
                          <p className="text-gray-200">{insight}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {analysis.alerts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Alertas
                    </h3>
                    <div className="grid gap-3">
                      {analysis.alerts.map((alert, idx) => {
                        const alertColors = {
                          critical: "bg-red-900 border-red-700",
                          warning: "bg-yellow-900 border-yellow-700",
                          info: "bg-blue-900 border-blue-700",
                        };
                        return (
                          <Card
                            key={idx}
                            className={`p-4 border ${alertColors[alert.type]}`}
                          >
                            <div className="flex items-start gap-3">
                              <Badge
                                variant="outline"
                                className={
                                  alert.type === "critical"
                                    ? "border-red-500 text-red-500"
                                    : alert.type === "warning"
                                      ? "border-yellow-500 text-yellow-500"
                                      : "border-blue-500 text-blue-500"
                                }
                              >
                                {alert.type.toUpperCase()}
                              </Badge>
                              <p className="text-gray-200">{alert.message}</p>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Recomendações
                    </h3>
                    <div className="grid gap-4">
                      {analysis.recommendations.map((rec, idx) => {
                        const impactColors = {
                          high: "bg-red-900 text-red-200",
                          medium: "bg-yellow-900 text-yellow-200",
                          low: "bg-blue-900 text-blue-200",
                        };
                        const effortColors = {
                          high: "bg-red-950",
                          medium: "bg-yellow-950",
                          low: "bg-green-950",
                        };
                        return (
                          <Card key={idx} className="p-4 bg-gray-900">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <p className="text-gray-200 font-medium flex-1">{rec.action}</p>
                              <div className="flex gap-2 flex-shrink-0">
                                <Badge className={impactColors[rec.impact]}>
                                  Impacto: {rec.impact}
                                </Badge>
                                <Badge className={effortColors[rec.effort]}>
                                  Esforço: {rec.effort}
                                </Badge>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Empty State */}
      {analyses.length === 0 && !isLoading && (
        <Card className="p-12 text-center">
          <Zap className="w-12 h-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma análise executada</h3>
          <p className="text-gray-400 mb-6">
            Clique no botão acima para executar uma análise completa com todos os 5 analistas
          </p>
          <Button onClick={handleRunAnalysis} className="gap-2">
            <Zap className="w-4 h-4" />
            Começar Análise
          </Button>
        </Card>
      )}
    </div>
  );
}
