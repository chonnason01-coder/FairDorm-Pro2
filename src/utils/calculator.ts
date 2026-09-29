import {
  ActiveApplianceDetail,
  Appliance,
  BTUOption,
  CalculationResult,
  Roommate,
  RoommateShareResult,
} from '../types';

export const BTU_OPTIONS: BTUOption[] = [
  {
    btu: 9000,
    label: '9,000 BTU',
    watts: 850,
    multiplier: 0.85,
    description: 'ห้องเล็ก ~10-14 ตร.ม. (กินไฟ ~0.85 หน่วย/ชม.)',
  },
  {
    btu: 12000,
    label: '12,000 BTU',
    watts: 1100,
    multiplier: 1.0,
    description: 'ห้องมาตรฐาน ~15-20 ตร.ม. (กินไฟ ~1.1 หน่วย/ชม.)',
  },
  {
    btu: 18000,
    label: '18,000 BTU',
    watts: 1700,
    multiplier: 1.45,
    description: 'ห้องใหญ่ ~21-28 ตร.ม. (กินไฟ ~1.7 หน่วย/ชม.)',
  },
];

export const APPLIANCES: Appliance[] = [
  {
    id: 'gaming_pc',
    name: 'คอมเกมมิ่ง PC',
    emoji: '🖥️',
    watts: 250,
    defaultDurationMinutes: 360, // 6 ชม./วัน
    durationLabel: '6 ชม./วัน',
    desc: 'เปิดสตรีม/เล่นเกมต่อเนื่อง (250W)',
  },
  {
    id: 'cooking_pot',
    name: 'กระทะไฟฟ้า/ชาบู',
    emoji: '🍳',
    watts: 1200,
    defaultDurationMinutes: 30, // 30 นาที/วัน
    durationLabel: '30 นาที/วัน',
    desc: 'ต้มชาบู/ทอดอาหาร (1,200W)',
  },
  {
    id: 'hair_dryer',
    name: 'ไดร์เป่าผม',
    emoji: '💨',
    watts: 1800,
    defaultDurationMinutes: 15, // 15 นาที/วัน
    durationLabel: '15 นาที/วัน',
    desc: 'ไดร์ลมร้อนเป่าผม (1,800W)',
  },
  {
    id: 'iron',
    name: 'เตารีดผ้า',
    emoji: '👔',
    watts: 1000,
    defaultDurationMinutes: 15, // 15 นาที/วัน
    durationLabel: '15 นาที/วัน',
    desc: 'รีดชุดนักศึกษา/ทำงาน (1,000W)',
  },
];

