import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { useState } from "react";

const leads = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    company: "Tech Solutions",
    stage: "proposal",
    value: "R$ 50.000",
    lastInteraction: "2 dias atrás",
    owner: "Maria Santos",
  },
  {
    id: 2,
    name: "Ana Costa",
    email: "ana@example.com",
    company: "Marketing Plus",
    stage: "demo",
    value: "R$ 30.000",
    lastInteraction: "1 dia atrás",
    owner: "Carlos Oliveira",
  },
  {
    id: 3,
    name: "Pedro Mendes",
    email: "pedro@example.com",
    company: "Digital Agency",
    stage: "qualified",
    value: "R$ 75.000",
    lastInteraction: "3 horas atrás",
    owner: "Maria Santos",
  },
  {
    id: 4,
    name: "Lucia Ferreira",
    email: "lucia@example.com",
    company: "E-commerce Brasil",
    stage: "new",
    value: "R$ 20.000",
    lastInteraction: "Hoje",
    owner: "João Costa",
  },
  {
    id: 5,
    name: "Roberto Alves",
    email: "roberto@example.com",
    company: "Logistics Corp",
    stage: "negotiation",
    value: "R$ 100.000",
    lastInteraction: "5 horas atrás",
    owner: "Carlos Oliveira",
  },
];

const stageColors: Record<string, string> = {
  new: "bg-slate-500/20 text-slate-300",
  qualified: "bg-blue-500/20 text-blue-300",
  demo: "bg-cyan-500/20 text-cyan-300",
  proposal: "bg-purple-500/20 text-purple-300",
  negotiation: "bg-yellow-500/20 text-yellow-300",
  converted: "bg-green-500/20 text-green-300",
  lost: "bg-red-500/20 text-red-300",
};

const stageLabels: Record<string, string> = {
  new: "Novo",
  qualified: "Qualificado",
  demo: "Demo",
  proposal: "Proposta",
  negotiation: "Negociação",
  converted: "Convertido",
  lost: "Perdido",
};

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !selectedStage || lead.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const stageStats = [
    { stage: "new", label: "Novo", count: leads.filter((l) => l.stage === "new").length },
    { stage: "qualified", label: "Qualificado", count: leads.filter((l) => l.stage === "qualified").length },
    { stage: "demo", label: "Demo", count: leads.filter((l) => l.stage === "demo").length },
    { stage: "proposal", label: "Proposta", count: leads.filter((l) => l.stage === "proposal").length },
    { stage: "negotiation", label: "Negociação", count: leads.filter((l) => l.stage === "negotiation").length },
  ];

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">CRM - Funil de Vendas</h2>
            <p className="text-slate-400">Gerencie seus leads e oportunidades</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        {/* Stage Stats */}
        <div className="grid grid-cols-5 gap-4">
          {stageStats.map((stat) => (
            <Card
              key={stat.stage}
              className={`bg-slate-800/50 border-slate-700 p-4 cursor-pointer transition ${
                selectedStage === stat.stage ? "border-blue-500 bg-blue-500/10" : ""
              }`}
              onClick={() => setSelectedStage(selectedStage === stat.stage ? null : stat.stage)}
            >
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.count}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Leads Table */}
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Empresa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Estágio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Valor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Responsável</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Última Interação</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-sm text-slate-400">{lead.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{lead.company}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageColors[lead.stage]}`}>
                        {stageLabels[lead.stage]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{lead.value}</td>
                    <td className="px-6 py-4 text-slate-300">{lead.owner}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{lead.lastInteraction}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs">
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Valor Total em Pipeline</p>
            <p className="text-3xl font-bold text-white">R$ 275.000</p>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Taxa de Conversão</p>
            <p className="text-3xl font-bold text-white">18%</p>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Ciclo de Venda Médio</p>
            <p className="text-3xl font-bold text-white">45 dias</p>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
