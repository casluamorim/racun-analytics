import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Schedule() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    segment: "",
    channel: "",
    budget: "",
    objective: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Demonstração agendada com sucesso! Entraremos em contato em breve.");
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        city: "",
        segment: "",
        channel: "",
        budget: "",
        objective: "",
        message: ""
      });
    } catch (error) {
      toast.error("Erro ao agendar demonstração. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md py-4">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RA</span>
            </div>
            <span className="text-white font-bold text-lg">Racun Analytics</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/recursos" className="text-slate-300 hover:text-white">Recursos</Link>
            <Link href="/solucoes" className="text-slate-300 hover:text-white">Soluções</Link>
            <Link href="/agendar" className="text-white font-medium">Agendar Demo</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Agende uma Demonstração</h1>
        <p className="text-lg text-slate-300 text-center">
          Conheça Racun Analytics em ação. Preencha o formulário abaixo e um especialista entrará em contato
        </p>
      </section>

      {/* Form */}
      <section className="container max-w-2xl mx-auto px-4 pb-20">
        <Card className="bg-slate-800/50 border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-white mb-2 block">Empresa *</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Nome da empresa"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-white mb-2 block">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white mb-2 block">WhatsApp *</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="text-white mb-2 block">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="São Paulo"
                  value={formData.city}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="segment" className="text-white mb-2 block">Segmento *</Label>
                <Select value={formData.segment} onValueChange={(value) => handleSelectChange("segment", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione um segmento" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="varejo">Varejo</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="channel" className="text-white mb-2 block">Canal de Interesse *</Label>
                <Select value={formData.channel} onValueChange={(value) => handleSelectChange("channel", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione um canal" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="tiktok">TikTok Ads</SelectItem>
                    <SelectItem value="marketplaces">Marketplaces</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget" className="text-white mb-2 block">Orçamento Mensal *</Label>
                <Select value={formData.budget} onValueChange={(value) => handleSelectChange("budget", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione a faixa" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="1000-5000">R$ 1.000 - R$ 5.000</SelectItem>
                    <SelectItem value="5000-10000">R$ 5.000 - R$ 10.000</SelectItem>
                    <SelectItem value="10000-50000">R$ 10.000 - R$ 50.000</SelectItem>
                    <SelectItem value="50000+">R$ 50.000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Objective */}
            <div>
              <Label htmlFor="objective" className="text-white mb-2 block">Objetivo Principal *</Label>
              <Select value={formData.objective} onValueChange={(value) => handleSelectChange("objective", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione um objetivo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="aumentar-vendas">Aumentar vendas</SelectItem>
                  <SelectItem value="reduzir-cac">Reduzir CAC</SelectItem>
                  <SelectItem value="melhorar-roas">Melhorar ROAS</SelectItem>
                  <SelectItem value="otimizar-margem">Otimizar margem</SelectItem>
                  <SelectItem value="centralizar-dados">Centralizar dados</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-white mb-2 block">Mensagem (opcional)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Conte-nos mais sobre seus desafios..."
                value={formData.message}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-32"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              {isSubmitting ? "Agendando..." : "Agendar Demonstração"}
            </Button>

            <p className="text-slate-400 text-sm text-center">
              Entraremos em contato em até 24 horas para confirmar seu agendamento
            </p>
          </form>
        </Card>
      </section>
    </div>
  );
}
