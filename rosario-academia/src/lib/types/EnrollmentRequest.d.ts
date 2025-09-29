interface EnrollmentRequest {
  request_id: number;
  request_date: string;
  status: "pending" | "approved" | "rejected";
  requested_schedule: Schedule;
  assigned_schedule: Schedule;
}
