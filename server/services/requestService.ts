import mysql from "mysql2/promise";

/**
 * Tipos de solicitação
 */
export type RequestType =
  | "campaign_change"
  | "budget_adjustment"
  | "campaign_pause"
  | "campaign_resume"
  | "audience_change"
  | "creative_change"
  | "bid_change"
  | "other";

export type RequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "in_progress"
  | "completed";

export type RequestPriority = "low" | "medium" | "high" | "critical";

/**
 * Interface de solicitação
 */
export interface CreateRequestInput {
  clientId: number;
  userId: number;
  type: RequestType;
  priority: RequestPriority;
  title: string;
  description?: string;
  campaignId?: string;
  campaignName?: string;
  currentValue?: Record<string, unknown>;
  requestedValue?: Record<string, unknown>;
  estimatedImpact?: string;
  currentBudget?: number;
  requestedBudget?: number;
  budgetCurrency?: string;
}

export interface ApproveRequestInput {
  requestId: number;
  approvedBy: number;
}

export interface RejectRequestInput {
  requestId: number;
  approvedBy: number;
  rejectionReason: string;
}

export interface AddCommentInput {
  requestId: number;
  userId: number;
  comment: string;
  isInternal?: boolean;
}

// Conexão com banco de dados
let pool: mysql.Pool | null = null;

async function getPool(): Promise<mysql.Pool> {
  if (!pool && process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    pool = mysql.createPool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  if (!pool) throw new Error("Database not configured");
  return pool;
}

/**
 * Criar nova solicitação
 */
export async function createRequest(input: CreateRequestInput): Promise<number> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.execute(
      `INSERT INTO requests (
        clientId, userId, requestType, requestStatus, requestPriority,
        title, description, campaignId, campaignName,
        currentValue, requestedValue, estimatedImpact,
        currentBudget, requestedBudget, budgetCurrency
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.clientId,
        input.userId,
        input.type,
        "pending",
        input.priority,
        input.title,
        input.description || null,
        input.campaignId || null,
        input.campaignName || null,
        input.currentValue ? JSON.stringify(input.currentValue) : null,
        input.requestedValue ? JSON.stringify(input.requestedValue) : null,
        input.estimatedImpact || null,
        input.currentBudget || null,
        input.requestedBudget || null,
        input.budgetCurrency || "BRL",
      ]
    );

    const requestId = (result as any).insertId;

    // Criar log de auditoria
    await createAuditLog(requestId, input.userId, "created", null, "pending", "Solicitação criada");

    return requestId;
  } finally {
    connection.release();
  }
}

/**
 * Obter solicitação por ID
 */
export async function getRequestById(requestId: number): Promise<any> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM requests WHERE id = ?`,
      [requestId]
    );

    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

/**
 * Listar solicitações por cliente
 */
export async function getRequestsByClient(
  clientId: number,
  status?: RequestStatus,
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    let query = `SELECT * FROM requests WHERE clientId = ?`;
    const params: any[] = [clientId];

    if (status) {
      query += ` AND requestStatus = ?`;
      params.push(status);
    }

    query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await connection.execute(query, params);
    return (rows as any[]) || [];
  } finally {
    connection.release();
  }
}

/**
 * Listar solicitações pendentes de aprovação
 */
export async function getPendingRequests(
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM requests 
       WHERE requestStatus = 'pending' 
       ORDER BY requestPriority DESC, createdAt ASC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return (rows as any[]) || [];
  } finally {
    connection.release();
  }
}

/**
 * Aprovar solicitação
 */
export async function approveRequest(input: ApproveRequestInput): Promise<boolean> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const request = await getRequestById(input.requestId);
    if (!request) throw new Error("Request not found");

    await connection.execute(
      `UPDATE requests 
       SET requestStatus = 'approved', approvedBy = ?, approvedAt = NOW()
       WHERE id = ?`,
      [input.approvedBy, input.requestId]
    );

    // Criar log de auditoria
    await createAuditLog(
      input.requestId,
      input.approvedBy,
      "approved",
      "pending",
      "approved",
      "Solicitação aprovada"
    );

    return true;
  } finally {
    connection.release();
  }
}

/**
 * Rejeitar solicitação
 */
