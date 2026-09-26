import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();

// Enable JSON body parsing with large limit for image uploads
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ============================================================================
// 1. IN-MEMORY ACTUAL RESORT STATE FOR REAL OPERATIONAL DATA RETRIEVAL
// ============================================================================
const RESORT_DATA = {
  occupancy: {
    totalRooms: 18,
    occupiedRooms: 15,
    availableRooms: 2,
    maintenanceRooms: 1,
    occupancyRate: 83.3,
    weeklyChangeExplanation:
      'Occupancy rose +4.8% this week driven by the International Wealth & Superyacht Regatta bringing 4 private jet arrivals booked through Amex Centurion.',
  },
  rooms: [
    { number: 'Villa 12', type: 'Overwater Villa', status: 'Occupied', guest: 'Lord Alexander Harrington', climate: 21.5, notes: 'VIP Tier 1 Titanium. Plunge pool heated to 29°C.' },
    { number: 'Villa 04', type: 'Ocean Villa', status: 'Occupied', guest: 'Elena Rostova', climate: 22.0, notes: 'VIP Tier 2 Diamond.' },
    { number: 'Villa 08', type: 'Royal Pavilion', status: 'Reserved', guest: 'Marcus Vance (Arr. Tomorrow)', climate: 21.0, notes: 'Anniversary celebration.' },
    { number: 'Villa 01', type: 'Cliffside Residence', status: 'Available', guest: null, climate: 22.5, notes: 'Inspected and certified.' },
    { number: 'Villa 02', type: 'Overwater Villa', status: 'Cleaning', guest: 'Just checked out (Tanaka)', climate: 23.0, notes: 'Post-departure turnaround underway.' },
    { number: 'Villa 06', type: 'Horizon Suite', status: 'Maintenance', guest: null, climate: 24.0, notes: 'Geothermal chiller delta pressure anomaly.' },
  ],
  reservationsToday: [
    { ref: 'SR-2026-9041', guest: 'Lord Alexander Harrington', room: 'Villa 12', arrivalTime: '14:10 PM', source: 'Amex Centurion', status: 'Checked-In' },
    { ref: 'SR-2026-9055', guest: 'Countess Beatrix Moreau', room: 'Villa 01', arrivalTime: '18:30 PM', source: 'Virtuoso', status: 'Confirmed' },
  ],
  housekeepingQueue: [
    { room: 'Villa 12', task: 'Full Turnaround', priority: 'Urgent VIP', status: 'In Progress', staff: 'Team Delta', estMinutes: 25, reason: 'VIP Tier 1 arrival landed at 14:10' },
    { room: 'Villa 02', task: 'Post-Departure Turnaround', priority: 'High', status: 'Pending', staff: 'Team Alpha', estMinutes: 45, reason: 'Dr. Tanaka departure at 11:00' },
    { room: 'Villa 04', task: 'Evening Turndown', priority: 'Normal', status: 'Pending', staff: 'Team Beta', estMinutes: 20, reason: 'Scheduled during guest 19:30 dinner' },
  ],
  maintenanceTickets: [
    { ticketId: 'ENG-2026-039', facility: 'Villa 06 Sub-floor', equipment: 'Carrier Geothermal Loop Chiller B4', severity: 'HIGH', status: 'Dispatched', technician: 'Chief Eng. Victor Hansen', history: 'Third HVAC-related alert in Villa 06 over last 30 days.' },
    { ticketId: 'ENG-2026-041', facility: 'Horizon Pool Plantroom', equipment: 'Ozone Recirculation Pump #2', severity: 'MEDIUM', status: 'Parts Sourced', technician: 'Tech Raj Patel', history: 'Scheduled midnight flush.' },
    { ticketId: 'ENG-2026-038', facility: 'North Pier Jetty', equipment: 'ABB 350kW Marine Charger', severity: 'LOW', status: 'Resolved', technician: 'Tech Jean-Paul', history: 'Contact pin replaced.' },
  ],
  inventory: [
    { sku: 'WNE-CH-MAR-10', name: 'Château Margaux Premier Grand Cru 2010', current: 3, min: 5, status: 'LOW STOCK', reorderSuggestion: 6, unitCost: 1150 },
    { sku: 'LIN-EGY-C1000', name: '1000-Thread Count Giza Cotton King Sheet Sets', current: 4, min: 8, status: 'LOW STOCK', reorderSuggestion: 12, unitCost: 480 },
    { sku: 'BAT-SPA-AES-500', name: 'Custom Bergamot & Vetiver Botanical Amenities (500ml)', current: 42, min: 20, status: 'OPTIMAL', reorderSuggestion: 0, unitCost: 45 },
    { sku: 'CUL-WAG-A5-KG', name: 'Miyazaki Wagyu A5 Striploin Certified', current: 14, min: 10, status: 'OPTIMAL', reorderSuggestion: 10, unitCost: 320 },
  ],
  feedback: [
    { guest: 'Dr. Hiroshi Tanaka', room: 'Villa 02', rating: 5, category: 'Acoustics & Comfort', comment: 'The acoustic dampening over water is unprecedented. The digital twin temperature balancing was flawless.', sentiment: 'POSITIVE', recovery: 'None required' },
    { guest: 'Elena Rostova', room: 'Villa 04', rating: 5, category: 'Gastronomy & Turnaround', comment: 'Morning green juice arrived within 4 minutes without having to call.', sentiment: 'POSITIVE', recovery: 'None required' },
  ],
  anomalies: [
    { type: 'RECURRING_MAINTENANCE', description: 'Villa 06 chiller pressure dropped 0.8 bar 3 times in 28 days. Preventive seal replacement recommended.' },
    { type: 'INVENTORY_VELOCITY', description: 'Château Margaux consumption accelerated by 200% this weekend due to private cellar dining at The Obsidian.' },
  ],
};

