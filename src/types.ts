export interface BTUOption {
  btu: number;
  label: string;
  watts: number;
  multiplier: number;
  description: string;
}

export interface Appliance {
  id: 'gaming_pc' | 'cooking_pot' | 'hair_dryer' | 'iron';
  name: string;
  emoji: string;
  watts: number;
  defaultDurationMinutes: number; // minutes per day
  durationLabel: string;
  desc: string;
}

export interface CustomAppliance {
  id: string;
  name: string;
  emoji: string;
  watts: number;
  durationMinutes: number; // minutes per day
  daysPerMonth?: number; // 1 - 30 days active in month (default 30)
  enabled: boolean;
}

export interface Roommate {
  id: string;
  name: string;
  colorName: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  ringClass: string;
  hours: number; // 0 - 24
  temperature: number; // 18 - 28
  acDays?: number; // 0 - 30 days of AC usage in month (default: stayDays or 30)
  stayDays?: number; // 1 - 30 days active in dorm this month (default 30)
  stayDates?: number[]; // list of active day numbers (1..30)
  appliances: {
    gaming_pc: boolean;
    cooking_pot: boolean;
    hair_dryer: boolean;
    iron: boolean;
  };
  applianceDurations: {
    gaming_pc: number; // minutes per day
    cooking_pot: number;
    hair_dryer: number;
    iron: number;
  };
  applianceDays?: {
    gaming_pc?: number; // 1 - 30 days
    cooking_pot?: number;
    hair_dryer?: number;
    iron?: number;
  };
  applianceWatts?: {
    gaming_pc?: number;
    cooking_pot?: number;
    hair_dryer?: number;
    iron?: number;
  };
  customAppliances: CustomAppliance[];
}

export interface ActiveApplianceDetail {
  id: string;
  name: string;
  emoji: string;
  watts: number;
  durationMinutes: number;
  daysPerMonth: number;
  dailyKWh: number;
  monthlyKWh: number;
  isCustom?: boolean;
}

export interface RoommateShareResult {
  id: string;
  name: string;
  colorName: string;
  hex: string;
  hours: number;
  temperature: number;
  tempMultiplier: number;
  acDays: number;
  stayDays: number;
  stayDates?: number[];
  tempStatus: {
    label: string;
    isHotLoad: boolean;
    isEco: boolean;
  };
  activeAppliances: ActiveApplianceDetail[];
  totalDailyKWh: number;
  acDailyKWh: number;
  acMonthlyKWh: number;
  appliancesDailyKWh: number;
  appliancesMonthlyKWh: number;
  monthlyKWh: number;
  estimatedUnits: number;
  baseShare: number;
  variableShare: number;
  totalShare: number;
  percentage: number;
  diffFromEqual: number; // difference from totalBill / N
}

export interface CalculationResult {
  totalBill: number;
  unitRate: number; // dorm electricity rate in Baht/kWh (e.g. 5, 7, 8, 10, default 8)
  totalUnits: number; // total kWh units used for the room
  baseCommonFee: number; // 25% of total
  variableCost: number; // 75% of total
  roommates: RoommateShareResult[];
  equalSharePerPerson: number;
  selectedBTU: BTUOption;
  totalDailyKWh: number;
  totalMonthlyKWh: number;
}
