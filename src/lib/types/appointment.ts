export interface IAppointment {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  serviceCategory?: string;
  servicePrice: number;
  serviceDuration?: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  stripeSessionId?: string;
  createdAt: string;
  updatedAt?: string;
}