export const ROOMMATE_COLOR_PALETTES = [
  {
    colorName: 'emerald',
    hex: '#10b981',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
    ringClass: 'ring-emerald-500',
  },
  {
    colorName: 'cyan',
    hex: '#06b6d4',
    bgClass: 'bg-cyan-500',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-400',
    ringClass: 'ring-cyan-500',
  },
  {
    colorName: 'violet',
    hex: '#8b5cf6',
    bgClass: 'bg-violet-500',
    borderClass: 'border-violet-500',
    textClass: 'text-violet-400',
    ringClass: 'ring-violet-500',
  },
  {
    colorName: 'amber',
    hex: '#f59e0b',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-400',
    ringClass: 'ring-amber-500',
  },
  {
    colorName: 'rose',
    hex: '#f43f5e',
    bgClass: 'bg-rose-500',
    borderClass: 'border-rose-500',
    textClass: 'text-rose-400',
    ringClass: 'ring-rose-500',
  },
  {
    colorName: 'blue',
    hex: '#3b82f6',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    ringClass: 'ring-blue-500',
  },
  {
    colorName: 'orange',
    hex: '#f97316',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-400',
    ringClass: 'ring-orange-500',
  },
  {
    colorName: 'lime',
    hex: '#84cc16',
    bgClass: 'bg-lime-500',
    borderClass: 'border-lime-500',
    textClass: 'text-lime-400',
    ringClass: 'ring-lime-500',
  },
  {
    colorName: 'fuchsia',
    hex: '#d946ef',
    bgClass: 'bg-fuchsia-500',
    borderClass: 'border-fuchsia-500',
    textClass: 'text-fuchsia-400',
    ringClass: 'ring-fuchsia-500',
  },
  {
    colorName: 'teal',
    hex: '#14b8a6',
    bgClass: 'bg-teal-500',
    borderClass: 'border-teal-500',
    textClass: 'text-teal-400',
    ringClass: 'ring-teal-500',
  },
  {
    colorName: 'indigo',
    hex: '#6366f1',
    bgClass: 'bg-indigo-500',
    borderClass: 'border-indigo-500',
    textClass: 'text-indigo-400',
    ringClass: 'ring-indigo-500',
  },
  {
    colorName: 'sky',
    hex: '#0284c7',
    bgClass: 'bg-sky-500',
    borderClass: 'border-sky-500',
    textClass: 'text-sky-400',
    ringClass: 'ring-sky-500',
  },
  {
    colorName: 'yellow',
    hex: '#eab308',
    bgClass: 'bg-yellow-500',
    borderClass: 'border-yellow-500',
    textClass: 'text-yellow-400',
    ringClass: 'ring-yellow-500',
  },
  {
    colorName: 'pink',
    hex: '#ec4899',
    bgClass: 'bg-pink-500',
    borderClass: 'border-pink-500',
    textClass: 'text-pink-400',
    ringClass: 'ring-pink-500',
  },
  {
    colorName: 'purple',
    hex: '#a855f7',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
    ringClass: 'ring-purple-500',
  },
  {
    colorName: 'red',
    hex: '#ef4444',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    ringClass: 'ring-red-500',
  },
];

export function getTempMultiplier(temp: number): {
  multiplier: number;
  label: string;
  isHotLoad: boolean;
  isEco: boolean;
} {
  if (temp <= 20) {
    return {
      multiplier: 1.25,
      label: 'กินไฟโหด +25%',
      isHotLoad: true,
      isEco: false,
    };
  }
  if (temp <= 22) {
    return {
      multiplier: 1.20,
      label: 'กินไฟโหด +20%',
      isHotLoad: true,
      isEco: false,
    };
  }
  if (temp <= 24) {
    return {
      multiplier: 1.08,
      label: 'เย็นฉ่ำ +8%',
      isHotLoad: false,
      isEco: false,
    };
  }
  if (temp <= 26) {
    return {
      multiplier: 1.0,
      label: 'Eco-Mode 0%',
      isHotLoad: false,
      isEco: true,
    };
  }
  return {
    multiplier: 0.90,
    label: 'ประหยัดไฟ -10%',
    isHotLoad: false,
    isEco: true,
  };
}

