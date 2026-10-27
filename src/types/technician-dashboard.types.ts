export interface TechnicianDashboardSummary {
  assignedWorkOrders: number;
  pendingAssignments: number;
  todaysVisits: number;
  completedWorkOrders: number;
}

export interface TechnicianDashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TechnicianDashboardSummary;
}
