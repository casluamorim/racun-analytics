# Sistema de Solicitações e Aprovações - Racun Analytics

## Visão Geral

O sistema de solicitações permite que clientes solicitem alterações em campanhas, ajustes de orçamento e outras ações comerciais dentro do portal. Todas as solicitações passam por um fluxo de aprovação com auditoria completa.

---

## Tipos de Solicitação

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `campaign_change` | Alterar configurações da campanha | Mudar público-alvo, creative, landing page |
| `budget_adjustment` | Ajustar orçamento da campanha | Aumentar/diminuir investimento diário |
| `campaign_pause` | Pausar campanha ativa | Pausar campanha com baixo desempenho |
| `campaign_resume` | Retomar campanha pausada | Reativar campanha após otimizações |
| `audience_change` | Alterar público-alvo | Expandir para nova faixa etária |
| `creative_change` | Alterar criativos | Trocar imagens, vídeos, copy |
| `bid_change` | Alterar lance/bid | Aumentar/diminuir CPC máximo |
| `other` | Outro tipo de solicitação | Solicitações customizadas |

---

## Estados de Solicitação

```
pending → approved → in_progress → completed
         ↓
       rejected
         ↓
      cancelled
```

| Estado | Descrição |
|--------|-----------|
| `pending` | Aguardando aprovação |
| `approved` | Aprovada, pronta para implementação |
| `rejected` | Rejeitada com motivo |
| `cancelled` | Cancelada pelo cliente |
| `in_progress` | Sendo implementada |
| `completed` | Implementada com sucesso |

---

## Prioridades

- **low** - Baixa prioridade, pode esperar
- **medium** - Prioridade normal
- **high** - Alta prioridade, implementar em breve
- **critical** - Crítica, implementar imediatamente

---

## API - Endpoints tRPC

### Criar Solicitação

```typescript
trpc.requests.create.useMutation({
  clientId: 1,
  type: "budget_adjustment",
  priority: "high",
  title: "Aumentar orçamento Meta",
  description: "Campanha performando bem",
  campaignId: "meta-123",
  campaignName: "Summer Sale",
  currentBudget: 5000,
  requestedBudget: 10000,
  budgetCurrency: "BRL"
})
```

**Resposta:**
```json
{
  "success": true,
  "requestId": 42
}
```

---

### Obter Solicitação

```typescript
trpc.requests.getById.useQuery({
  requestId: 42
})
```

**Resposta:**
```json
{
  "success": true,
  "request": {
    "id": 42,
    "clientId": 1,
    "userId": 1,
    "type": "budget_adjustment",
    "status": "pending",
    "priority": "high",
    "title": "Aumentar orçamento Meta",
    "description": "Campanha performando bem",
    "campaignId": "meta-123",
    "campaignName": "Summer Sale",
    "currentBudget": 5000,
    "requestedBudget": 10000,
    "budgetCurrency": "BRL",
    "createdAt": "2026-03-12T20:40:00Z",
    "updatedAt": "2026-03-12T20:40:00Z"
  }
}
```

---

### Listar Solicitações do Cliente

```typescript
trpc.requests.listByClient.useQuery({
  clientId: 1,
  status: "pending", // opcional
  limit: 50,
  offset: 0
})
```

---

### Listar Solicitações Pendentes (Admin)

```typescript
trpc.requests.listPending.useQuery({
  limit: 50,
  offset: 0
})
```

---

### Aprovar Solicitação

```typescript
trpc.requests.approve.useMutation({
  requestId: 42
})
```

---

### Rejeitar Solicitação

```typescript
trpc.requests.reject.useMutation({
  requestId: 42,
  rejectionReason: "Campanha ainda tem potencial, vamos otimizar primeiro"
})
```

---

### Marcar como Implementada

```typescript
trpc.requests.markAsImplemented.useMutation({
  requestId: 42
})
```

---

### Adicionar Comentário

```typescript
trpc.requests.addComment.useMutation({
  requestId: 42,
  comment: "Ótima solicitação, vamos implementar",
  isInternal: false // true = apenas para admin
})
```

