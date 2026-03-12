import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Relatório Semanal - 05 a 11 de Março",
    type: "Executivo",
    date: "11/03/2026",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Relatório Semanal - 26 de Fevereiro a 04 de Março",
    type: "Técnico",
    date: "04/03/2026",
    size: "3.1 MB",
  },
  {
    id: 3,
    title: "Relatório Mensal - Fevereiro 2026",
    type: "Executivo",
    date: "01/03/2026",
    size: "5.2 MB",
  },
];

export default function Reports() {
  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Relatórios</h2>
          <p className="text-slate-400">Acesse seus relatórios automáticos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Próximo Relatório</p>
            <p className="text-2xl font-bold text-white mb-4">Domingo, 16 de Março</p>
            <p className="text-sm text-slate-400">Tipo: Executivo</p>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Frequência</p>
            <p className="text-2xl font-bold text-white mb-4">Semanal</p>
            <p className="text-sm text-slate-400">Toda segunda-feira às 16:00</p>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Canais de Entrega</p>
            <p className="text-2xl font-bold text-white mb-4">3</p>
            <p className="text-sm text-slate-400">E-mail, WhatsApp, PDF</p>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Histórico de Relatórios</h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id} className="bg-slate-800/50 border-slate-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{report.title}</p>
                    <div className="flex gap-4 text-sm text-slate-400 mt-1">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
