
export interface Gift {
  id: string;
  donorId: string;
  donorName: string;
  date: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed';
  paymentMethod: 'online' | 'offline';
  paymentInstrument: 'card' | 'ach' | 'check' | 'cash';
  paymentLabel?: string;
  type: 'one-time' | 'recurring';
  recurringInfo?: {
    frequency: string;
    startDate: string;
    nextPaymentDate: string;
  };
  failureReason?: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'completed';
  priority: 'high' | 'medium' | 'low';
  type: 'call' | 'email' | 'todo' | 'meeting';
  dueDate: string; // ISO Date string
  donorId?: string; // Link to a donor
  createdAt: string;
}