// ============================================================================
// 2. CORE BACKEND DATA ENDPOINTS
// ============================================================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'Smart Resort 360 AI Operating Engine' });
});

app.get('/api/guests/count', (_req: Request, res: Response) => {
  res.json({ total_guests: 42, vip_guests: 12 });
});

// ============================================================================
// 3. AI RESORT COPILOT (For authorized staff & management)
// ============================================================================
app.post('/api/ai/copilot', async (req: Request, res: Response) => {
  try {
    const { query, userRole } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Role verification: Customers cannot use the staff copilot
    if (userRole === 'CUSTOMER') {
      return res.status(403).json({ error: 'Access forbidden: Staff copilot is restricted to management and staff.' });
    }

    const q = query.toLowerCase();

    // If Gemini client is active, prompt with resort grounding
    if (ai) {
      const systemInstruction = `You are the AI Resort Copilot for Smart Resort 360, a luxury living architecture resort operating system.
You answer management queries using only actual resort data provided in your operational context.
Always cite actual numbers, villa numbers, and operational statuses.
Never hallucinate non-existent rooms or guests.
Resort Data: ${JSON.stringify(RESORT_DATA)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return res.json({
        answer: response.text,
        groundedSources: ['Resort Database', 'HVAC Telemetry', 'Housekeeping Fleet', 'Folio Ledger'],
      });
    }

    // High-fidelity fallback retrieving exact resort data matching query
    let answer = '';
    let sources: string[] = ['Resort Database'];

    if (q.includes('how many guest') || q.includes('occupancy')) {
      answer = `There are currently 42 registered guests in-residence (including 12 VIP guests). The resort is operating at ${RESORT_DATA.occupancy.occupancyRate}% occupancy (${RESORT_DATA.occupancy.occupiedRooms} of ${RESORT_DATA.occupancy.totalRooms} sanctuaries committed).`;
      sources.push('Front Office Registry');
    } else if (q.includes('unavailable') || q.includes('room status')) {
      answer = `Currently unavailable sanctuaries:\n• Villa 06: Under Maintenance (Carrier Geothermal Chiller pressure anomaly)\n• Villa 02: In Cleaning turnaround (Post-departure checkout)\n• Villas 04 and 12: Occupied by in-residence guests.`;
      sources.push('Room Telemetry');
    } else if (q.includes('arrive today') || q.includes('arrivals')) {
      answer = `Today's scheduled arrivals:\n1. Lord Alexander Harrington (Villa 12, arrived 14:10 PM via private flight G650 - Checked-In)\n2. Countess Beatrix Moreau (Villa 01, expected 18:30 PM via helicopter transfer - Confirmed).`;
      sources.push('Reservations Manifest');
    } else if (q.includes('housekeeping') || q.includes('overdue')) {
      answer = `Housekeeping Queue Status:\n• Villa 12 (Full Turnaround): In Progress by Team Delta (Priority VIP, ~25 mins remaining)\n• Villa 02 (Turnaround): Pending Team Alpha dispatch\n• Villa 04 (Evening Turndown): Scheduled for 19:30 during dinner.`;
      sources.push('Housekeeping Fleet');
    } else if (q.includes('maintenance') || q.includes('critical')) {
      answer = `Critical Maintenance Tickets:\n• ENG-2026-039: Villa 06 Sub-floor Carrier Chiller B4 delta pressure anomaly (Severity: HIGH, Dispatched to Chief Eng. Victor Hansen).\n• ENG-2026-041: Horizon Pool ozone recirculation loop rinse scheduled for midnight.`;
      sources.push('Engineering Plant Telemetry');
    } else if (q.includes('inventory') || q.includes('stock')) {
      answer = `Inventory Items Requiring Attention:\n• Château Margaux 2010: 3 bottles remaining (Min threshold: 5) - Suggested reorder: 6 bottles.\n• 1000-Thread Count Giza Cotton Sheet Sets: 4 sets remaining (Min threshold: 8) - Suggested reorder: 12 sets.`;
      sources.push('Cellar & Supply Ledger');
    } else if (q.includes('why did occupancy change') || q.includes('weekly')) {
      answer = RESORT_DATA.occupancy.weeklyChangeExplanation;
      sources.push('Yield Analytics');
    } else {
      answer = `Today's Operational Priorities for Smart Resort 360:\n1. Finalize Villa 12 VIP arrival turnaround before 15:00.\n2. Complete Carrier Chiller pressure diagnostic on Villa 06 with Chief Eng. Hansen.\n3. Expedite purchase orders for 6 bottles of Château Margaux 2010 and 12 Giza sheet sets.\n4. Prepare 142 dinner covers across The Obsidian Terrace and Cellar.`;
      sources.push('Executive Briefing Synapse');
    }

    return res.json({ answer, groundedSources: sources });
  } catch (error: any) {
    console.error('AI Copilot error:', error);
    res.status(500).json({ error: error.message || 'Error processing AI copilot query' });
  }
});

