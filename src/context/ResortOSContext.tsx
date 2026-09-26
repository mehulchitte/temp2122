import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  OperationalAreaId,
  ZoneId,
  Reservation,
  Room,
  RoomStatus,
  GuestProfile,
  HousekeepingTask,
  LostAndFoundItem,
  MaintenanceIssue,
  RestaurantTable,
  KitchenOrder,
  InventoryItem,
  StaffMember,
  GuestBill,
  FeedbackItem,
  ResortAnalytics,
  AuditLogEntry,
} from '../types';
import {
  ROLE_CONFIGS,
  INITIAL_RESERVATIONS,
  INITIAL_ROOMS,
  INITIAL_GUESTS,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_LOST_FOUND,
  INITIAL_MAINTENANCE_ISSUES,
  INITIAL_RESTAURANT_TABLES,
  INITIAL_KITCHEN_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_STAFF,
  INITIAL_BILLS,
  INITIAL_FEEDBACK,
  INITIAL_ANALYTICS,
  INITIAL_AUDIT_LOGS,
} from '../data/resortData';

interface ResortOSContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeModule: OperationalAreaId;
  setActiveModule: (mod: OperationalAreaId) => void;
  isOSOpen: boolean;
  openOS: (initialModule?: OperationalAreaId) => void;
  closeOS: () => void;
  allowedModules: OperationalAreaId[];
  isCustomer: boolean;
  
  // 01 Reservations
  reservations: Reservation[];
  createReservation: (res: Omit<Reservation, 'id' | 'bookingRef'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  cancelReservation: (id: string) => void;

  // 02 Rooms
  rooms: Room[];
  updateRoomStatus: (id: string, status: RoomStatus) => void;
  updateRoomInspection: (id: string, inspection: Room['inspectionStatus']) => void;
  updateRoomClimate: (id: string, temp: number) => void;

  // 03 Guests
  guests: GuestProfile[];
  addGuestRequest: (guestId: string, serviceText: string) => void;

  // 04 Housekeeping
  housekeepingTasks: HousekeepingTask[];
  updateTaskStatus: (id: string, status: HousekeepingTask['status']) => void;
  lostAndFound: LostAndFoundItem[];

  // 05 Maintenance
  maintenanceIssues: MaintenanceIssue[];
  createWorkOrder: (issue: Omit<MaintenanceIssue, 'id' | 'ticketId' | 'loggedAt'>) => void;
  updateIssueStatus: (id: string, status: MaintenanceIssue['status']) => void;

  // 06 Restaurant
  restaurantTables: RestaurantTable[];
  kitchenOrders: KitchenOrder[];
  updateKitchenOrderStatus: (id: string, status: KitchenOrder['status']) => void;

  // 07 Inventory
  inventoryItems: InventoryItem[];
  reorderInventoryItem: (id: string) => void;

  // 08 Staff
  staffMembers: StaffMember[];
  updateStaffAttendance: (id: string, attendance: StaffMember['attendance']) => void;

  // 09 Payments
  guestBills: GuestBill[];
  settleFolio: (id: string) => void;

  // 10 Feedback
  feedbackItems: FeedbackItem[];
  resolveFeedback: (id: string) => void;
  addFeedback: (fb: Omit<FeedbackItem, 'id' | 'date' | 'serviceRecoveryStatus'>) => void;

  // 11 Analytics
  analytics: ResortAnalytics;

  // 12 Audit
  auditLogs: AuditLogEntry[];
  logAction: (actionType: AuditLogEntry['actionType'], targetResource: string, details: string) => void;

  // 3D Integration
  locateOn3DTwin: (zoneId: ZoneId) => void;
}

const ResortOSContext = createContext<ResortOSContextType | undefined>(undefined);