export async function rejectRequest(input: RejectRequestInput): Promise<boolean> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const request = await getRequestById(input.requestId);
    if (!request) throw new Error("Request not found");

    await connection.execute(
      `UPDATE requests 
       SET requestStatus = 'rejected', approvedBy = ?, approvedAt = NOW(), rejectionReason = ?
       WHERE id = ?`,
      [input.approvedBy, input.rejectionReason, input.requestId]
    );

    // Criar log de auditoria
    await createAuditLog(
      input.requestId,
      input.approvedBy,
      "rejected",
      "pending",
      "rejected",
      input.rejectionReason
    );

    return true;
  } finally {
    connection.release();
  }
}

/**
 * Marcar como implementada
 */
export async function markAsImplemented(
  requestId: number,
  implementedBy: number
): Promise<boolean> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const request = await getRequestById(requestId);
    if (!request) throw new Error("Request not found");

    await connection.execute(
      `UPDATE requests 
       SET requestStatus = 'completed', implementedBy = ?, implementedAt = NOW()
       WHERE id = ?`,
      [implementedBy, requestId]
    );

    // Criar log de auditoria
    await createAuditLog(
      requestId,
      implementedBy,
      "implemented",
      "approved",
      "completed",
      "Solicitação implementada"
    );

    return true;
  } finally {
    connection.release();
  }
}

/**
 * Adicionar comentário
 */
export async function addComment(input: AddCommentInput): Promise<number> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.execute(
      `INSERT INTO requestComments (requestId, userId, comment, isInternal)
       VALUES (?, ?, ?, ?)`,
      [input.requestId, input.userId, input.comment, input.isInternal ? 1 : 0]
    );

    return (result as any).insertId;
  } finally {
    connection.release();
  }
}

/**
 * Obter comentários de uma solicitação
 */
export async function getComments(
  requestId: number,
  includeInternal: boolean = false
): Promise<any[]> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    let query = `SELECT * FROM requestComments WHERE requestId = ?`;
    const params: any[] = [requestId];

    if (!includeInternal) {
      query += ` AND isInternal = 0`;
    }

    query += ` ORDER BY createdAt DESC`;

    const [rows] = await connection.execute(query, params);
    return (rows as any[]) || [];
  } finally {
    connection.release();
  }
}

/**
 * Criar log de auditoria
 */
export async function createAuditLog(
  requestId: number,
  userId: number,
  action: string,
  oldStatus: string | null,
  newStatus: string | null,
  reason?: string
): Promise<number> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.execute(
      `INSERT INTO requestAuditLogs (requestId, userId, action, oldStatus, newStatus, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [requestId, userId, action, oldStatus, newStatus, reason || null]
    );

    return (result as any).insertId;
  } finally {
    connection.release();
  }
}

/**
 * Obter logs de auditoria
 */
export async function getAuditLogs(requestId: number): Promise<any[]> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM requestAuditLogs WHERE requestId = ? ORDER BY createdAt DESC`,
      [requestId]
    );

    return (rows as any[]) || [];
  } finally {
    connection.release();
  }
}

/**
 * Obter estatísticas de solicitações
 */
export async function getRequestStats(clientId: number): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
}> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN requestStatus = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN requestStatus = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN requestStatus = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN requestStatus = 'completed' THEN 1 ELSE 0 END) as completed
       FROM requests WHERE clientId = ?`,
      [clientId]
    );

    const stats = (rows as any[])[0] || {};
    return {
      total: stats.total || 0,
      pending: stats.pending || 0,
      approved: stats.approved || 0,
      rejected: stats.rejected || 0,
      completed: stats.completed || 0,
    };
  } finally {
    connection.release();
  }
}

/**
 * Cancelar solicitação
 */
export async function cancelRequest(
  requestId: number,
  cancelledBy: number,
  reason?: string
): Promise<boolean> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const request = await getRequestById(requestId);
    if (!request) throw new Error("Request not found");

    await connection.execute(
      `UPDATE requests SET requestStatus = 'cancelled' WHERE id = ?`,
      [requestId]
    );

    // Criar log de auditoria
    await createAuditLog(
      requestId,
      cancelledBy,
      "cancelled",
      request.requestStatus,
      "cancelled",
      reason || "Solicitação cancelada"
    );

    return true;
  } finally {
    connection.release();
  }
}