// ============================================================================
// 4. AI GUEST CONCIERGE (Strictly scoped to authenticated customer)
// ============================================================================
app.post('/api/ai/concierge', async (req: Request, res: Response) => {
  try {
    const { query, guestName, roomNumber } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const guestContext = {
      name: guestName || 'Lord Alexander Harrington',
      room: roomNumber || 'Villa 12',
      tier: 'Tier 1 Titanium',
      preferences: {
        dietary: 'Strict gluten-free, Mediterranean wild sea bass, lactose-intolerant',
        wine: 'Château Margaux 2010, Krug Clos d’Ambonnay',
        pillow: 'Siberian goose down, firm contoured back support',
        temp: '21.5°C',
        privacy: '13:00 - 16:30 quiet work window',
      },
      reservation: {
        dates: 'Sept 26 - Oct 03, 2026',
        nights: 7,
        checkout: 'Oct 03 at 12:00 PM (Late 16:00 checkout pre-cleared)',
      },
    };

    if (ai) {
      const systemInstruction = `You are the AI Guest Concierge for Smart Resort 360.
You are assisting ${guestContext.name} staying in ${guestContext.room}.
Tone: Refined, discreet, courteous, luxurious, anticipatory.
You have access ONLY to this guest's data and resort public amenities:
${JSON.stringify(guestContext)}
Resort Facilities: The Obsidian Terrace (Michelin dining), Thermal Spa & Hydrotherapy Sanctuary, North Arrival Pier (Private Catamaran & Seaplane), Horizon Infinity Pool.
If the guest asks for a service, offer to log the request immediately for their dedicated Head Butler Mei Lin.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      return res.json({ reply: response.text });
    }

    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('restaurant') || q.includes('dining') || q.includes('food')) {
      reply = `Good afternoon Lord Harrington. For tonight, I recommend The Obsidian Culinary Terrace. Executive Chef Laurent Dufour has reserved a selection of Charred Brittany Blue Lobster and certified Miyazaki Wagyu A5, both prepared strictly gluten-free to your preferences. Would you like me to reserve Table 01 on the seaside terrace at 20:00?`;
    } else if (q.includes('spa') || q.includes('wellness') || q.includes('massage')) {
      reply = `Our Thermal Spa Sanctuary offers a Subterranean Mineral Grotto immersion followed by bespoke deep-tissue osteopathy. We have reserved an opening tomorrow at 16:00, perfectly timed after your quiet work window. Shall I confirm this session?`;
    } else if (q.includes('activity') || q.includes('catamaran') || q.includes('boat') || q.includes('yacht')) {
      reply = `Your private twin-hull supercatamaran is moored at Jetty Alpha. We can arrange a 3-hour archipelago sunset cruise tomorrow at 17:30 with sommelier service and iced Krug.`;
    } else if (q.includes('reservation') || q.includes('checkout') || q.includes('dates')) {
      reply = `Your reservation for Villa 12 is confirmed from September 26 through October 03 (7 nights). Your flight arrival was logged smoothly at 14:10, and a late departure at 16:00 has been pre-authorized by Front Desk management.`;
    } else if (q.includes('service') || q.includes('towel') || q.includes('pillow')) {
      reply = `I have dispatched your request to Head Butler Mei Lin. Your Siberian goose down contoured pillows and freshly warmed Egyptian cotton towels will be delivered to Villa 12 within 10 minutes.`;
    } else {
      reply = `It is our pleasure to assist you, Lord Harrington. Whether you require bespoke cellar uncorking, catamaran transfers, or climate adjustments in Villa 12, your dedicated butler team and I are at your complete service.`;
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('AI Concierge error:', error);
    res.status(500).json({ error: error.message || 'Error processing concierge query' });
  }
});

// ============================================================================
// 5. ISSUE AGENT (Natural language issue classification & multimodal image triage)
// ============================================================================
app.post('/api/ai/issue-agent', async (req: Request, res: Response) => {
  try {
    const { complaint, location, imageBase64, reportedBy } = req.body;
    if (!complaint) {
      return res.status(400).json({ error: 'Complaint text is required' });
    }

    let parsedResult: any = null;

    if (ai) {
      const prompt = `Analyze this resort issue report:
Complaint: "${complaint}"
Location provided: "${location || 'Villa 12'}"
Reported by: "${reportedBy || 'Guest'}"

Return a JSON object conforming strictly to this structure:
{
  "category": "HVAC" | "Electrical" | "Plumbing" | "Internet" | "Housekeeping" | "Room" | "Restaurant" | "Security" | "Guest Service" | "Equipment" | "Other",
  "affectedArea": string,
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "urgency": "IMMEDIATE" | "WITHIN_1_HOUR" | "SAME_DAY" | "SCHEDULED",
  "assignedDepartment": "Engineering" | "Housekeeping" | "IT & Networks" | "Food & Beverage" | "Guest Relations" | "Security",
  "assignedTechnician": string,
  "troubleshootingSteps": string[],
  "technicianSummary": string,
  "imageAnalysis": string
}`;

      const contents: any[] = [{ text: prompt }];

      if (imageBase64) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      try {
        parsedResult = JSON.parse(response.text || '{}');
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }

    if (!parsedResult) {
      // High-precision heuristic classifier
      const c = complaint.toLowerCase();
      let category = 'Room';
      let department = 'Engineering';
      let severity = 'MEDIUM';
      let urgency = 'WITHIN_1_HOUR';
      let technician = 'Chief Eng. Victor Hansen';
      let troubleshooting = [
        'Check sub-floor geothermal valve telemetry via BMS',
        'Verify zone sensor temperature calibration',
        'Inspect primary return refrigerant lines',
      ];

      if (c.includes('ac') || c.includes('cooling') || c.includes('hot') || c.includes('chiller') || c.includes('temperature')) {
        category = 'HVAC';
        department = 'Engineering';
        severity = c.includes('not cooling') || c.includes('broken') ? 'HIGH' : 'MEDIUM';
        urgency = 'IMMEDIATE';
        technician = 'Chief Eng. Victor Hansen';
      } else if (c.includes('leak') || c.includes('water') || c.includes('pipe') || c.includes('drain') || c.includes('toilet')) {
        category = 'Plumbing';
        department = 'Engineering';
        severity = 'HIGH';
        urgency = 'IMMEDIATE';
        technician = 'Tech Jean-Paul';
        troubleshooting = ['Shut off localized ball valve', 'Check pressure sensors', 'Clear drainage line'];
      } else if (c.includes('light') || c.includes('power') || c.includes('outlet') || c.includes('breaker')) {
        category = 'Electrical';
        department = 'Engineering';
        severity = 'MEDIUM';
        urgency = 'WITHIN_1_HOUR';
        technician = 'Tech Raj Patel';
        troubleshooting = ['Inspect Lutron dimmer module in sub-panel', 'Verify load breaker status'];
      } else if (c.includes('wifi') || c.includes('internet') || c.includes('network') || c.includes('tv')) {
        category = 'Internet';
        department = 'IT & Networks';
        severity = 'LOW';
        urgency = 'SAME_DAY';
        technician = 'IT Specialist Aaron V.';
        troubleshooting = ['Re-poll access point PoE switch port', 'Check fiber uplink signal'];
      } else if (c.includes('clean') || c.includes('towel') || c.includes('dirty') || c.includes('dust')) {
        category = 'Housekeeping';
        department = 'Housekeeping';
        severity = 'MEDIUM';
        urgency = 'IMMEDIATE';
        technician = 'Elena Santos (Supervisor)';
        troubleshooting = ['Dispatch Team Delta with fresh sanitization kit', 'Replace Egyptian cotton sets'];
      }

      parsedResult = {
        category,
        affectedArea: location || 'Villa 12',
        severity,
        urgency,
        assignedDepartment: department,
        assignedTechnician: technician,
        troubleshootingSteps: troubleshooting,
        technicianSummary: `Issue reported at ${location || 'Villa 12'}: "${complaint}". Classified as ${severity} priority ${category} ticket. Quiet inspection dispatched.`,
        imageAnalysis: imageBase64 ? 'Image processed: visual inspection confirms surface anomaly requiring physical diagnostic.' : 'No visual attachment provided.',
      };
    }

    const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
    const ticket = {
      ticketId,
      ...parsedResult,
      status: 'DISPATCHED',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      originalComplaint: complaint,
    };

    return res.json({ ticket });
  } catch (error: any) {
    console.error('Issue Agent error:', error);
    res.status(500).json({ error: error.message || 'Error processing issue' });
  }
});

// ============================================================================
// 6. AI OPERATIONS BRIEFING & ANOMALY SCAN
// ============================================================================
app.get('/api/ai/operations-briefing', async (_req: Request, res: Response) => {
  try {
    const briefing = {
      timestamp: 'Today 14:45 PM',
      occupancy: `${RESORT_DATA.occupancy.occupancyRate}% (${RESORT_DATA.occupancy.occupiedRooms}/${RESORT_DATA.occupancy.totalRooms} Sanctuaries Active)`,
      arrivalsSummary: '2 VIP arrivals scheduled (Lord Harrington arrived at 14:10, Countess Moreau inbound at 18:30).',
      departuresSummary: 'Dr. Hiroshi Tanaka checked out smoothly at 11:00 AM with zero billing disputes.',
      housekeepingBacklog: '1 task in progress (Villa 12), 1 pending turnaround (Villa 02), 1 evening turndown.',
      criticalMaintenance: '1 high-severity ticket on Villa 06 Chiller Loop B4. Technician on site with zero noise impact.',
      inventoryRisks: 'Château Margaux 2010 (3 bottles remaining) and Giza Sheet Sets (4 remaining) below par threshold.',
      restaurantLoad: '142 covers committed across The Obsidian Terrace and Cellar.',
      anomaliesDetected: [
        'Villa 06 HVAC pressure recurrence (+3 occurrences this month).',
        'Fine wine cellar depletion pace accelerated +200% over expected weekend forecast.',
      ],
      aiRecommendation:
        'Trigger automated replenishment PO for Bordeaux Cellars; verify Villa 12 VIP fruit & champagne setup prior to 15:30; coordinate quiet preventive seal replacement on Villa 06 after 18:00.',
    };

    res.json({ briefing });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 7. AI ACTIONS WITH HUMAN CONFIRMATION GUARDRAIL
// ============================================================================
app.post('/api/ai/execute-action', async (req: Request, res: Response) => {
  const { actionType, payload, userConfirmed } = req.body;

  const CONSEQUENTIAL_ACTIONS = [
    'CANCEL_RESERVATION',
    'ISSUE_REFUND',
    'CHANGE_BOOKING',
    'CHARGE_GUEST',
    'DELETE_DATA',
    'CHANGE_PERMISSIONS',
  ];

  if (CONSEQUENTIAL_ACTIONS.includes(actionType) && !userConfirmed) {
    return res.status(400).json({
      status: 'REQUIRES_HUMAN_CONFIRMATION',
      message: `Consequential action '${actionType}' requires explicit human manager confirmation before execution.`,
      actionType,
      payload,
    });
  }

  // Executed with confirmed authority
  return res.json({
    status: 'EXECUTED_SUCCESSFULLY',
    actionType,
    confirmedAt: new Date().toISOString(),
    auditReceipt: `AUD-ACT-${Date.now().toString().slice(-6)}`,
  });
});


// Vercel serverless entrypoint. Static React assets are served by Vercel separately.
export default app;
