export type CheckoutStep = 1 | 2 | 3 | 4;

export type ServiceType = "event" | "basic";

export type BusinessSector =
  | "hosteleria"
  | "turismo"
  | "eventos"
  | "retail"
  | "inmobiliaria"
  | "otros";

// Step 1: User Information
export interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  sector: BusinessSector | "";
}

// Step 2: Service/Pack Selection
export interface ServiceSelection {
  serviceType: ServiceType | null;
  planName: string;
}

// Step 3: Service Configuration
export interface ServiceConfig {
  name: string;
  address: string;
  city: string;
  slug?: string;
  // Event-specific fields
  date?: string;
  attendees?: string;
  // Basic-specific fields
  type?: string;
  // Map/GeoJSON data
  geoJsonArea?: GeoJSON.FeatureCollection | null;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
}

// Complete checkout state
export interface CheckoutState {
  currentStep: CheckoutStep;
  userInfo: UserInfo;
  serviceSelection: ServiceSelection;
  serviceConfig: ServiceConfig;
}

// Initial state
export const initialCheckoutState: CheckoutState = {
  currentStep: 1,
  userInfo: {
    fullName: "",
    email: "",
    phone: "",
    company: "",
    sector: "",
  },
  serviceSelection: {
    serviceType: null,
    planName: "",
  },
  serviceConfig: {
    name: "",
    address: "",
    city: "",
    geoJsonArea: null,
    coordinates: null,
  },
};