export function calculateFairDormBill(
  totalBill: number,
  roommates: Roommate[],
  selectedBTU: BTUOption,
  unitRate: number = 8
): CalculationResult {
  const safeTotal = Math.max(0, totalBill);
  const safeRate = Math.max(1, unitRate || 8);
  const n = roommates.length || 1;

  // 1. 25% Base Common Fee (Shared equally among all roommates)
  const baseCommonFee = Math.round(safeTotal * 0.25 * 100) / 100;
  const basePerPerson = baseCommonFee / n;

  // 2. 75% Variable Pool (Calculated by weighted electrical energy kWh scaled by days stayed)
  const variableCost = safeTotal - baseCommonFee;

  // AC rated kW (e.g. 1.1 kW for 12,000 BTU)
  const acKW = selectedBTU.watts / 1000;

  // Compute individual energy consumption in kWh/day and kWh/month (based on stayDays and appliance usage days)
  const individualWeights = roommates.map((m) => {
    const tempInfo = getTempMultiplier(m.temperature);
    const stayDays = Math.max(1, Math.min(30, m.stayDays ?? (m.stayDates ? m.stayDates.length : 30)));
    // AC usage frequency: days per month that the roommate uses the AC (0 - 30 days, default to stayDays)
    const acDays = Math.max(
      0,
      Math.min(
        stayDays,
        m.acDays !== undefined ? m.acDays : stayDays
      )
    );

    // AC daily energy (kWh/day) = AC kW * hours * tempMultiplier
    const acDailyKWh = m.hours * acKW * tempInfo.multiplier;
    // Monthly AC energy (kWh/month) = AC kW * hours/day * acDays/month * tempMultiplier
    const acMonthlyKWh = acDailyKWh * acDays;

    // Active appliances calculation (kWh = watts * (durationMinutes / 60) / 1000 * daysPerMonth)
    const activeAppliances: ActiveApplianceDetail[] = [];

    // 1. Presets
    APPLIANCES.forEach((app) => {
      if (m.appliances && m.appliances[app.id]) {
        const effectiveWatts =
          m.applianceWatts &&
          m.applianceWatts[app.id] !== undefined &&
          m.applianceWatts[app.id]! > 0
            ? m.applianceWatts[app.id]!
            : app.watts;
        const durationMin =
          (m.applianceDurations && m.applianceDurations[app.id]) ??
          app.defaultDurationMinutes;
        const daysUsed = Math.min(
          stayDays,
          Math.max(1, (m.applianceDays && m.applianceDays[app.id]) ?? stayDays)
        );
        const dailyKWh = (effectiveWatts * (durationMin / 60)) / 1000;
        const monthlyKWh = dailyKWh * daysUsed;

        activeAppliances.push({
          id: app.id,
          name: app.name,
          emoji: app.emoji,
          watts: effectiveWatts,
          durationMinutes: durationMin,
          daysPerMonth: daysUsed,
          dailyKWh: Math.round(dailyKWh * 1000) / 1000,
          monthlyKWh: Math.round(monthlyKWh * 1000) / 1000,
          isCustom: false,
        });
      }
    });

    // 2. Custom appliances
    if (m.customAppliances && m.customAppliances.length > 0) {
      m.customAppliances.forEach((c) => {
        if (c.enabled) {
          const daysUsed = Math.min(
            stayDays,
            Math.max(1, c.daysPerMonth ?? stayDays)
          );
          const dailyKWh = (c.watts * (c.durationMinutes / 60)) / 1000;
          const monthlyKWh = dailyKWh * daysUsed;

          activeAppliances.push({
            id: c.id,
            name: c.name,
            emoji: c.emoji || '⚡',
            watts: c.watts,
            durationMinutes: c.durationMinutes,
            daysPerMonth: daysUsed,
            dailyKWh: Math.round(dailyKWh * 1000) / 1000,
            monthlyKWh: Math.round(monthlyKWh * 1000) / 1000,
            isCustom: true,
          });
        }
      });
    }

    const appliancesDailyKWh = activeAppliances.reduce(
      (sum, a) => sum + a.dailyKWh,
      0
    );
    const appliancesMonthlyKWh = activeAppliances.reduce(
      (sum, a) => sum + a.monthlyKWh,
      0
    );

    const monthlyKWh = Math.max(0.01, acMonthlyKWh + appliancesMonthlyKWh);
    const totalDailyKWh = monthlyKWh / Math.max(1, stayDays);

    return {
      id: m.id,
      acDays,
      stayDays,
      stayDates: m.stayDates,
      acDailyKWh,
      acMonthlyKWh,
      appliancesDailyKWh,
      appliancesMonthlyKWh,
      totalDailyKWh,
      monthlyKWh,
      activeAppliances,
      tempInfo,
    };
  });

  const sumTotalDailyKWh = individualWeights.reduce(
    (acc, curr) => acc + curr.totalDailyKWh,
    0
  );
  const sumTotalMonthlyKWh = individualWeights.reduce(
    (acc, curr) => acc + curr.monthlyKWh,
    0
  );

  // Raw variable share weighted by monthly kWh
  const rawShares = individualWeights.map((w) => {
    const proportion =
      sumTotalMonthlyKWh > 0 ? w.monthlyKWh / sumTotalMonthlyKWh : 1 / n;
    const variableShare = variableCost * proportion;
    return {
      id: w.id,
      proportion,
      variableShare,
      totalRaw: basePerPerson + variableShare,
    };
  });

  // Balanced integer rounding so sum(shares) === safeTotal
  const flooredShares = rawShares.map((s) => ({
    ...s,
    rounded: Math.floor(s.totalRaw),
    remainder: s.totalRaw - Math.floor(s.totalRaw),
  }));

  const flooredSum = flooredShares.reduce((acc, curr) => acc + curr.rounded, 0);
  let discrepancy = safeTotal - flooredSum;

  // Distribute remaining baht based on highest decimal remainders
  const sortedRemainders = [...flooredShares].sort(
    (a, b) => b.remainder - a.remainder
  );
  const additions: Record<string, number> = {};
  for (let i = 0; i < discrepancy; i++) {
    const item = sortedRemainders[i % sortedRemainders.length];
    additions[item.id] = (additions[item.id] || 0) + 1;
  }

  const equalSharePerPerson = Math.round(safeTotal / n);

  const finalRoommates: RoommateShareResult[] = roommates.map((m, idx) => {
    const wInfo = individualWeights[idx];
    const rShare = flooredShares[idx];
    const finalTotal =
      safeTotal > 0 ? rShare.rounded + (additions[m.id] || 0) : 0;
    const percentage =
      safeTotal > 0
        ? Math.round((finalTotal / safeTotal) * 100)
        : Math.round(100 / n);

    const estimatedUnits =
      safeRate > 0 ? Math.round((finalTotal / safeRate) * 10) / 10 : 0;

    return {
      id: m.id,
      name: m.name.trim() || `เมท ${idx + 1}`,
      colorName: m.colorName,
      hex: m.hex,
      hours: m.hours,
      temperature: m.temperature,
      tempMultiplier: wInfo.tempInfo.multiplier,
      acDays: wInfo.acDays,
      stayDays: wInfo.stayDays,
      stayDates: wInfo.stayDates,
      tempStatus: {
        label: wInfo.tempInfo.label,
        isHotLoad: wInfo.tempInfo.isHotLoad,
        isEco: wInfo.tempInfo.isEco,
      },
      activeAppliances: wInfo.activeAppliances,
      totalDailyKWh: Math.round(wInfo.totalDailyKWh * 100) / 100,
      acDailyKWh: Math.round(wInfo.acDailyKWh * 100) / 100,
      acMonthlyKWh: Math.round(wInfo.acMonthlyKWh * 100) / 100,
      appliancesDailyKWh: Math.round(wInfo.appliancesDailyKWh * 100) / 100,
      appliancesMonthlyKWh: Math.round(wInfo.appliancesMonthlyKWh * 100) / 100,
      monthlyKWh: Math.round(wInfo.monthlyKWh * 100) / 100,
      estimatedUnits,
      baseShare: Math.round(basePerPerson),
      variableShare: Math.max(0, finalTotal - Math.round(basePerPerson)),
      totalShare: finalTotal,
      percentage,
      diffFromEqual: finalTotal - equalSharePerPerson,
    };
  });

  const totalUnits =
    safeRate > 0 ? Math.round((safeTotal / safeRate) * 10) / 10 : 0;

  return {
    totalBill: safeTotal,
    unitRate: safeRate,
    totalUnits,
    baseCommonFee,
    variableCost,
    roommates: finalRoommates,
    equalSharePerPerson,
    selectedBTU,
    totalDailyKWh: Math.round(sumTotalDailyKWh * 100) / 100,
    totalMonthlyKWh: Math.round(sumTotalMonthlyKWh * 100) / 100,
  };
}

export function formatBaht(amount: number): string {
  return new Intl.NumberFormat('th-TH').format(Math.round(amount));
}