---

### Obter Comentários

```typescript
trpc.requests.getComments.useQuery({
  requestId: 42,
  includeInternal: false
})
```

---

### Obter Logs de Auditoria

```typescript
trpc.requests.getAuditLogs.useQuery({
  requestId: 42
})
```

**Resposta:**
```json
{
  "success": true,
  "logs": [
    {
      "id": 1,
      "requestId": 42,
      "userId": 1,
      "action": "created",
      "oldStatus": null,
      "newStatus": "pending",
      "reason": "Solicitação criada",
      "createdAt": "2026-03-12T20:40:00Z"
    },
    {
      "id": 2,
      "requestId": 42,
      "userId": 2,
      "action": "approved",
      "oldStatus": "pending",
      "newStatus": "approved",
      "reason": "Solicitação aprovada",
      "createdAt": "2026-03-12T20:45:00Z"
    }
  ]
}
```

---

### Obter Estatísticas

```typescript
trpc.requests.getStats.useQuery({
  clientId: 1
})
```

**Resposta:**
```json
{
  "success": true,
  "stats": {
    "total": 15,
    "pending": 3,
    "approved": 8,
    "rejected": 2,
    "completed": 2
  }
}
```

---

### Cancelar Solicitação

```typescript
trpc.requests.cancel.useMutation({
  requestId: 42,
  reason: "Mudança de estratégia"
})
```

---

## Banco de Dados

### Tabela: requests

```sql
CREATE TABLE requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  userId INT NOT NULL,
  requestType ENUM(...) NOT NULL,
  requestStatus ENUM(...) NOT NULL DEFAULT 'pending',
  requestPriority ENUM(...) NOT NULL DEFAULT 'medium',
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  campaignId VARCHAR(255),
  campaignName VARCHAR(255),
  currentValue JSON,
  requestedValue JSON,
  estimatedImpact LONGTEXT,
  currentBudget DECIMAL(10, 2),
  requestedBudget DECIMAL(10, 2),
  budgetCurrency VARCHAR(3) DEFAULT 'BRL',
  approvedBy INT,
  approvedAt TIMESTAMP NULL,
  rejectionReason LONGTEXT,
  implementedBy INT,
  implementedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_clientId (clientId),
  INDEX idx_status (requestStatus),
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
);
```

---

### Tabela: requestComments

```sql
CREATE TABLE requestComments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requestId INT NOT NULL,
  userId INT NOT NULL,
  comment LONGTEXT NOT NULL,
  isInternal INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES requests(id) ON DELETE CASCADE
);
```

---

### Tabela: requestAuditLogs

```sql
CREATE TABLE requestAuditLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requestId INT NOT NULL,
  userId INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  oldStatus VARCHAR(50),
  newStatus VARCHAR(50),
  changes JSON,
  reason LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES requests(id) ON DELETE CASCADE
);
```

---

## Fluxo de Aprovação

### 1. Cliente Cria Solicitação

```
Cliente → Preenche formulário → Submete solicitação
```

### 2. Admin Revisa

```
Admin → Vê solicitação pendente → Adiciona comentários → Aprova/Rejeita
```

### 3. Implementação

```
Agência → Implementa alteração → Marca como completa
```

### 4. Auditoria

```
Sistema → Registra todas as ações → Mantém histórico completo
```

---

## Boas Práticas

✅ **Sempre adicionar comentários** ao aprovar/rejeitar para comunicar decisão
✅ **Usar prioridades adequadas** para gerenciar fluxo de trabalho
✅ **Revisar regularmente** solicitações pendentes
✅ **Manter auditoria** para conformidade e rastreamento
✅ **Notificar cliente** sobre mudanças de status

---

## Próximas Melhorias

- [ ] Notificações automáticas por email/WhatsApp
- [ ] Webhooks para integração com sistemas externos
- [ ] Agendamento de implementação
- [ ] Histórico de mudanças detalhado
- [ ] Relatórios de solicitações
- [ ] SLA de aprovação
