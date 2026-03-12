import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <PortalLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Configurações</h2>
          <p className="text-slate-400">Gerencie suas preferências e configurações</p>
        </div>

        {/* Perfil */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Perfil</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Nome Completo</Label>
              <Input
                defaultValue="João Silva"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">E-mail</Label>
              <Input
                type="email"
                defaultValue="joao@example.com"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Telefone</Label>
              <Input
                defaultValue="(11) 99999-9999"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Salvar Alterações</Button>
          </div>
        </Card>

        {/* Relatórios */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Configuração de Relatórios</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Frequência</Label>
              <Select defaultValue="weekly">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="biweekly">Quinzenal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white mb-2 block">Dia da Semana</Label>
              <Select defaultValue="sunday">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="sunday">Domingo</SelectItem>
                  <SelectItem value="monday">Segunda-feira</SelectItem>
                  <SelectItem value="tuesday">Terça-feira</SelectItem>
                  <SelectItem value="wednesday">Quarta-feira</SelectItem>
                  <SelectItem value="thursday">Quinta-feira</SelectItem>
                  <SelectItem value="friday">Sexta-feira</SelectItem>
                  <SelectItem value="saturday">Sábado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white mb-2 block">Horário</Label>
              <Input
                type="time"
                defaultValue="16:00"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Fuso Horário</Label>
              <Select defaultValue="sao-paulo">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="sao-paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="brasilia">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="manaus">Manaus (GMT-4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Canais de Notificação */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Canais de Notificação</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">E-mail</p>
                <p className="text-sm text-slate-400">Receber relatórios por e-mail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">WhatsApp</p>
                <p className="text-sm text-slate-400">Receber resumo por WhatsApp</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificações de Alerta</p>
                <p className="text-sm text-slate-400">Alertas de performance baixa</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Segurança */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Segurança</h3>
          <div className="space-y-4">
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
              Autenticação de Dois Fatores
            </Button>
            <Button variant="outline" className="w-full border-red-600 text-red-400 hover:bg-red-500/10">
              Sair de Todas as Sessões
            </Button>
          </div>
        </Card>

        {/* Zona de Perigo */}
        <Card className="bg-red-500/10 border-red-500/30 p-6">
          <h3 className="text-lg font-bold text-red-400 mb-4">Zona de Perigo</h3>
          <p className="text-slate-300 mb-4">
            Ações irreversíveis. Tenha cuidado ao usar estas opções.
          </p>
          <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/10">
            Deletar Conta
          </Button>
        </Card>
      </div>
    </PortalLayout>
  );
}
