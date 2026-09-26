export type ZoneId = 
  | 'central-pavilion'
  | 'ocean-villas'
  | 'infinity-pool'
  | 'culinary-pavilion'
  | 'wellness-spa'
  | 'arrival-pier';

export interface ResortZone {
  id: ZoneId;
  name: string;
  category: string;
  position: [number, number, number];
  description: string;
  operationalStatus: 'Optimal' | 'Active' | 'Attention';
  occupancy: string;
  currentActivity: string;
}

export type OperationalAreaId = 
  | 'reservations'
  | 'rooms'
  | 'guests'
  | 'housekeeping'
  | 'maintenance'
  | 'restaurant'
  | 'inventory'
  | 'staff'
  | 'payments'
  | 'feedback'
  | 'analytics'
  | 'audit';

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'GENERAL_MANAGER'
  | 'FRONT_DESK'
  | 'HOUSEKEEPING'
  | 'MAINTENANCE'
  | 'RESTAURANT_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'STAFF'
  | 'CUSTOMER';

export interface RoleConfig {
  role: UserRole;
  label: string;
  badge: string;
  description: string;
  allowedModules: OperationalAreaId[];
  isCustomer?: boolean;
}

export interface OperationalArea {
  id: OperationalAreaId;
  index: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  liveMetric: string;
  metricLabel: string;
  targetZone: ZoneId;
  keyWorkflows: string[];
  authorizedRoles: UserRole[];
}

export type LightingMode = 'twilight' | 'midnight' | 'dawn';

// 01 Reservations Types
export interface Reservation {
  id: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';
  bookingSource: 'Direct VIP' | 'Amex Centurion' | 'Virtuoso' | 'Direct Web' | 'Private Jet Consortia';
  paymentStatus: 'Paid' | 'Authorized' | 'Pending Deposit';
  totalAmount: number;
  adults: number;
  specialRequests?: string;
  overbookingWarning?: boolean;
}

// 02 Rooms Types
export type RoomStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Maintenance' | 'Out of Service';

export interface Room {
  id: string;
  number: string;
  name: string;
  type: 'Overwater Villa' | 'Ocean Villa' | 'Horizon Suite' | 'Cliffside Residence' | 'Royal Pavilion';
  status: RoomStatus;
  ratePerNight: number;
  currentGuest?: string;
  inspectionStatus: 'Inspected & Certified' | 'Pending Inspection' | 'Touch-up Required';
  zoneId: ZoneId;
  floor: string;
  climateTemp: number;
  amenities: string[];
  lastCleaned: string;
}

// 03 Guests Types
export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vipTier: 'Tier 1 Titanium' | 'Tier 2 Diamond' | 'Regular VIP';
  currentRoom: string;
  stayCount: number;
  lifetimeSpend: number;
  preferences: {
    dietary: string;
    pillow: string;
    temperature: number;
    wine: string;
    privacyWindow: string;
  };
  activeRequests: Array<{
    id: string;
    service: string;
    time: string;
    status: 'Pending' | 'In Progress' | 'Fulfilled';
  }>;
}

// 04 Housekeeping Types
export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  taskType: 'Full Turnaround' | 'Stayover Refresh' | 'Evening Turndown' | 'VIP Deep Sanitization';
  priority: 'Urgent VIP' | 'High' | 'Normal';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Inspected';
  assignedStaff: string;
  estMinutes: number;
  notes: string;
  linenStatus: 'Fresh Linens Stocked' | 'Linen Bag Collected' | 'Awaiting Laundry';
}

export interface LostAndFoundItem {
  id: string;
  item: string;
  location: string;
  foundBy: string;
  date: string;
  status: 'Stored in Vault' | 'Claimed & Dispatched';
}

// 05 Maintenance Types
export interface MaintenanceIssue {
  id: string;
  ticketId: string;
  title: string;
  roomOrFacility: string;
  zoneId: ZoneId;
  equipment: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  severity: 'Operational Impact' | 'Precautionary' | 'Cosmetic';
  assignedTechnician: string;
  status: 'Open' | 'Dispatched' | 'Parts Sourced' | 'Resolved';
  estDowntime: string;
  isPreventive: boolean;
  loggedAt: string;
}

// 06 Restaurant Types
export interface RestaurantTable {
  id: string;
  tableNumber: string;
  section: 'Panoramic Terrace' | 'Obsidian Cellar' | 'Chef Bar';
  capacity: number;
  status: 'Available' | 'Reserved' | 'Occupied';
  currentReservation?: {
    guestName: string;
    time: string;
    covers: number;
    notes?: string;
  };
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableOrRoom: string;
  type: 'Dine-In' | 'In-Villa Dining';
  items: Array<{ name: string; quantity: number; notes?: string }>;
  status: 'Received' | 'Preparing' | 'Plated' | 'Delivered';
  total: number;
  time: string;
}

// 07 Inventory Types
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Fine Wines & Spirits' | 'Luxury Linens' | 'Organic Toiletries' | 'Gourmet Ingredients' | 'Spa Aromatics';
  currentStock: number;
  minThreshold: number;
  unit: string;
  supplier: string;
  status: 'Optimal' | 'Low Stock' | 'Critical Alert';
  reorderQuantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  category: string;
  itemsCount: number;
  totalCost: number;
  orderDate: string;
  status: 'Draft' | 'Sent to Supplier' | 'Delivered & Received';
}

// 08 Staff Types
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: 'Front Office' | 'Housekeeping' | 'Engineering' | 'Food & Beverage' | 'Spa & Wellness' | 'Executive';
  shift: 'Morning 06:00-14:30' | 'Mid 14:00-22:30' | 'Night 22:00-06:30';
  attendance: 'On Duty' | 'Scheduled' | 'On Break' | 'Off Duty';
  activeTasks: number;
  performanceRating: number;
  contact: string;
}

// 09 Payments & Billing Types
export interface GuestBill {
  id: string;
  folioNumber: string;
  guestName: string;
  roomNumber: string;
  charges: Array<{
    id: string;
    description: string;
    category: 'Room Rate' | 'Restaurant' | 'Spa' | 'Yacht Charter' | 'Private Bar';
    amount: number;
    date: string;
  }>;
  totalAmount: number;
  paymentsReceived: number;
  outstandingBalance: number;
  paymentMethod: string;
  status: 'Settled' | 'Open' | 'Pending Review';
}

// 10 Feedback & Experience Types
export interface FeedbackItem {
  id: string;
  guestName: string;
  roomNumber: string;
  rating: number; // 1-5
  category: 'Overall Stay' | 'Gastronomy' | 'Villa Comfort' | 'Housekeeping' | 'Concierge';
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Critical';
  serviceRecoveryStatus: 'Resolved' | 'Action Pending' | 'Escalated to GM';
  date: string;
}

// 11 Analytics Types
export interface ResortAnalytics {
  occupancyRate: number;
  adr: number;
  revPar: number;
  dailyRevenue: number;
  monthRevenue: number;
  guestSatisfaction: number;
  revParChange: string;
  occupancyChange: string;
}

// 12 Audit & Security Types
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  actionType: 'AUTH_LOGIN' | 'RESERVATION_CREATED' | 'ROOM_STATUS_CHANGE' | 'PAYMENT_CAPTURE' | 'MAINTENANCE_DISPATCH' | 'ROLE_PERMISSION_CHANGE' | 'SECURITY_ENCLAVE_ACCESS';
  targetResource: string;
  details: string;
  ipAddress: string;
}
