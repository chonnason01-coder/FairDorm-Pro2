import React, { useState } from 'react';
import {
  User,
  Clock,
  Thermometer,
  Trash2,
  Edit2,
  Check,
  Plus,
  Minus,
  X,
  Zap,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { CustomAppliance, Roommate, RoommateShareResult } from '../types';
import { APPLIANCES, formatBaht, getTempMultiplier } from '../utils/calculator';
import { sounds } from '../utils/soundEffects';

interface DynamicRoommateSectionProps {
  roommates: Roommate[];
  shares: RoommateShareResult[];
  hasCalculated?: boolean;
  isStale?: boolean;
  onAddRoommate: () => void;
  onRemoveRoommate: (id: string) => void;
  onUpdateRoommate: (updated: Roommate) => void;
  onSetRoommateCount?: (count: number) => void;
}

const QUICK_HOURS = [0, 4, 8, 12, 16];
const QUICK_ROOMMATE_COUNTS = [2, 3, 4, 6, 8, 10, 12];

const CUSTOM_PRESET_TEMPLATES = [
  { name: 'ตู้เย็นส่วนตัว', emoji: '🧊', watts: 60, durationMin: 1440, label: '60W • 24ชม.' },
  { name: 'พัดลมตั้งโต๊ะ', emoji: '💨', watts: 45, durationMin: 480, label: '45W • 8ชม.' },
  { name: 'หม้อหุงข้าว', emoji: '🍚', watts: 400, durationMin: 30, label: '400W • 30น.' },
  { name: 'PS5 คอนโซล', emoji: '🎮', watts: 200, durationMin: 240, label: '200W • 4ชม.' },
  { name: 'กาน้ำร้อนไฟฟ้า', emoji: '♨️', watts: 1500, durationMin: 10, label: '1.5kW • 10น.' },
];

export const DynamicRoommateSection: React.FC<DynamicRoommateSectionProps> = ({
  roommates,
  shares,
  hasCalculated = false,
  isStale = false,
  onAddRoommate,
  onRemoveRoommate,
  onUpdateRoommate,
  onSetRoommateCount,
}) => {
  const [typedCount, setTypedCount] = useState<string>(roommates.length.toString());

  // Keep typedCount in sync when external roommates change
  React.useEffect(() => {
    setTypedCount(roommates.length.toString());
  }, [roommates.length]);

  const handleCountChange = (valStr: string) => {
    setTypedCount(valStr);
    const n = parseInt(valStr, 10);
    if (!isNaN(n) && n >= 2 && n <= 40) {
      sounds.playClick(600);
      onSetRoommateCount?.(n);
    }
  };

  const handleQuickCountClick = (n: number) => {
    sounds.playClick(750);
    setTypedCount(n.toString());
    onSetRoommateCount?.(n);
  };

  return (
    <div className="space-y-3.5">
      {/* Top Header: Roommate count input (> 10 people supported) */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 backdrop-blur-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-200">
              👥 สมาชิกรูมเมทในห้อง
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {roommates.length} คน
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick(800);
              onAddRoommate();
            }}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>เพิ่มรูมเมท</span>
          </button>
        </div>

        {/* Direct number input for dormitory roommates (> 10 supported) */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60 text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">
            กรอกจำนวนคน:
          </span>

          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shrink-0">
            <button
              type="button"
              disabled={roommates.length <= 2}
              onClick={() => {
                if (roommates.length > 2) {
                  handleQuickCountClick(roommates.length - 1);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 active:scale-90"
              title="ลดจำนวนคน"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="number"
              min="2"
              max="40"
              value={typedCount}
              onChange={(e) => handleCountChange(e.target.value)}
              className="w-12 text-center bg-transparent text-sm font-black text-white font-mono focus:outline-none py-1"
            />

            <button
              type="button"
              onClick={() => handleQuickCountClick(roommates.length + 1)}
              className="p-1.5 text-slate-400 hover:text-white active:scale-90"
              title="เพิ่มจำนวนคน"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] text-slate-400 shrink-0">คน</span>

          {/* Quick Count Selection Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 pl-1">
            {QUICK_ROOMMATE_COUNTS.map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => handleQuickCountClick(cnt)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-90 shrink-0 border ${
                  roommates.length === cnt
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-xs'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {cnt} คน
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roommates Card List */}
      <div className="space-y-3">
        {roommates.map((mate, idx) => {
          const share = shares[idx] || {
            totalShare: 0,
            percentage: 0,
            tempStatus: getTempMultiplier(mate.temperature),
          };

          return (
            <RoommateCardItem
              key={mate.id}
              roommate={mate}
              share={share}
              hasCalculated={hasCalculated}
              isStale={isStale}
              canDelete={roommates.length > 2}
              onDelete={() => {
                sounds.playClick(400);
                onRemoveRoommate(mate.id);
              }}
              onChange={onUpdateRoommate}
            />
          );
        })}
      </div>
    </div>
  );
};

interface RoommateCardItemProps {
  roommate: Roommate;
  share: RoommateShareResult;
  hasCalculated: boolean;
  isStale: boolean;
  canDelete: boolean;
  onDelete: () => void;
  onChange: (updated: Roommate) => void;
}

const RoommateCardItem: React.FC<RoommateCardItemProps> = ({
  roommate,
  share,
  hasCalculated,
  isStale,
  canDelete,
  onDelete,
  onChange,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(roommate.name);
  const [showCalendar, setShowCalendar] = useState(false);

  // Custom appliance state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWatts, setCustomWatts] = useState('100');
  const [customDuration, setCustomDuration] = useState('2');
  const [customUnit, setCustomUnit] = useState<'hours' | 'minutes'>('hours');
  const [customDays, setCustomDays] = useState('30');
  const [customEmoji, setCustomEmoji] = useState('⚡');

  const currentStayDays = roommate.stayDays ?? (roommate.stayDates ? roommate.stayDates.length : 30);
  const currentACDays = Math.max(
    0,
    Math.min(
      currentStayDays,
      roommate.acDays !== undefined ? roommate.acDays : currentStayDays
    )
  );
  const tempInfo = getTempMultiplier(roommate.temperature);

  const handleACDaysChange = (days: number) => {
    sounds.playSliderTick(300 + days * 25);
    const validDays = Math.max(0, Math.min(currentStayDays, days));
    onChange({
      ...roommate,
      acDays: validDays,
    });
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    if (nameVal.trim()) {
      sounds.playClick(750);
      onChange({ ...roommate, name: nameVal.trim() });
    } else {
      setNameVal(roommate.name);
    }
  };

  const handleStayDaysPreset = (days: number) => {
    sounds.playClick(650);
    // Generate dates 1..days
    const dates = Array.from({ length: days }, (_, i) => i + 1);
    onChange({
      ...roommate,
      stayDays: days,
      stayDates: dates,
    });
  };

  const handleToggleDay = (dayNum: number) => {
    sounds.playClick(800);
    const existingDates = roommate.stayDates ?? Array.from({ length: currentStayDays }, (_, i) => i + 1);
    const hasDay = existingDates.includes(dayNum);
    const updatedDates = hasDay
      ? existingDates.filter((d) => d !== dayNum)
      : [...existingDates, dayNum].sort((a, b) => a - b);

    const safeDates = updatedDates.length === 0 ? [1] : updatedDates;
    onChange({
      ...roommate,
      stayDays: safeDates.length,
      stayDates: safeDates,
    });
  };

  const handleSelectWeekdayPreset = () => {
    sounds.playClick(700);
    // Select ~22 weekdays (skip weekends assuming 30 days month starting Monday)
    const weekdays: number[] = [];
    for (let day = 1; day <= 30; day++) {
      const dayOfWeek = (day - 1) % 7;
      if (dayOfWeek < 5) {
        weekdays.push(day);
      }
    }
    onChange({
      ...roommate,
      stayDays: weekdays.length,
      stayDates: weekdays,
    });
  };

  const handleSelectWeekendPreset = () => {
    sounds.playClick(700);
    const weekends: number[] = [];
    for (let day = 1; day <= 30; day++) {
      const dayOfWeek = (day - 1) % 7;
      if (dayOfWeek >= 5) {
        weekends.push(day);
      }
    }
    onChange({
      ...roommate,
      stayDays: weekends.length,
      stayDates: weekends,
    });
  };

  const toggleAppliance = (key: 'gaming_pc' | 'cooking_pot' | 'hair_dryer' | 'iron') => {
    const nextState = !roommate.appliances[key];
    sounds.playToggle(nextState);
    onChange({
      ...roommate,
      appliances: {
        ...roommate.appliances,
        [key]: nextState,
      },
    });
  };

  const updateApplianceDuration = (
    key: 'gaming_pc' | 'cooking_pot' | 'hair_dryer' | 'iron',
    minutes: number
  ) => {
    sounds.playClick(600);
    onChange({
      ...roommate,
      applianceDurations: {
        ...(roommate.applianceDurations || {
          gaming_pc: 360,
          cooking_pot: 30,
          hair_dryer: 15,
          iron: 15,
        }),
        [key]: minutes,
      },
    });
  };

  const updateApplianceDays = (
    key: 'gaming_pc' | 'cooking_pot' | 'hair_dryer' | 'iron',
    days: number
  ) => {
    sounds.playClick(600);
    onChange({
      ...roommate,
      applianceDays: {
        ...(roommate.applianceDays || {}),
        [key]: Math.min(currentStayDays, Math.max(1, days)),
      },
    });
  };

  const updateApplianceWatts = (
    key: 'gaming_pc' | 'cooking_pot' | 'hair_dryer' | 'iron',
    watts: number
  ) => {
    sounds.playClick(650);
    onChange({
      ...roommate,
      applianceWatts: {
        ...(roommate.applianceWatts || {}),
        [key]: Math.max(1, watts),
      },
    });
  };

  const resetApplianceWatts = (
    key: 'gaming_pc' | 'cooking_pot' | 'hair_dryer' | 'iron'
  ) => {
    sounds.playClick(500);
    const updatedWatts = { ...(roommate.applianceWatts || {}) };
    delete updatedWatts[key];
    onChange({
      ...roommate,
      applianceWatts: updatedWatts,
    });
  };

  const handleAddCustomAppliance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customName.trim()) return;
    const watts = Math.max(1, parseInt(customWatts, 10) || 100);
    const durVal = Math.max(0.1, parseFloat(customDuration) || 1);
    const durationMinutes =
      customUnit === 'hours' ? Math.round(durVal * 60) : Math.round(durVal);
    const daysPerMonth = Math.min(
      currentStayDays,
      Math.max(1, parseInt(customDays, 10) || currentStayDays)
    );

    const newCustom: CustomAppliance = {
      id: `ca_${Date.now()}`,
      name: customName.trim(),
      emoji: customEmoji || '⚡',
      watts,
      durationMinutes,
      daysPerMonth,
      enabled: true,
    };

    sounds.playToggle(true);
    onChange({
      ...roommate,
      customAppliances: [...(roommate.customAppliances || []), newCustom],
    });

    setCustomName('');
    setCustomWatts('100');
    setCustomDuration('2');
    setCustomUnit('hours');
    setCustomDays('30');
    setIsAddingCustom(false);
  };

  const updateCustomAppliance = (
    id: string,
    updates: Partial<CustomAppliance>
  ) => {
    sounds.playClick(600);
    const list = roommate.customAppliances || [];
    onChange({
      ...roommate,
      customAppliances: list.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  const handleToggleCustom = (id: string) => {
    const list = roommate.customAppliances || [];
    const item = list.find((c) => c.id === id);
    if (!item) return;
    sounds.playToggle(!item.enabled);
    onChange({
      ...roommate,
      customAppliances: list.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      ),
    });
  };

  const handleDeleteCustom = (id: string) => {
    sounds.playClick(400);
    onChange({
      ...roommate,
      customAppliances: (roommate.customAppliances || []).filter(
        (c) => c.id !== id
      ),
    });
  };

  const applyCustomPreset = (
    name: string,
    emoji: string,
    watts: number,
    durationMin: number
  ) => {
    setCustomName(name);
    setCustomEmoji(emoji);
    setCustomWatts(watts.toString());
    if (durationMin >= 60) {
      setCustomDuration((durationMin / 60).toString());
      setCustomUnit('hours');
    } else {
      setCustomDuration(durationMin.toString());
      setCustomUnit('minutes');
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3.5 shadow-sm relative transition-all backdrop-blur-xs hover:border-slate-600">
      {/* Top Header: Avatar, Name & Live Share Pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-xs cursor-pointer active:scale-90 transition-transform"
            style={{ backgroundColor: roommate.hex }}
            onClick={() => sounds.playClick(700)}
          >
            <User className="w-4 h-4 stroke-[2.5]" />
          </div>

          {isEditingName ? (
            <div className="flex items-center gap-1.5 flex-1 max-w-[190px]">
              <input
                type="text"
                autoFocus
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') {
                    setNameVal(roommate.name);
                    setIsEditingName(false);
                  }
                }}
                className="w-full text-sm font-bold text-white bg-slate-900 border-b-2 border-emerald-500 focus:outline-none px-1 py-0.5"
                maxLength={20}
              />
              <button
                onClick={handleNameSave}
                className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded active:scale-90"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 group cursor-pointer"
              onClick={() => {
                sounds.playClick(600);
                setIsEditingName(true);
              }}
            >
              <span className="text-sm font-bold text-white truncate">
                {roommate.name}
              </span>
              <Edit2 className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
            </div>
          )}
        </div>

        {/* Share Pill: Shows calculated amount ONLY after clicking calculate or waiting badge */}
        <div className="flex items-center gap-2 shrink-0">
          {hasCalculated ? (
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-black tabular-nums shadow-xs flex items-center gap-1 border transition-all active:scale-95 cursor-default ${
                isStale ? 'opacity-85 border-dashed ring-1 ring-amber-400/30' : ''
              }`}
              style={{
                color: roommate.hex,
                backgroundColor: `${roommate.hex}18`,
                borderColor: isStale ? `${roommate.hex}70` : `${roommate.hex}35`,
              }}
              title={isStale ? 'ข้อมูลเปลี่ยน แตะคำนวณใหม่เพื่ออัปเดตยอด' : `สัดส่วน ${share.percentage}%`}
            >
              <span>{share.percentage}%</span>
              <span className="text-[10px] opacity-80">
                (฿{formatBaht(share.totalShare)})
              </span>
              {isStale && (
                <span className="text-[9px] text-amber-400 font-bold animate-pulse" title="รอคำนวณใหม่">
                  ↺
                </span>
              )}
            </div>
          ) : (
            <div
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-400 bg-slate-900/80 border border-slate-700/70 flex items-center gap-1.5 shadow-xs"
              title="จะแสดงยอดเงินหลังกดปุ่มคำนวณบิล"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>รอคำนวณ</span>
            </div>
          )}

          {canDelete && (
            <button
              onClick={onDelete}
              title="ลบรูมเมทนี้ออก"
              aria-label="ลบรูมเมทนี้ออก"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors active:scale-90 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 30-Day Tracking Section (User request: เพิ่มวันที่ 30 วัน ว่าใช้อะไรวันไหนบ้าง) */}
      <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-700/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>วันอยู่หอในรอบ 30 วัน:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="font-mono font-black text-xs px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${roommate.hex}22`,
                color: roommate.hex,
              }}
            >
              {currentStayDays} / 30 วัน
            </span>

            <button
              type="button"
              onClick={() => {
                sounds.playClick(600);
                setShowCalendar(!showCalendar);
              }}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-700 transition-colors cursor-pointer active:scale-95"
            >
              <CalendarDays className="w-3 h-3 text-cyan-400" />
              <span>{showCalendar ? 'ซ่อนปฏิทิน' : 'เลือกวันที่'}</span>
              {showCalendar ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Quick Stay Days presets */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
          <span className="text-slate-500 shrink-0">ลัด:</span>
          {[
            { label: '30 วัน (เต็มเดือน)', days: 30 },
            { label: '22 วัน (จ.-ศ.)', days: 22 },
            { label: '15 วัน (ครึ่งเดือน)', days: 15 },
            { label: '8 วัน (เฉพาะวันหยุด)', days: 8 },
          ].map((item) => (
            <button
              key={item.days}
              type="button"
              onClick={() => handleStayDaysPreset(item.days)}
              className={`px-2 py-0.5 rounded-md border transition-all active:scale-90 shrink-0 font-medium cursor-pointer ${
                currentStayDays === item.days
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Interactive 30-Day Mini Calendar Grid */}
        {showCalendar && (
          <div className="pt-2 border-t border-slate-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>แตะวันที่ เพื่อเปิด-ปิดการอยู่อาศัยในเดือนนี้ (1-30):</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleStayDaysPreset(30)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[9px] cursor-pointer active:scale-95"
                >
                  เลือกหมด (30)
                </button>
                <button
                  type="button"
                  onClick={handleSelectWeekdayPreset}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[9px] cursor-pointer active:scale-95"
                >
                  เฉพาะ จ.-ศ.
                </button>
                <button
                  type="button"
                  onClick={handleSelectWeekendPreset}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[9px] cursor-pointer active:scale-95"
                >
                  เฉพาะ ส.-อา.
                </button>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-1 pt-1">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                const activeDates =
                  roommate.stayDates ??
                  Array.from({ length: currentStayDays }, (_, idx) => idx + 1);
                const isSelected = activeDates.includes(dayNum);

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleToggleDay(dayNum)}
                    className={`h-7 rounded-md text-[10px] font-mono font-bold flex items-center justify-center transition-all active:scale-90 border cursor-pointer ${
                      isSelected
                        ? 'text-slate-950 font-black shadow-xs'
                        : 'bg-slate-950 text-slate-600 border-slate-800 hover:border-slate-700'
                    }`}
                    style={{
                      backgroundColor: isSelected ? roommate.hex : undefined,
                      borderColor: isSelected ? roommate.hex : undefined,
                    }}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-slate-500 font-mono text-center">
              💡 คนที่ไม่อยู่เต็มเดือน ค่าแอร์และไฟจะลดลงตามสัดส่วนวันที่อยู่จริง
            </p>
          </div>
        )}
      </div>

      {/* 1. Hours Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            เปิดแอร์เฉลี่ย
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="text-lg font-black tabular-nums transition-transform active:scale-110"
              style={{ color: roommate.hex }}
            >
              {roommate.hours}
            </span>
            <span className="text-slate-400 text-xs">ชม./วัน</span>
            <span className="text-[10px] text-slate-500 font-mono">
              (~{roommate.hours * currentStayDays} ชม./ด.)
            </span>
          </div>
        </div>

        {/* Dynamic Context Bubble */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-medium">
            {roommate.hours === 0
              ? '❌ ไม่ได้เปิดแอร์เลย'
              : roommate.hours <= 4
              ? '🍃 เปิดน้อย ประหยัดไฟ'
              : roommate.hours <= 8
              ? '🌙 เปิดเฉพาะเวลานอน'
              : roommate.hours <= 12
              ? '💻 เปิดทำงาน / เล่นเกม'
              : '🔥 เปิดทั้งวันเกือบ 24 ชม.'}
          </span>
          <span className="text-[9px] font-mono text-slate-500">
            {roommate.hours > 0 ? `วันละ ~${((roommate.hours * 1200) / 1000).toFixed(1)} kWh` : '0 kWh'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={roommate.hours}
          onChange={(e) => {
            const h = parseInt(e.target.value, 10);
            sounds.playSliderTick(350 + h * 25);
            onChange({ ...roommate, hours: h });
          }}
          style={{ accentColor: roommate.hex }}
          className="w-full h-2.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer transition-all hover:brightness-110"
        />

        <div className="flex items-center gap-1 pt-1">
          {QUICK_HOURS.map((hr) => (
            <button
              key={hr}
              type="button"
              onClick={() => {
                sounds.playSliderTick(450 + hr * 30);
                onChange({ ...roommate, hours: hr });
              }}
              className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all active:scale-90 cursor-pointer ${
                roommate.hours === hr
                  ? 'text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              style={{
                backgroundColor: roommate.hours === hr ? roommate.hex : undefined,
                borderColor: roommate.hours === hr ? roommate.hex : undefined,
              }}
            >
              {hr}h
            </button>
          ))}
        </div>

        {/* 1.1 AC Frequency (Days per month using AC) */}
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/60 space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
              <span>ความถี่เปิดแอร์ (วัน/เดือน)</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className="text-base font-black tabular-nums"
                style={{ color: roommate.hex }}
              >
                {currentACDays}
              </span>
              <span className="text-slate-400 text-xs">วัน</span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                (รวม ~{roommate.hours * currentACDays} ชม./เดือน)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max={currentStayDays}
            step="1"
            value={currentACDays}
            onChange={(e) => handleACDaysChange(parseInt(e.target.value, 10))}
            style={{ accentColor: roommate.hex }}
            className="w-full h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer transition-all hover:brightness-110"
          />

          <div className="flex items-center justify-between gap-1 text-[9px]">
            <div className="flex items-center gap-1">
              {[
                { label: `ทุกวัน (${currentStayDays}ว.)`, days: currentStayDays },
                { label: 'จ.-ศ. (22ว.)', days: Math.min(22, currentStayDays) },
                { label: 'ส.-อา. (8ว.)', days: Math.min(8, currentStayDays) },
                { label: 'ไม่เปิด (0ว.)', days: 0 },
              ].map((preset) => {
                const isSel = currentACDays === preset.days;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleACDaysChange(preset.days)}
                    className={`px-1.5 py-0.5 rounded-md border font-medium transition-all active:scale-90 cursor-pointer ${
                      isSel
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-slate-500">
              max {currentStayDays} วัน
            </span>
          </div>
        </div>
      </div>

      {/* 2. Temperature Slider (18°C - 28°C) */}
      <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            อุณหภูมิแอร์
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                tempInfo.isHotLoad
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : tempInfo.isEco
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {tempInfo.label}
            </span>
            <span className="text-sm font-black text-white font-mono">
              {roommate.temperature}°C
            </span>
          </div>
        </div>

        <input
          type="range"
          min="18"
          max="28"
          step="1"
          value={roommate.temperature}
          onChange={(e) => {
            const t = parseInt(e.target.value, 10);
            sounds.playSliderTick(250 + (28 - t) * 40);
            onChange({ ...roommate, temperature: t });
          }}
          className="w-full h-2.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all hover:brightness-110"
        />

        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
          <span className="text-rose-400 font-medium">18°C (โหลดแอร์ +25%)</span>
          <span className="text-emerald-400 font-bold">25°C-26°C (Eco)</span>
          <span className="text-cyan-400">28°C (ประหยัดสุด)</span>
        </div>
      </div>

      {/* 3. Personal Appliances & Realistic kWh Consumption */}
      <div className="pt-2 border-t border-slate-700/60 space-y-2.5">
        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>เครื่องใช้ไฟฟ้าส่วนตัว (คิดตาม kWh จริง)</span>
          </span>
          <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            W × ชม. × วัน / 1,000
          </span>
        </div>

        {/* Preset Appliances Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {APPLIANCES.map((app) => {
            const isActive = roommate.appliances[app.id];
            const currentWatts =
              (roommate.applianceWatts && roommate.applianceWatts[app.id]) ??
              app.watts;
            const isCustomWatts =
              roommate.applianceWatts &&
              roommate.applianceWatts[app.id] !== undefined &&
              roommate.applianceWatts[app.id] !== app.watts;
            const currentDur =
              (roommate.applianceDurations &&
                roommate.applianceDurations[app.id]) ??
              app.defaultDurationMinutes;
            const daysUsed = Math.min(
              currentStayDays,
              (roommate.applianceDays && roommate.applianceDays[app.id]) ??
                currentStayDays
            );
            const dailyKWh = (currentWatts * (currentDur / 60)) / 1000;
            const monthlyKWh = dailyKWh * daysUsed;

            return (
              <button
                key={app.id}
                type="button"
                onClick={() => toggleAppliance(app.id)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-150 active:scale-95 cursor-pointer relative flex flex-col justify-between select-none ${
                  isActive
                    ? 'bg-slate-900 border-emerald-500/80 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-700/80 text-slate-400 opacity-60 hover:opacity-90 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base transition-transform group-hover:scale-110">{app.emoji}</span>
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_8px_#10b981]'
                          : 'bg-slate-700'
                      }`}
                    />
                  </div>
                  <div
                    className={`text-[11px] font-bold mt-1.5 truncate ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {app.name}
                  </div>
                </div>

                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span
                      className={`px-1 py-0.2 rounded font-bold transition-colors ${
                        isActive
                          ? isCustomWatts
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                            : 'bg-emerald-500/20 text-emerald-300'
                          : isCustomWatts
                          ? 'bg-amber-950/60 text-amber-400/80 border border-amber-800/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                      title={isCustomWatts ? `กำลังไฟปรับแต่งเอง: ${currentWatts}W` : `กำลังไฟมาตรฐาน: ${app.watts}W`}
                    >
                      {currentWatts >= 1000
                        ? `${(currentWatts / 1000).toFixed(currentWatts % 1000 === 0 ? 0 : 1)}kW`
                        : `${currentWatts}W`}
                    </span>
                    <span className="text-slate-400">
                      {currentDur >= 60
                        ? `${currentDur / 60}ชม.`
                        : `${currentDur}น.`}
                    </span>
                  </div>

                  {isActive && (
                    <div className="text-[8.5px] font-mono text-emerald-400 text-right leading-none pt-0.5">
                      ~{monthlyKWh.toFixed(1)} หน่วย/ด. ({daysUsed}วัน)
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preset Appliance Duration & Day Config Rows (Visible when active) */}
        {(roommate.appliances.hair_dryer ||
          roommate.appliances.gaming_pc ||
          roommate.appliances.cooking_pot ||
          roommate.appliances.iron) && (
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-700/70 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>ปรับเวลาและจำนวนวันที่ใช้จริงใน 30 วัน:</span>
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                (อยู่หอ {currentStayDays} วัน)
              </span>
            </div>

            {/* ไดร์เป่าผม */}
            {roommate.appliances.hair_dryer && (() => {
              const watts = roommate.applianceWatts?.hair_dryer ?? 1800;
              const isCustomWatts =
                roommate.applianceWatts?.hair_dryer !== undefined &&
                roommate.applianceWatts?.hair_dryer !== 1800;
              const dur = roommate.applianceDurations?.hair_dryer ?? 15;
              const days = roommate.applianceDays?.hair_dryer ?? currentStayDays;
              const monthlyKWh = (watts * (dur / 60) * days) / 1000;
              return (
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 space-y-2 text-[10px]">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-300">
                        💨 ไดร์เป่าผม
                      </span>
                      {/* Editable Watt Input */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <span className="text-[8.5px] text-slate-400 font-medium">กำลังไฟ:</span>
                        <input
                          type="number"
                          min="50"
                          max="3500"
                          step="50"
                          value={watts}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceWatts('hair_dryer', val);
                          }}
                          className="w-12 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-amber-300 text-center font-bold focus:outline-none focus:border-amber-500"
                          placeholder="1800"
                        />
                        <span className="text-[9px] text-amber-400 font-mono font-bold">W</span>
                        {isCustomWatts && (
                          <button
                            type="button"
                            onClick={() => resetApplianceWatts('hair_dryer')}
                            title="รีเซ็ตเป็นค่าเริ่มต้น (1,800W)"
                            className="text-[8px] text-slate-400 hover:text-rose-400 underline ml-0.5 cursor-pointer"
                          >
                            รีเซ็ต
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">
                      ~{monthlyKWh.toFixed(1)} kWh/เดือน
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[9px]">
                    {/* เวลา/วัน Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">เวลา/วัน:</span>
                        {[5, 10, 15, 25].map((mins) => {
                          const isSel = (roommate.applianceDurations?.hair_dryer ?? 15) === mins;
                          return (
                            <button
                              key={mins}
                              type="button"
                              onClick={() => updateApplianceDuration('hair_dryer', mins)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {mins}น.
                            </button>
                          );
                        })}
                      </div>
                      {/* Direct Custom Duration Input */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="1"
                          max="180"
                          step="1"
                          value={roommate.applianceDurations?.hair_dryer ?? 15}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) updateApplianceDuration('hair_dryer', Math.max(0, val));
                          }}
                          className="w-9 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-emerald-300 text-center focus:outline-none focus:border-emerald-500"
                          placeholder="15"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">นาที</span>
                      </div>
                    </div>

                    {/* จำนวนวัน Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 border-t border-slate-700/40">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">ใช้กี่วัน:</span>
                        {[8, 15, 20, currentStayDays].map((days) => {
                          const isSel = (roommate.applianceDays?.hair_dryer ?? currentStayDays) === days;
                          return (
                            <button
                              key={days}
                              type="button"
                              onClick={() => updateApplianceDays('hair_dryer', days)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {days}วัน
                            </button>
                          );
                        })}
                      </div>
                      {/* Expanded Days Input with clear unit */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="1"
                          max={currentStayDays}
                          value={roommate.applianceDays?.hair_dryer ?? currentStayDays}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceDays('hair_dryer', val);
                          }}
                          className="w-9 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-cyan-300 text-center focus:outline-none focus:border-cyan-500"
                          placeholder="30"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">วัน/เดือน</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* เตารีดผ้า */}
            {roommate.appliances.iron && (() => {
              const watts = roommate.applianceWatts?.iron ?? 1000;
              const isCustomWatts =
                roommate.applianceWatts?.iron !== undefined &&
                roommate.applianceWatts?.iron !== 1000;
              const dur = roommate.applianceDurations?.iron ?? 15;
              const days = roommate.applianceDays?.iron ?? Math.min(8, currentStayDays);
              const monthlyKWh = (watts * (dur / 60) * days) / 1000;
              return (
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 space-y-2 text-[10px]">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-300">
                        👔 เตารีดผ้า
                      </span>
                      {/* Editable Watt Input */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <span className="text-[8.5px] text-slate-400 font-medium">กำลังไฟ:</span>
                        <input
                          type="number"
                          min="50"
                          max="3500"
                          step="50"
                          value={watts}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceWatts('iron', val);
                          }}
                          className="w-12 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-amber-300 text-center font-bold focus:outline-none focus:border-amber-500"
                          placeholder="1000"
                        />
                        <span className="text-[9px] text-amber-400 font-mono font-bold">W</span>
                        {isCustomWatts && (
                          <button
                            type="button"
                            onClick={() => resetApplianceWatts('iron')}
                            title="รีเซ็ตเป็นค่าเริ่มต้น (1,000W)"
                            className="text-[8px] text-slate-400 hover:text-rose-400 underline ml-0.5 cursor-pointer"
                          >
                            รีเซ็ต
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">
                      ~{monthlyKWh.toFixed(1)} kWh/เดือน
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[9px]">
                    {/* เวลา/ครั้ง Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">เวลา/ครั้ง:</span>
                        {[10, 15, 25, 30].map((mins) => {
                          const isSel = (roommate.applianceDurations?.iron ?? 15) === mins;
                          return (
                            <button
                              key={mins}
                              type="button"
                              onClick={() => updateApplianceDuration('iron', mins)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {mins}น.
                            </button>
                          );
                        })}
                      </div>
                      {/* Direct Custom Duration Input */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="1"
                          max="180"
                          step="1"
                          value={roommate.applianceDurations?.iron ?? 15}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) updateApplianceDuration('iron', Math.max(0, val));
                          }}
                          className="w-9 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-emerald-300 text-center focus:outline-none focus:border-emerald-500"
                          placeholder="15"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">นาที</span>
                      </div>
                    </div>

                    {/* จำนวนวัน Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 border-t border-slate-700/40">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">รีดกี่วัน:</span>
                        {[2, 4, 8, currentStayDays].map((days) => {
                          const isSel = (roommate.applianceDays?.iron ?? Math.min(8, currentStayDays)) === days;
                          return (
                            <button
                              key={days}
                              type="button"
                              onClick={() => updateApplianceDays('iron', days)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {days}วัน
                            </button>
                          );
                        })}
                      </div>
                      {/* Expanded Days Input with clear unit */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="1"
                          max={currentStayDays}
                          value={roommate.applianceDays?.iron ?? Math.min(8, currentStayDays)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceDays('iron', val);
                          }}
                          className="w-9 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-cyan-300 text-center focus:outline-none focus:border-cyan-500"
                          placeholder="4"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">วัน/เดือน</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* คอมเกมมิ่ง PC */}
            {roommate.appliances.gaming_pc && (() => {
              const watts = roommate.applianceWatts?.gaming_pc ?? 250;
              const isCustomWatts =
                roommate.applianceWatts?.gaming_pc !== undefined &&
                roommate.applianceWatts?.gaming_pc !== 250;
              const dur = roommate.applianceDurations?.gaming_pc ?? 360;
              const days = roommate.applianceDays?.gaming_pc ?? currentStayDays;
              const monthlyKWh = (watts * (dur / 60) * days) / 1000;
              return (
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 space-y-2 text-[10px]">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-300">
                        🖥️ คอมเกมมิ่ง PC
                      </span>
                      {/* Editable Watt Input */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <span className="text-[8.5px] text-slate-400 font-medium">กำลังไฟ:</span>
                        <input
                          type="number"
                          min="50"
                          max="2000"
                          step="25"
                          value={watts}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceWatts('gaming_pc', val);
                          }}
                          className="w-12 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-amber-300 text-center font-bold focus:outline-none focus:border-amber-500"
                          placeholder="250"
                        />
                        <span className="text-[9px] text-amber-400 font-mono font-bold">W</span>
                        {isCustomWatts && (
                          <button
                            type="button"
                            onClick={() => resetApplianceWatts('gaming_pc')}
                            title="รีเซ็ตเป็นค่าเริ่มต้น (250W)"
                            className="text-[8px] text-slate-400 hover:text-rose-400 underline ml-0.5 cursor-pointer"
                          >
                            รีเซ็ต
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">
                      ~{monthlyKWh.toFixed(1)} kWh/เดือน
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[9px]">
                    {/* เวลา/วัน Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">เวลา/วัน:</span>
                        {[
                          { h: 3, m: 180 },
                          { h: 6, m: 360 },
                          { h: 8, m: 480 },
                          { h: 12, m: 720 },
                        ].map((item) => {
                          const isSel = (roommate.applianceDurations?.gaming_pc ?? 360) === item.m;
                          return (
                            <button
                              key={item.m}
                              type="button"
                              onClick={() => updateApplianceDuration('gaming_pc', item.m)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {item.h}ชม.
                            </button>
                          );
                        })}
                      </div>
                      {/* Direct Custom Duration Input (in hours) */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={
                            roommate.applianceDurations?.gaming_pc !== undefined
                              ? Math.round((roommate.applianceDurations.gaming_pc / 60) * 10) / 10
                              : 6
                          }
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) updateApplianceDuration('gaming_pc', Math.round(val * 60));
                          }}
                          className="w-10 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-emerald-300 text-center focus:outline-none focus:border-emerald-500"
                          placeholder="6"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">ชั่วโมง</span>
                      </div>
                    </div>

                    {/* จำนวนวัน Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 border-t border-slate-700/40">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">เล่นกี่วัน:</span>
                        {[10, 20, 25, currentStayDays].map((days) => {
                          const isSel = (roommate.applianceDays?.gaming_pc ?? currentStayDays) === days;
                          return (
                            <button
                              key={days}
                              type="button"
                              onClick={() => updateApplianceDays('gaming_pc', days)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {days}วัน
                            </button>
                          );
                        })}
                      </div>
                      {/* Expanded Days Input with clear unit */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="1"
                          max={currentStayDays}
                          value={roommate.applianceDays?.gaming_pc ?? currentStayDays}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceDays('gaming_pc', val);
                          }}
                          className="w-9 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-cyan-300 text-center focus:outline-none focus:border-cyan-500"
                          placeholder="25"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">วัน/เดือน</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* กระทะชาบู */}
            {roommate.appliances.cooking_pot && (() => {
              const watts = roommate.applianceWatts?.cooking_pot ?? 1200;
              const isCustomWatts =
                roommate.applianceWatts?.cooking_pot !== undefined &&
                roommate.applianceWatts?.cooking_pot !== 1200;
              const dur = roommate.applianceDurations?.cooking_pot ?? 30;
              const days = roommate.applianceDays?.cooking_pot ?? Math.min(4, currentStayDays);
              const monthlyKWh = (watts * (dur / 60) * days) / 1000;
              return (
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 space-y-2 text-[10px]">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-300">
                        🍳 กระทะชาบู
                      </span>
                      {/* Editable Watt Input */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <span className="text-[8.5px] text-slate-400 font-medium">กำลังไฟ:</span>
                        <input
                          type="number"
                          min="100"
                          max="3000"
                          step="50"
                          value={watts}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceWatts('cooking_pot', val);
                          }}
                          className="w-12 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-amber-300 text-center font-bold focus:outline-none focus:border-amber-500"
                          placeholder="1200"
                        />
                        <span className="text-[9px] text-amber-400 font-mono font-bold">W</span>
                        {isCustomWatts && (
                          <button
                            type="button"
                            onClick={() => resetApplianceWatts('cooking_pot')}
                            title="รีเซ็ตเป็นค่าเริ่มต้น (1,200W)"
                            className="text-[8px] text-slate-400 hover:text-rose-400 underline ml-0.5 cursor-pointer"
                          >
                            รีเซ็ต
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">
                      ~{monthlyKWh.toFixed(1)} kWh/เดือน
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[9px]">
                    {/* เวลา/ครั้ง Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">เวลา/ครั้ง:</span>
                        {[15, 30, 45, 60].map((mins) => {
                          const isSel = (roommate.applianceDurations?.cooking_pot ?? 30) === mins;
                          return (
                            <button
                              key={mins}
                              type="button"
                              onClick={() => updateApplianceDuration('cooking_pot', mins)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {mins}น.
                            </button>
                          );
                        })}
                      </div>
                      {/* Direct Custom Duration Input */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="1"
                          max="240"
                          step="5"
                          value={roommate.applianceDurations?.cooking_pot ?? 30}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) updateApplianceDuration('cooking_pot', Math.max(0, val));
                          }}
                          className="w-9 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-emerald-300 text-center focus:outline-none focus:border-emerald-500"
                          placeholder="30"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">นาที</span>
                      </div>
                    </div>

                    {/* จำนวนวัน Input & Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 border-t border-slate-700/40">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">ต้มกี่วัน:</span>
                        {[2, 4, 8, currentStayDays].map((days) => {
                          const isSel = (roommate.applianceDays?.cooking_pot ?? Math.min(4, currentStayDays)) === days;
                          return (
                            <button
                              key={days}
                              type="button"
                              onClick={() => updateApplianceDays('cooking_pot', days)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer transition-all active:scale-90 ${
                                isSel ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {days}วัน
                            </button>
                          );
                        })}
                      </div>
                      {/* Expanded Days Input with clear unit */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <input
                          type="number"
                          min="1"
                          max={currentStayDays}
                          value={roommate.applianceDays?.cooking_pot ?? Math.min(4, currentStayDays)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateApplianceDays('cooking_pot', val);
                          }}
                          className="w-9 px-1 py-0.5 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono text-cyan-300 text-center focus:outline-none focus:border-cyan-500"
                          placeholder="4"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">วัน/เดือน</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Custom Appliances List & Creation Section */}
        <div className="space-y-2 pt-1">
          {roommate.customAppliances && roommate.customAppliances.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400">
                อุปกรณ์เพิ่มเติม ({roommate.customAppliances.length} รายการ):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {roommate.customAppliances.map((c) => {
                  const daysUsed = Math.min(currentStayDays, c.daysPerMonth ?? currentStayDays);
                  const dailyKWh = (c.watts * (c.durationMinutes / 60)) / 1000;
                  const monthlyKWh = dailyKWh * daysUsed;

                  return (
                    <div
                      key={c.id}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between text-xs transition-all gap-2 ${
                        c.enabled
                          ? 'bg-slate-900/90 border-cyan-500/60 ring-1 ring-cyan-500/30'
                          : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleCustom(c.id)}
                          className="flex items-center gap-1.5 flex-1 min-w-0 text-left active:scale-95 cursor-pointer"
                        >
                          <span className="text-sm">{c.emoji || '⚡'}</span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`font-bold text-[11px] truncate ${
                                c.enabled ? 'text-white' : 'text-slate-400'
                              }`}
                            >
                              {c.name} ({c.watts}W)
                            </div>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0 pl-1">
                          {c.enabled && (
                            <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                              ~{monthlyKWh.toFixed(1)} kWh/ด.
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteCustom(c.id)}
                            aria-label="ลบอุปกรณ์"
                            className="p-1 text-slate-500 hover:text-rose-400 active:scale-90 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Editable inputs for Duration and Days */}
                      {c.enabled && (
                        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80 text-[9px]">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">เวลา/วัน:</span>
                            <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700">
                              <input
                                type="number"
                                min="1"
                                max="1440"
                                step="1"
                                value={c.durationMinutes}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val)) updateCustomAppliance(c.id, { durationMinutes: Math.max(1, val) });
                                }}
                                className="w-8 px-0.5 text-center bg-transparent text-emerald-300 font-mono focus:outline-none"
                              />
                              <span className="text-[8px] text-slate-500">น.</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">ใช้:</span>
                            <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700">
                              <input
                                type="number"
                                min="1"
                                max={currentStayDays}
                                value={daysUsed}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val)) updateCustomAppliance(c.id, { daysPerMonth: Math.max(1, Math.min(currentStayDays, val)) });
                                }}
                                className="w-8 px-0.5 text-center bg-transparent text-cyan-300 font-mono focus:outline-none"
                              />
                              <span className="text-[8px] text-slate-500">ว./ด.</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Custom Appliance Button or Form */}
          {!isAddingCustom ? (
            <button
              type="button"
              onClick={() => {
                sounds.playClick(700);
                setIsAddingCustom(true);
              }}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/60 text-slate-400 hover:text-emerald-300 bg-slate-900/40 hover:bg-slate-900/80 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ เพิ่มเครื่องใช้ไฟฟ้าเอง (Custom Appliance)</span>
            </button>
          ) : (
            <div className="bg-slate-900 p-3 rounded-xl border border-cyan-500/50 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                <span className="font-bold text-cyan-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>เพิ่มเครื่องใช้ไฟฟ้าส่วนตัว</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-1">
                <div className="text-[9px] text-slate-400 font-bold">เลือกด่วนตามเครื่องยอดนิยม:</div>
                <div className="flex flex-wrap gap-1">
                  {CUSTOM_PRESET_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() =>
                        applyCustomPreset(
                          tmpl.name,
                          tmpl.emoji,
                          tmpl.watts,
                          tmpl.durationMin
                        )
                      }
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700 flex items-center gap-1 active:scale-95 transition-all"
                    >
                      <span>{tmpl.emoji}</span>
                      <span>{tmpl.name} ({tmpl.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="sm:col-span-1">
                  <label className="text-[10px] text-slate-400 block mb-0.5">ชื่ออุปกรณ์:</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="เช่น ตู้เย็น, พัดลม"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">กำลังวัตต์ (W):</label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={customWatts}
                    onChange={(e) => setCustomWatts(e.target.value)}
                    placeholder="เช่น 60, 400"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">เวลาใช้งาน/วัน:</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      max={customUnit === 'hours' ? 24 : 1440}
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      placeholder={customUnit === 'hours' ? 'เช่น 2, 5.5' : 'เช่น 15, 45'}
                      className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <select
                      value={customUnit}
                      onChange={(e) =>
                        setCustomUnit(e.target.value as 'hours' | 'minutes')
                      }
                      className="bg-slate-950 border border-slate-700 rounded-lg text-[11px] text-cyan-300 font-bold px-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="hours">ชม.</option>
                      <option value="minutes">นาที</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">กี่วัน/เดือน:</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max={currentStayDays}
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      placeholder={currentStayDays.toString()}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500 text-center"
                    />
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">วัน</span>
                  </div>
                </div>
              </div>

              {/* Energy Calculation Preview */}
              {customName && customWatts && customDuration && (
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-[10px] flex items-center justify-between text-slate-300">
                  <span>
                    💡 คำนวณพลังงาน: {customWatts}W × {customDuration}{' '}
                    {customUnit === 'hours' ? 'ชม.' : 'นาที'} × {customDays} วัน / 1,000
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    ~
                    {(
                      (parseFloat(customWatts || '0') *
                        (customUnit === 'hours'
                          ? parseFloat(customDuration || '0')
                          : parseFloat(customDuration || '0') / 60) *
                        parseFloat(customDays || '30')) /
                      1000
                    ).toFixed(1)}{' '}
                    kWh/เดือน
                  </span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCustomAppliance()}
                  className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>บันทึกอุปกรณ์</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
