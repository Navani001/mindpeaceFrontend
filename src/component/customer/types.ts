export interface AudienceUser {
  id: number;
  name: string;
  phone_number: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  subscriptions?: Array<{
    id: number;
    status: string;
    subscribed_at: string;
    unsubscribed_at?: string;
    brand: {
      name: string;
      display_name: string;
    };
    agent: {
      name: string;
      display_name: string;
    };
  }>;
  _count?: {
    messages: number;
  };
}

export interface UserBrandSubscription {
  id: number;
  user_id: number;
  brand_id: number;
  agent_id: number;
  status: string;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
  brand?: {
    id: number;
    name: string;
    display_name: string | null;
  };
  agent?: {
    id: number;
    name: string;
    display_name: string | null;
  };
}

export interface CreateUserData {
  phone_number: string;
  name: string;
  country_code: string;
}

export interface UpdateUserData {
  phone_number?: string;
  name?: string;
  country_code?: string;
}

export interface AudienceFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface AudienceResponse {
  users: AudienceUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const subscriptionStatuses = [
  { key: "subscribed", label: "Subscribed", color: "success" },
  { key: "unsubscribed", label: "Unsubscribed", color: "warning" },
  { key: "blocked", label: "Blocked", color: "danger" },
];

export const countryCodes = [
  { key: "+1", label: "+1 (US/Canada)" },
  { key: "+91", label: "+91 (India)" },
  { key: "+44", label: "+44 (UK)" },
  { key: "+49", label: "+49 (Germany)" },
  { key: "+33", label: "+33 (France)" },
  { key: "+81", label: "+81 (Japan)" },
  { key: "+86", label: "+86 (China)" },
  { key: "+55", label: "+55 (Brazil)" },
  { key: "+61", label: "+61 (Australia)" },
  { key: "+971", label: "+971 (UAE)" },
];