export const ResortOSProvider: React.FC<{
  children: React.ReactNode;
  onLocate3DZone?: (zoneId: ZoneId) => void;
}> = ({ children, onLocate3DZone }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [activeModule, setActiveModule] = useState<OperationalAreaId>('reservations');
  const [isOSOpen, setIsOSOpen] = useState(false);

  // Entities
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [guests, setGuests] = useState<GuestProfile[]>(INITIAL_GUESTS);
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(INITIAL_HOUSEKEEPING_TASKS);
  const [lostAndFound] = useState<LostAndFoundItem[]>(INITIAL_LOST_FOUND);
  const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>(INITIAL_MAINTENANCE_ISSUES);
  const [restaurantTables] = useState<RestaurantTable[]>(INITIAL_RESTAURANT_TABLES);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(INITIAL_KITCHEN_ORDERS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);
  const [guestBills, setGuestBills] = useState<GuestBill[]>(INITIAL_BILLS);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [analytics] = useState<ResortAnalytics>(INITIAL_ANALYTICS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const currentRoleConfig = ROLE_CONFIGS.find((r) => r.role === currentRole) || ROLE_CONFIGS[0];
  const allowedModules = currentRoleConfig.allowedModules;
  const isCustomer = currentRole === 'CUSTOMER';

  const logAction = (actionType: AuditLogEntry['actionType'], targetResource: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      actor: currentRoleConfig.label,
      role: currentRole,
      actionType,
      targetResource,
      details,
      ipAddress: '10.240.2.14',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const openOS = (initialModule?: OperationalAreaId) => {
    if (initialModule && allowedModules.includes(initialModule)) {
      setActiveModule(initialModule);
    } else if (allowedModules.length > 0 && !allowedModules.includes(activeModule)) {
      setActiveModule(allowedModules[0]);
    }
    setIsOSOpen(true);
    logAction('AUTH_LOGIN', 'Resort OS Workspace', `Session established under role: ${currentRole}`);
  };

  const closeOS = () => {
    setIsOSOpen(false);
  };

  const locateOn3DTwin = (zoneId: ZoneId) => {
    if (onLocate3DZone) {
      onLocate3DZone(zoneId);
    }
    setIsOSOpen(false);
  };

  // 01 Reservations Handlers
  const createReservation = (resData: Omit<Reservation, 'id' | 'bookingRef'>) => {
    const newId = `res-${Date.now()}`;
    const newRef = `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRes: Reservation = {
      ...resData,
      id: newId,
      bookingRef: newRef,
    };
    setReservations((prev) => [newRes, ...prev]);
    logAction('RESERVATION_CREATED', newRef, `New booking created for ${resData.guestName} (${resData.roomNumber})`);
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    const target = reservations.find((r) => r.id === id);
    if (target) {
      logAction('RESERVATION_CREATED', target.bookingRef, `Status changed to ${status}`);
    }
  };

  const cancelReservation = (id: string) => {
    updateReservationStatus(id, 'Cancelled');
  };

  // 02 Rooms Handlers
  const updateRoomStatus = (id: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    const target = rooms.find((r) => r.id === id);
    if (target) {
      logAction('ROOM_STATUS_CHANGE', target.number, `Room state changed to ${status}`);
    }
  };

  const updateRoomInspection = (id: string, inspectionStatus: Room['inspectionStatus']) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, inspectionStatus } : r))
    );
    const target = rooms.find((r) => r.id === id);
    if (target) {
      logAction('ROOM_STATUS_CHANGE', target.number, `Inspection updated: ${inspectionStatus}`);
    }
  };

  const updateRoomClimate = (id: string, climateTemp: number) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, climateTemp } : r))
    );
  };

  // 03 Guests Handlers
  const addGuestRequest = (guestId: string, serviceText: string) => {
    const newReq = {
      id: `req-${Date.now()}`,
      service: serviceText,
      time: 'Just now',
      status: 'Pending' as const,
    };
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? { ...g, activeRequests: [newReq, ...g.activeRequests] }
          : g
      )
    );
    logAction('RESERVATION_CREATED', guestId, `Service request logged: "${serviceText}"`);
  };

  // 04 Housekeeping Handlers
  const updateTaskStatus = (id: string, status: HousekeepingTask['status']) => {
    setHousekeepingTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    const target = housekeepingTasks.find((t) => t.id === id);
    if (target) {
      logAction('ROOM_STATUS_CHANGE', target.roomNumber, `Housekeeping task marked ${status}`);
    }
  };

  // 05 Maintenance Handlers
  const createWorkOrder = (issue: Omit<MaintenanceIssue, 'id' | 'ticketId' | 'loggedAt'>) => {
    const newIssue: MaintenanceIssue = {
      ...issue,
      id: `maint-${Date.now()}`,
      ticketId: `ENG-2026-0${Math.floor(50 + Math.random() * 40)}`,
      loggedAt: 'Just now',
    };
    setMaintenanceIssues((prev) => [newIssue, ...prev]);
    logAction('MAINTENANCE_DISPATCH', newIssue.ticketId, `Work order logged: ${issue.title}`);
  };

  const updateIssueStatus = (id: string, status: MaintenanceIssue['status']) => {
    setMaintenanceIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    const target = maintenanceIssues.find((i) => i.id === id);
    if (target) {
      logAction('MAINTENANCE_DISPATCH', target.ticketId, `Ticket updated to ${status}`);
    }
  };

  // 06 Restaurant Handlers
  const updateKitchenOrderStatus = (id: string, status: KitchenOrder['status']) => {
    setKitchenOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  // 07 Inventory Handlers
  const reorderInventoryItem = (id: string) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedStock = item.currentStock + item.reorderQuantity;
          return {
            ...item,
            currentStock: updatedStock,
            status: 'Optimal',
          };
        }
        return item;
      })
    );
    const target = inventoryItems.find((i) => i.id === id);
    if (target) {
      logAction('PAYMENT_CAPTURE', target.sku, `Automated PO generated for ${target.reorderQuantity} units of ${target.name}`);
    }
  };

  // 08 Staff Handlers
  const updateStaffAttendance = (id: string, attendance: StaffMember['attendance']) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attendance } : s))
    );
    const target = staffMembers.find((s) => s.id === id);
    if (target) {
      logAction('ROLE_PERMISSION_CHANGE', target.name, `Attendance shifted to ${attendance}`);
    }
  };

  // 09 Payments Handlers
  const settleFolio = (id: string) => {
    setGuestBills((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              paymentsReceived: b.totalAmount,
              outstandingBalance: 0,
              status: 'Settled',
            }
          : b
      )
    );
    const target = guestBills.find((b) => b.id === id);
    if (target) {
      logAction('PAYMENT_CAPTURE', target.folioNumber, `Folio fully captured and settled: $${target.totalAmount}`);
    }
  };

  // 10 Feedback Handlers
  const resolveFeedback = (id: string) => {
    setFeedbackItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, serviceRecoveryStatus: 'Resolved' } : f))
    );
  };

  const addFeedback = (fb: Omit<FeedbackItem, 'id' | 'date' | 'serviceRecoveryStatus'>) => {
    const newFb: FeedbackItem = {
      ...fb,
      id: `fb-${Date.now()}`,
      date: 'Just now',
      serviceRecoveryStatus: 'Action Pending',
    };
    setFeedbackItems((prev) => [newFb, ...prev]);
    logAction('RESERVATION_CREATED', fb.roomNumber, `Guest feedback submitted: rating ${fb.rating}/5`);
  };

  return (
    <ResortOSContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeModule,
        setActiveModule,
        isOSOpen,
        openOS,
        closeOS,
        allowedModules,
        isCustomer,

        reservations,
        createReservation,
        updateReservationStatus,
        cancelReservation,

        rooms,
        updateRoomStatus,
        updateRoomInspection,
        updateRoomClimate,

        guests,
        addGuestRequest,

        housekeepingTasks,
        updateTaskStatus,
        lostAndFound,

        maintenanceIssues,
        createWorkOrder,
        updateIssueStatus,

        restaurantTables,
        kitchenOrders,
        updateKitchenOrderStatus,

        inventoryItems,
        reorderInventoryItem,

        staffMembers,
        updateStaffAttendance,

        guestBills,
        settleFolio,

        feedbackItems,
        resolveFeedback,
        addFeedback,

        analytics,
        auditLogs,
        logAction,

        locateOn3DTwin,
      }}
    >
      {children}
    </ResortOSContext.Provider>
  );
};

export const useResortOS = () => {
  const context = useContext(ResortOSContext);
  if (!context) {
    throw new Error('useResortOS must be used within a ResortOSProvider');
  }
  return context;
};
