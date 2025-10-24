
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Plus, 
  ExternalLink, 
  Edit, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Shield,
  Eye,
  Activity,
  Settings,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Skin {
  id: string;
  nome: string;
  link: string;
  precoAlvo: number;
  precoAtual: number | null;
  status: string;
  tipoAlerta: string;
  imagemUrl: string | null;
  createdAt: string;
  updatedAt: string;
  alertas?: Alerta[];
}

interface Alerta {
  id: string;
  skinId: string;
  precoAtingido: number;
  dataAlerta: string;
  skin?: {
    nome: string;
    link: string;
    imagemUrl: string | null;
  };
}

interface FormData {
  nome: string;
  link: string;
  precoAlvo: string;
  tipoAlerta: string;
  imagemUrl: string;
}

interface Configuracao {
  id: string;
  email: string | null;
  webhookDiscord: string | null;
  discordRoleMention: string | null;
  alertasEmail: boolean;
  alertasDiscord: boolean;
  ultimaVerificacao: string | null;
}

export function SkinsMonitorApp() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkin, setEditingSkin] = useState<Skin | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    link: "",
    precoAlvo: "",
    tipoAlerta: "compra",
    imagemUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [configForm, setConfigForm] = useState({
    email: "",
    webhookDiscord: "",
    discordRoleMention: "",
    alertasEmail: true,
    alertasDiscord: true
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isVerificando, setIsVerificando] = useState(false);
  const { toast } = useToast();

  // Carrega dados iniciais
  useEffect(() => {
    fetchSkins();
    fetchAlertas();
    fetchConfig();
  }, []);

  const fetchSkins = async () => {
    try {
      const response = await fetch("/api/skins");
      const result = await response.json();
      if (result.success) {
        setSkins(result.data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar skins:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as skins",
        variant: "destructive",
      });
    }
  };

  const fetchAlertas = async () => {
    try {
      const response = await fetch("/api/alerts");
      const result = await response.json();
      if (result.success) {
        setAlertas(result.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/config");
      const result = await response.json();
      if (result.success && result.data) {
        setConfig(result.data);
        setConfigForm({
          email: result.data.email || "",
          webhookDiscord: result.data.webhookDiscord || "",
          discordRoleMention: result.data.discordRoleMention || "",
          alertasEmail: result.data.alertasEmail ?? true,
          alertasDiscord: result.data.alertasDiscord ?? true
        });
      }
    } catch (error) {
      console.error("Erro ao buscar configuração:", error);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);

    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configForm),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        fetchConfig();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao salvar configuração",
        variant: "destructive",
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleVerificarPrecos = async () => {
    setIsVerificando(true);

    try {
      toast({
        title: "Verificando preços...",
        description: "Aguarde enquanto verificamos os preços das skins",
      });

      const response = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "manual" })
      });

      const result = await response.json();

      if (result.success) {
        // Mostra mensagem detalhada
        let descricao = result.message;
        
        // Se houver skins com falha, mostra quais foram
        if (result.skinsFalha > 0 && result.skinsFalhadas?.length > 0) {
          descricao += '\n\nSkins com erro:';
          result.skinsFalhadas.forEach((skin: any) => {
            descricao += `\n• ${skin.nome}: ${skin.erro}`;
          });
        }
        
        toast({
          title: result.skinsFalha > 0 ? "Verificação concluída com erros" : "Verificação concluída!",
          description: descricao,
          variant: result.skinsFalha > 0 ? "destructive" : "default",
        });
        fetchSkins();
        fetchAlertas();
        fetchConfig();
      } else {
        throw new Error(result.message || result.error);
      }
    } catch (error: any) {
      console.error("Erro ao verificar preços:", error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao verificar preços",
        variant: "destructive",
      });
    } finally {
      setIsVerificando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.link || !formData.precoAlvo) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, link e preço alvo",
        variant: "destructive",
      });
      return;
    }

    const precoNumerico = parseFloat(formData.precoAlvo.replace(",", "."));
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      toast({
        title: "Preço inválido",
        description: "Digite um preço válido maior que zero",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingSkin ? `/api/skins/${editingSkin.id}` : "/api/skins";
      const method = editingSkin ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          link: formData.link.trim(),
          precoAlvo: precoNumerico,
          tipoAlerta: formData.tipoAlerta,
          imagemUrl: formData.imagemUrl?.trim() || null
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        resetForm();
        fetchSkins();
        setIsDialogOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erro ao salvar skin:", error);
      toast({
        title: "Erro",
        description: error?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja remover "${nome}" do monitoramento?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/skins/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Removido",
          description: result.message,
        });
        fetchSkins();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erro ao remover skin:", error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao remover skin",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (skin: Skin) => {
    setEditingSkin(skin);
    setFormData({
      nome: skin.nome,
      link: skin.link,
      precoAlvo: skin.precoAlvo.toString(),
      tipoAlerta: skin.tipoAlerta || "compra",
      imagemUrl: skin.imagemUrl || ""
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ nome: "", link: "", precoAlvo: "", tipoAlerta: "compra", imagemUrl: "" });
    setEditingSkin(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "ativo": <Badge className="status-ativo">Ativo</Badge>,
      "alerta_enviado": <Badge className="status-alerta-enviado">Alerta enviado</Badge>,
      "inativo": <Badge className="status-inativo">Inativo</Badge>
    };
    return statusMap[status as keyof typeof statusMap] || <Badge variant="outline">{status}</Badge>;
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "---";
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen cs2-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cs2-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 cs2-accent" />
              <div>
                <h1 className="text-2xl font-bold">CS2 Skin Monitor</h1>
                <p className="text-sm text-muted-foreground">
                  Monitore preços de skins do Counter-Strike 2
                </p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="cs2-button" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Skin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingSkin ? "Editar Skin" : "Adicionar Nova Skin"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSkin 
                      ? "Edite as informações da skin monitorada" 
                      : "Adicione uma nova skin para monitoramento de preço"
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome da Skin *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: AK-47 | Redline"
                      className="cs2-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="link">Link da Skin *</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="URL da Steam Market ou marketplace"
                      className="cs2-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="precoAlvo">Preço Alvo (R$) *</Label>
                    <Input
                      id="precoAlvo"
                      value={formData.precoAlvo}
                      onChange={(e) => setFormData({ ...formData, precoAlvo: e.target.value })}
                      placeholder="50,00"
                      className="cs2-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tipoAlerta">Tipo de Alerta *</Label>
                    <Select
                      value={formData.tipoAlerta}
                      onValueChange={(value) => setFormData({ ...formData, tipoAlerta: value })}
                    >
                      <SelectTrigger className="cs2-input">
                        <SelectValue placeholder="Selecione o tipo de alerta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compra">
                          🔽 Alerta de Compra (preço baixo)
                        </SelectItem>
                        <SelectItem value="venda">
                          🔼 Alerta de Venda (preço alto)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.tipoAlerta === 'compra' 
                        ? '🔽 Você será alertado quando o preço cair para o valor alvo ou menos' 
                        : '🔼 Você será alertado quando o preço subir para o valor alvo ou mais'}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="imagemUrl">URL da Imagem (opcional)</Label>
                    <Input
                      id="imagemUrl"
                      value={formData.imagemUrl}
                      onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
                      placeholder="URL da imagem da skin"
                      className="cs2-input"
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="cs2-button" disabled={isSubmitting}>
                      {isSubmitting 
                        ? "Salvando..." 
                        : (editingSkin ? "Atualizar" : "Adicionar")
                      }
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="skins" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto mb-8">
            <TabsTrigger 
              value="skins" 
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Skins Monitoradas
            </TabsTrigger>
            <TabsTrigger 
              value="alertas" 
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Histórico de Alertas
            </TabsTrigger>
            <TabsTrigger 
              value="config" 
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skins">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cs2-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Skins
                    </CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold cs2-accent">{skins?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      sendo monitoradas
                    </p>
                  </CardContent>
                </Card>

                <Card className="cs2-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Alertas Hoje
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">
                      {alertas?.filter(a => {
                        const today = new Date().toDateString();
                        return new Date(a.dataAlerta).toDateString() === today;
                      })?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      alertas disparados
                    </p>
                  </CardContent>
                </Card>

                <Card className="cs2-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Ativas
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">
                      {skins?.filter(s => s.status === "ativo")?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      skins ativas
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Skins */}
              {skins?.length === 0 ? (
                <Card className="cs2-card">
                  <CardContent className="py-16 text-center">
                    <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhuma skin sendo monitorada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione sua primeira skin para começar o monitoramento
                    </p>
                    <Button 
                      className="cs2-button"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Skin
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence>
                    {skins?.map((skin, index) => (
                      <motion.div
                        key={skin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="cs2-card">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  {skin.imagemUrl ? (
                                    <img
                                      src={skin.imagemUrl}
                                      alt={skin.nome}
                                      className="w-10 h-10 object-cover rounded"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <Target className="h-6 w-6 text-muted-foreground" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg truncate">
                                    {skin.nome}
                                  </h3>
                                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                                    <span className="text-sm text-muted-foreground">
                                      Alvo: <span className="cs2-accent font-medium">
                                        {formatPrice(skin.precoAlvo)}
                                      </span>
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      Atual: <span className="font-medium">
                                        {formatPrice(skin.precoAtual)}
                                      </span>
                                    </span>
                                    {getStatusBadge(skin.status)}
                                    <Badge variant={skin.tipoAlerta === 'compra' ? 'default' : 'secondary'} className="text-xs">
                                      {skin.tipoAlerta === 'compra' ? '🔽 Compra' : '🔼 Venda'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(skin.link, "_blank")}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(skin)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(skin.id, skin.nome)}
                                  className="hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="alertas">
            <div className="space-y-6">
              {alertas?.length === 0 ? (
                <Card className="cs2-card">
                  <CardContent className="py-16 text-center">
                    <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhum alerta ainda
                    </h3>
                    <p className="text-muted-foreground">
                      Quando suas skins atingirem o preço alvo, os alertas aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {alertas?.map((alerta, index) => (
                    <motion.div
                      key={alerta.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Alert className="cs2-card border-orange-500/50">
                        <AlertCircle className="h-4 w-4 cs2-accent" />
                        <div className="flex-1">
                          <AlertDescription className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">
                                {alerta.skin?.nome}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Preço atingido: <span className="cs2-accent font-medium">
                                  {formatPrice(alerta.precoAtingido)}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(alerta.dataAlerta)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {alerta.skin?.link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(alerta.skin?.link, "_blank")}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </AlertDescription>
                        </div>
                      </Alert>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="config">
            <div className="space-y-6 max-w-2xl mx-auto">
              <Card className="cs2-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 cs2-accent" />
                    Configurações de Alertas
                  </CardTitle>
                  <CardDescription>
                    Configure o email para receber alertas quando os preços atingirem o alvo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveConfig} className="space-y-6">
                    {/* Email para Alertas */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-base font-semibold">
                        <Mail className="h-4 w-4" />
                        Email para Alertas
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={configForm.email}
                        onChange={(e) => 
                          setConfigForm({ ...configForm, email: e.target.value })
                        }
                        placeholder="seu@email.com"
                        className="cs2-input"
                      />
                      <p className="text-xs text-muted-foreground">
                        Você receberá alertas neste email quando os preços das skins atingirem o preço alvo definido
                      </p>
                    </div>

                    {/* Webhook Discord */}
                    <div className="space-y-2">
                      <Label htmlFor="webhookDiscord" className="flex items-center gap-2 text-base font-semibold">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Webhook Discord (Opcional)
                      </Label>
                      <Input
                        id="webhookDiscord"
                        type="url"
                        value={configForm.webhookDiscord}
                        onChange={(e) => 
                          setConfigForm({ ...configForm, webhookDiscord: e.target.value })
                        }
                        placeholder="https://discord.com/api/webhooks/..."
                        className="cs2-input"
                      />
                      <p className="text-xs text-muted-foreground">
                        Cole aqui a URL do webhook do seu canal Discord para receber alertas também lá.{" "}
                        <a 
                          href="https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:underline"
                        >
                          Como criar um webhook?
                        </a>
                      </p>
                    </div>

                    {/* Discord Role Mention */}
                    <div className="space-y-2">
                      <Label htmlFor="discordRoleMention" className="flex items-center gap-2 text-base font-semibold">
                        <Shield className="h-4 w-4" />
                        ID da Role do Discord (Opcional)
                      </Label>
                      <Input
                        id="discordRoleMention"
                        type="text"
                        value={configForm.discordRoleMention}
                        onChange={(e) => 
                          setConfigForm({ ...configForm, discordRoleMention: e.target.value })
                        }
                        placeholder="123456789012345678"
                        className="cs2-input"
                      />
                      <p className="text-xs text-muted-foreground">
                        Para mencionar uma role específica nos alertas, cole aqui o <strong>ID da role</strong> do Discord.
                        <br />
                        <strong>Como obter o ID:</strong> No Discord, vá em Configurações do Servidor → Roles → Clique nos 3 pontinhos da role → Copiar ID da Role
                        <br />
                        <em>Exemplo: Se você quiser mencionar @OhnePixel, cole o ID numérico da role aqui</em>
                      </p>
                    </div>

                    {/* Switches para ativar/desativar alertas */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="alertasEmail" className="text-base font-semibold">
                            Ativar Alertas por Email
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Receba notificações no email configurado acima
                          </p>
                        </div>
                        <Switch
                          id="alertasEmail"
                          checked={configForm.alertasEmail}
                          onCheckedChange={(checked) =>
                            setConfigForm({ ...configForm, alertasEmail: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="alertasDiscord" className="text-base font-semibold">
                            Ativar Alertas por Discord
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Receba notificações no canal Discord configurado acima
                          </p>
                        </div>
                        <Switch
                          id="alertasDiscord"
                          checked={configForm.alertasDiscord}
                          onCheckedChange={(checked) =>
                            setConfigForm({ ...configForm, alertasDiscord: checked })
                          }
                        />
                      </div>
                    </div>

                    {/* Informações adicionais */}
                    {config?.ultimaVerificacao && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 inline mr-2" />
                          Última verificação: {formatDate(config.ultimaVerificacao)}
                        </p>
                      </div>
                    )}

                    {/* Alerta sobre o monitoramento */}
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Como funciona:</strong>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• O sistema verifica automaticamente os preços das skins através de um cron job externo a cada 15 minutos</li>
                          <li>• Você pode receber alertas por <strong>Email</strong> e/ou <strong>Discord</strong></li>
                          <li>• Suporte a alertas de <strong>Compra</strong> (quando preço cai) e <strong>Venda</strong> (quando preço sobe)</li>
                          <li>• Configure pelo menos um método de notificação abaixo</li>
                          <li>• Você pode verificar os preços manualmente a qualquer momento clicando em "Verificar Agora"</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleVerificarPrecos}
                        disabled={isVerificando || (!configForm.email && !configForm.webhookDiscord)}
                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      >
                        {isVerificando ? "Verificando..." : "🔍 Verificar Agora"}
                      </Button>
                      <Button
                        type="submit"
                        className="cs2-button"
                        disabled={isSavingConfig || (!configForm.email && !configForm.webhookDiscord)}
                      >
                        {isSavingConfig ? "Salvando..." : "Salvar Configurações"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Card de informações do cron */}
              <Card className="cs2-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 cs2-accent" />
                    Monitoramento Automático
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      O monitoramento automático está configurado no <strong>cron-job.org</strong> e verifica os preços das skins periodicamente.
                    </p>
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <p className="text-sm font-medium">Configurações do Cron Job:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• URL: <code className="text-xs bg-background px-1 py-0.5 rounded">https://csskin.abacusai.app/api/monitor</code></li>
                        <li>• Método: POST</li>
                        <li>• Intervalo: Configurado no painel do cron-job.org</li>
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Para alterar o intervalo de verificação, acesse seu painel no <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">cron-job.org</a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
