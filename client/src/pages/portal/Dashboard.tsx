import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data - em produção virá da API
const campaignData = [
  { date: "01/03", spend: 1200, conversions: 45, roas: 3.2 },
  { date: "02/03", spend: 1500, conversions: 52, roas: 3.5 },
  { date: "03/03", spend: 1800, conversions: 68, roas: 3.8 },
  { date: "04/03", spend: 1400, conversions: 55, roas: 3.4 },
  { date: "05/03", spend: 2000, conversions: 78, roas: 4.1 },
  { date: "06/03", spend: 1900, conversions: 72, roas: 3.9 },
  { date: "07/03", spend: 2100, conversions: 85, roas: 4.3 },
];

const channelData = [
  { name: "Meta Ads", value: 45, color: "#3b82f6" },
  { name: "Google Ads", value: 30, color: "#06b6d4" },
  { name: "TikTok Ads", value: 15, color: "#8b5cf6" },
  { name: "Organic", value: 10, color: "#10b981" },
];

const marketplaceData = [
  { marketplace: "Mercado Livre", sales: 15000, orders: 245, conversion: 2.1 },
  { marketplace: "Shopee", sales: 12000, orders: 180, conversion: 1.8 },
  { marketplace: "Amazon", sales: 8000, orders: 95, conversion: 1.2 },
];

const KPICard = ({
  title,
  value,
  unit,
  change,
  isPositive,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  isPositive?: boolean;
  icon: React.ComponentType<{ className: string }>;
}) => (
  <Card className="bg-slate-800/50 border-slate-700 p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">{value}</p>
          {unit && <span className="text-slate-400 text-sm">{unit}</span>}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {isPositive ? "+" : ""}{change}%
            </span>
          </div>
        )}
      </div>
      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
    </div>
  </Card>
);

export default function Dashboard() {
  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard Executivo</h2>
          <p className="text-slate-400">Visão geral do seu desempenho de marketing e vendas</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <KPICard
            title="Investimento Total"
            value="R$ 12.000"
            unit="últimos 7 dias"
            change={15}
            isPositive={true}
            icon={DollarSign}
          />
          <KPICard
            title="Retorno (ROAS)"
            value="3.8x"
            unit="média"
            change={8}
            isPositive={true}
            icon={TrendingUp}
          />
          <KPICard
            title="Conversões"
            value="455"
            unit="últimos 7 dias"
            change={12}
            isPositive={true}
            icon={Target}
          />
          <KPICard
            title="Leads Qualificados"
            value="128"
            unit="este mês"
            change={5}
            isPositive={true}
            icon={Users}
          />
          <KPICard
            title="Vendas"
            value="R$ 45.000"
            unit="este mês"
            change={22}
            isPositive={true}
            icon={DollarSign}
          />
          <KPICard
            title="Taxa de Conversão"
            value="2.1%"
            unit="média"
            change={-3}
            isPositive={false}
            icon={Zap}
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Investimento e Conversões */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Investimento vs Conversões</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="spend"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Investimento (R$)"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Conversões"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* ROAS por Dia */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">ROAS Diário</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
                <Bar dataKey="roas" fill="#06b6d4" name="ROAS" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Distribuição de Tráfego */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Distribuição de Tráfego</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance por Marketplace */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Marketplaces</h3>
            <div className="space-y-4">
              {marketplaceData.map((item) => (
                <div key={item.marketplace} className="border-b border-slate-700 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{item.marketplace}</span>
                    <span className="text-green-400 font-bold">R$ {item.sales.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{item.orders} pedidos</span>
                    <span>{item.conversion}% conversão</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${(item.sales / 15000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Insights da IA */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30 p-6">
          <h3 className="text-lg font-bold text-white mb-4">💡 Insights da IA</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              ✓ <span className="text-green-400">Oportunidade detectada:</span> Meta Ads teve aumento de 22% em conversões. Considere aumentar o orçamento neste canal.
            </p>
            <p>
              ⚠️ <span className="text-yellow-400">Atenção:</span> TikTok Ads com ROAS abaixo da média. Recomendamos revisar o direcionamento de público.
            </p>
            <p>
              ✓ <span className="text-green-400">Recomendação:</span> Produto "Camiseta Premium" tem margem 35% acima da média. Aumente o investimento em sua promoção.
            </p>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
