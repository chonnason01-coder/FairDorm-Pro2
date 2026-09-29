/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FileText, SlidersHorizontal, Sparkles, RefreshCw, Calculator, AlertCircle, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BTUOption, Roommate, CalculationResult } from './types';
import { BTU_OPTIONS, ROOMMATE_COLOR_PALETTES, calculateFairDormBill } from './utils/calculator';
import { HeaderPro } from './components/HeaderPro';
import { GlobalConfigCard } from './components/GlobalConfigCard';
import { DynamicRoommateSection } from './components/DynamicRoommateSection';
import { LiveFairShareBar } from './components/LiveFairShareBar';
import { ReceiptStampModal } from './components/ReceiptStampModal';
import { FairnessGuideModal } from './components/FairnessGuideModal';
import { Toast } from './components/Toast';
import { sounds } from './utils/soundEffects';

export default function App() {
  // 1. Global Room State
  const [totalBill, setTotalBill] = useState<number>(2400);
  const [unitRate, setUnitRate] = useState<number>(8);
  const [selectedBTU, setSelectedBTU] = useState<BTUOption>(BTU_OPTIONS[1]); // 12,000 BTU
  const [roomNumber, setRoomNumber] = useState<string>('402');
  const [billMonth, setBillMonth] = useState<string>('ก.ย. 69');

  // 2. Dynamic Roommates State (Default 2, scalable up to 20+)
  const [roommates, setRoommates] = useState<Roommate[]>([
    {
      id: 'm1',
      name: 'ฉัน (เมท 1)',
      colorName: 'emerald',
      hex: '#10b981',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-500',
      textClass: 'text-emerald-400',
      ringClass: 'ring-emerald-500',
      hours: 10,
      temperature: 23,
      acDays: 30, // เปิดแอร์ 30 วัน/เดือน
      stayDays: 30,
      appliances: {
        gaming_pc: true,
        cooking_pot: false,
        hair_dryer: false,
        iron: false,
      },
      applianceDurations: {
        gaming_pc: 360, // 6 ชม./วัน
        cooking_pot: 30, // 30 นาที/วัน
        hair_dryer: 15, // 15 นาที/วัน
        iron: 15, // 15 นาที/วัน
      },
      applianceDays: {
        gaming_pc: 25, // เล่นเกม 25 วัน/เดือน
        cooking_pot: 4,
        hair_dryer: 15,
        iron: 4,
      },
      customAppliances: [],
    },
    {
      id: 'm2',
      name: 'เมท 2',
      colorName: 'cyan',
      hex: '#06b6d4',
      bgClass: 'bg-cyan-500',
      borderClass: 'border-cyan-500',
      textClass: 'text-cyan-400',
      ringClass: 'ring-cyan-500',
      hours: 4,
      temperature: 25,
      acDays: 20, // เปิดแอร์แค่ 20 วัน/เดือน
      stayDays: 30,
      appliances: {
        gaming_pc: false,
        cooking_pot: true,
        hair_dryer: false,
        iron: false,
      },
      applianceDurations: {
        gaming_pc: 360,
        cooking_pot: 30,
        hair_dryer: 15,
        iron: 15,
      },
      applianceDays: {
        gaming_pc: 20,
        cooking_pot: 6, // ต้มชาบู 6 วัน/เดือน
        hair_dryer: 15,
        iron: 4,
      },
      customAppliances: [],
    },
  ]);

  // 3. Calculation & Workflow State (Require calculate before generating receipt)
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isStale, setIsStale] = useState<boolean>(false);
  const isFirstRender = useRef(true);

  // Modals & Notifications
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2800);
  };

  // 4. Real-time Calculation Data
  const liveResult: CalculationResult = useMemo(() => {
    return calculateFairDormBill(totalBill, roommates, selectedBTU, unitRate);
  }, [totalBill, roommates, selectedBTU, unitRate]);

  // When user edits inputs after having calculated, mark as stale to encourage recalculation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (hasCalculated) {
      setIsStale(true);
    }
  }, [totalBill, unitRate, selectedBTU, roommates]);

  // Calculation Action with High-Fidelity Microinteractions
  const handleCalculateBill = (e?: React.MouseEvent) => {
    // 1. Play festive harmonic chime
    sounds.playCalculateChime();

    // 2. Confetti particle burst from button origin
    try {
      if (e) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x, y },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#fbbf24', '#f43f5e'],
        });
      } else {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#fbbf24', '#f43f5e'],
        });
      }
    } catch (err) {}

    // 3. Trigger calculating animation wave
    setIsCalculating(true);

    setTimeout(() => {
      setHasCalculated(true);
      setIsStale(false);
      setIsCalculating(false);
      sounds.playSuccessChime();
      showToast('✨ คำนวณค่าไฟตามสูตร 25:75 สำเร็จ! ปลดล็อกใบเสร็จแล้ว');

      // Scroll smoothly to results card
      const elem = document.getElementById('live-analysis-card');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 400);
  };

  // Handlers for Roommate List
  const handleAddRoommate = () => {
    if (roommates.length >= 20) {
      showToast('เพิ่มรูมเมทได้สูงสุด 20 คนครับ');
      return;
    }
    const nextIdx = roommates.length;
    const palette = ROOMMATE_COLOR_PALETTES[nextIdx % ROOMMATE_COLOR_PALETTES.length];
    const newMate: Roommate = {
      id: `mate_${Date.now()}`,
      name: `เมท ${nextIdx + 1}`,
      colorName: palette.colorName,
      hex: palette.hex,
      bgClass: palette.bgClass,
      borderClass: palette.borderClass,
      textClass: palette.textClass,
      ringClass: palette.ringClass,
      hours: 6,
      temperature: 25,
      acDays: 30,
      stayDays: 30,
      appliances: {
        gaming_pc: false,
        cooking_pot: false,
        hair_dryer: false,
        iron: false,
      },
      applianceDurations: {
        gaming_pc: 360,
        cooking_pot: 30,
        hair_dryer: 15,
        iron: 15,
      },
      applianceDays: {
        gaming_pc: 20,
        cooking_pot: 4,
        hair_dryer: 15,
        iron: 4,
      },
      customAppliances: [],
    };
    sounds.playSuccessChime();
    setRoommates([...roommates, newMate]);
    showToast(`เพิ่มรูมเมท ${newMate.name} สำเร็จ! (${roommates.length + 1} คน) 👤`);
  };

  const handleRemoveRoommate = (id: string) => {
    if (roommates.length <= 2) {
      showToast('ต้องมีรูมเมทอย่างน้อย 2 คน');
      return;
    }
    sounds.playClick(400);
    setRoommates(roommates.filter((m) => m.id !== id));
    showToast('ลบรูมเมทออกจากรายการเรียบร้อย');
  };

  const handleUpdateRoommate = (updated: Roommate) => {
    setRoommates(roommates.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleSetRoommateCount = (targetCount: number) => {
    const validCount = Math.max(2, Math.min(20, targetCount));
    if (validCount === roommates.length) return;

    sounds.playClick(750);
    if (validCount > roommates.length) {
      const added: Roommate[] = [];
      for (let i = roommates.length; i < validCount; i++) {
        const palette = ROOMMATE_COLOR_PALETTES[i % ROOMMATE_COLOR_PALETTES.length];
        added.push({
          id: `mate_${Date.now()}_${i}`,
          name: `เมท ${i + 1}`,
          colorName: palette.colorName,
          hex: palette.hex,
          bgClass: palette.bgClass,
          borderClass: palette.borderClass,
          textClass: palette.textClass,
          ringClass: palette.ringClass,
          hours: 6,
          temperature: 25,
          acDays: 30,
          stayDays: 30,
          appliances: {
            gaming_pc: false,
            cooking_pot: false,
            hair_dryer: false,
            iron: false,
          },
          applianceDurations: {
            gaming_pc: 360,
            cooking_pot: 30,
            hair_dryer: 15,
            iron: 15,
          },
          applianceDays: {
            gaming_pc: 20,
            cooking_pot: 4,
            hair_dryer: 15,
            iron: 4,
          },
          customAppliances: [],
        });
      }
      setRoommates([...roommates, ...added]);
      showToast(`ปรับจำนวนเป็น ${validCount} คนเรียบร้อย 👥`);
    } else {
      setRoommates(roommates.slice(0, validCount));
      showToast(`ปรับจำนวนเป็น ${validCount} คนเรียบร้อย 👥`);
    }
  };

  // Reset to initial baseline
  const handleReset = () => {
    sounds.playClick(500);
    setTotalBill(2400);
    setUnitRate(8);
    setSelectedBTU(BTU_OPTIONS[1]);
    setRoomNumber('402');
    setBillMonth('ก.ย. 69');
    setHasCalculated(false);
    setIsStale(false);
    setRoommates([
      {
        id: 'm1',
        name: 'ฉัน (เมท 1)',
        colorName: 'emerald',
        hex: '#10b981',
        bgClass: 'bg-emerald-500',
        borderClass: 'border-emerald-500',
        textClass: 'text-emerald-400',
        ringClass: 'ring-emerald-500',
        hours: 10,
        temperature: 23,
        acDays: 30,
        stayDays: 30,
        appliances: {
          gaming_pc: true,
          cooking_pot: false,
          hair_dryer: false,
          iron: false,
        },
        applianceDurations: {
          gaming_pc: 360,
          cooking_pot: 30,
          hair_dryer: 15,
          iron: 15,
        },
        applianceDays: {
          gaming_pc: 25,
          cooking_pot: 4,
          hair_dryer: 15,
          iron: 4,
        },
        customAppliances: [],
      },
      {
        id: 'm2',
        name: 'เมท 2',
        colorName: 'cyan',
        hex: '#06b6d4',
        bgClass: 'bg-cyan-500',
        borderClass: 'border-cyan-500',
        textClass: 'text-cyan-400',
        ringClass: 'ring-cyan-500',
        hours: 4,
        temperature: 25,
        acDays: 20,
        stayDays: 30,
        appliances: {
          gaming_pc: false,
          cooking_pot: true,
          hair_dryer: false,
          iron: false,
        },
        applianceDurations: {
          gaming_pc: 360,
          cooking_pot: 30,
          hair_dryer: 15,
          iron: 15,
        },
        applianceDays: {
          gaming_pc: 20,
          cooking_pot: 6,
          hair_dryer: 15,
          iron: 4,
        },
        customAppliances: [],
      },
    ]);
    showToast('รีเซ็ตการตั้งค่าเรียบร้อย 🔄');
  };

  // Quick Classroom Demo Scenarios
  const applyPresetScenario = (scenario: 'heavy_gamer' | 'party_cook' | 'all_eco') => {
    sounds.playSuccessChime();
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.3 } });
    } catch (e) {}

    if (scenario === 'heavy_gamer') {
      setRoommates((prev) => [
        {
          ...prev[0],
          name: 'ฉัน (เกมเมอร์)',
          hours: 14,
          temperature: 20,
          acDays: 30,
          stayDays: 30,
          appliances: { gaming_pc: true, cooking_pot: false, hair_dryer: false, iron: false },
          applianceDurations: { gaming_pc: 480, cooking_pot: 30, hair_dryer: 15, iron: 15 },
          applianceDays: { gaming_pc: 28, cooking_pot: 4, hair_dryer: 15, iron: 4 },
          customAppliances: [],
        },
        {
          ...prev[1],
          name: 'เมท 2 (แค่นอน)',
          hours: 4,
          temperature: 25,
          acDays: 15,
          stayDays: 30,
          appliances: { gaming_pc: false, cooking_pot: false, hair_dryer: false, iron: false },
          applianceDurations: { gaming_pc: 360, cooking_pot: 30, hair_dryer: 15, iron: 15 },
          applianceDays: { gaming_pc: 20, cooking_pot: 4, hair_dryer: 15, iron: 4 },
          customAppliances: [],
        },
        ...(prev.slice(2)),
      ]);
      showToast('จำลอง: เมทเกมเมอร์ 14h (30ว.) vs เมทนอน 4h (15ว.) 🎮');
    } else if (scenario === 'party_cook') {
      setRoommates((prev) => [
        {
          ...prev[0],
          name: 'ฉัน (สายชิล)',
          hours: 6,
          temperature: 25,
          acDays: 20,
          stayDays: 30,
          appliances: { gaming_pc: false, cooking_pot: false, hair_dryer: true, iron: false },
          applianceDurations: { gaming_pc: 360, cooking_pot: 30, hair_dryer: 15, iron: 15 },
          applianceDays: { gaming_pc: 20, cooking_pot: 4, hair_dryer: 15, iron: 4 },
          customAppliances: [],
        },
        {
          ...prev[1],
          name: 'เมท 2 (ตี้ชาบู)',
          hours: 10,
          temperature: 22,
          acDays: 25,
          stayDays: 30,
          appliances: { gaming_pc: false, cooking_pot: true, hair_dryer: false, iron: false },
          applianceDurations: { gaming_pc: 360, cooking_pot: 60, hair_dryer: 15, iron: 15 },
          applianceDays: { gaming_pc: 20, cooking_pot: 8, hair_dryer: 15, iron: 4 },
          customAppliances: [],
        },
        ...(prev.slice(2)),
      ]);
      showToast('จำลอง: ตี้ชาบู 8 วัน/ด. + แอร์ 22°C 25 วัน 🍳');
    } else {
      setRoommates((prev) =>
        prev.map((m) => ({
          ...m,
          hours: 8,
          temperature: 26,
          acDays: 22,
          stayDays: 30,
          appliances: { gaming_pc: false, cooking_pot: false, hair_dryer: false, iron: false },
          applianceDurations: { gaming_pc: 360, cooking_pot: 30, hair_dryer: 15, iron: 15 },
          applianceDays: { gaming_pc: 20, cooking_pot: 4, hair_dryer: 15, iron: 4 },
          customAppliances: [],
        }))
      );
      showToast('จำลอง: เปิดเท่ากัน 8 ชม. Eco-Mode 26°C 22 วัน 🌱');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-0 sm:py-6 px-0 sm:px-4">
      {/* Mobile Frame Container: max-w-md centered, clean Slate-900 Modern Dorm theme */}
      <main className="w-full max-w-md bg-slate-900 min-h-screen sm:min-h-[850px] sm:max-h-[94vh] sm:rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <HeaderPro
          onOpenGuide={() => setIsGuideOpen(true)}
          onReset={handleReset}
          roomNumber={roomNumber}
          setRoomNumber={setRoomNumber}
          billMonth={billMonth}
          setBillMonth={setBillMonth}
          onShowToast={showToast}
        />

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
          {/* Section 1: Global Room Config */}
          <section aria-labelledby="global-config-heading">
            <h2 id="global-config-heading" className="sr-only">
              ตั้งค่ายอดบิลและขนาดแอร์
            </h2>
            <GlobalConfigCard
              totalBill={totalBill}
              setTotalBill={setTotalBill}
              unitRate={unitRate}
              setUnitRate={setUnitRate}
              selectedBTU={selectedBTU}
              setSelectedBTU={setSelectedBTU}
            />
          </section>

          {/* Quick Demo Scenarios (Useful for classroom demo & testing) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            <span className="text-[11px] text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
              จำลอง:
            </span>
            <button
              type="button"
              onClick={() => applyPresetScenario('heavy_gamer')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500 transition-all shrink-0 text-[11px] active:scale-90 cursor-pointer"
            >
              🎮 เมทเกมเมอร์ 14h vs แค่นอน
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('party_cook')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500 transition-all shrink-0 text-[11px] active:scale-90 cursor-pointer"
            >
              🍳 ตี้ชาบูกระทะไฟฟ้า
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('all_eco')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 transition-all shrink-0 text-[11px] active:scale-90 cursor-pointer"
            >
              🌱 สายประหยัด Eco 26°C
            </button>
          </div>

          {/* Section 2: Dynamic Roommates Section */}
          <section aria-labelledby="roommates-heading">
            <DynamicRoommateSection
              roommates={roommates}
              shares={liveResult.roommates}
              hasCalculated={hasCalculated}
              isStale={isStale}
              onAddRoommate={handleAddRoommate}
              onRemoveRoommate={handleRemoveRoommate}
              onUpdateRoommate={handleUpdateRoommate}
              onSetRoommateCount={handleSetRoommateCount}
            />
          </section>

          {/* Dedicated Calculate Action Card before results */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-inner">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>คำนวณบิลค่าไฟ (25:75)</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {hasCalculated
                  ? isStale
                    ? '⚠️ ข้อมูลเปลี่ยน กดคำนวณใหม่เพื่ออัปเดต'
                    : '✓ สัดส่วนอัปเดตเรียบร้อย พร้อมออกใบเสร็จ'
                  : 'กดคำนวณเพื่อสรุปยอดก่อนออกใบเสร็จ'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCalculateBill}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md ${
                !hasCalculated
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 ring-2 ring-emerald-400/40 animate-pulse'
                  : isStale
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hasCalculated ? (isStale ? 'คำนวณใหม่' : 'คำนวณซ้ำ') : 'กดคำนวณ'}</span>
            </button>
          </div>

          {/* Section 3: Live Fair Share Bar & Analytics */}
          <section aria-labelledby="live-analysis-heading">
            <h2 id="live-analysis-heading" className="sr-only">
              วิเคราะห์และแบ่งสัดส่วนสด
            </h2>
            <LiveFairShareBar
              result={liveResult}
              hasCalculated={hasCalculated}
              isCalculating={isCalculating}
              isStale={isStale}
              onCalculate={handleCalculateBill}
            />
          </section>
        </div>

        {/* Pinned Bottom Floating CTA Bar (Workflow: Calculate First -> Then Generate Slip) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-20 space-y-2">
          {/* Stale Warning Indicator if inputs modified */}
          {hasCalculated && isStale && (
            <div className="flex items-center justify-between bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl text-[11px] text-amber-300 animate-in fade-in">
              <span className="flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>มีการเปลี่ยนข้อมูลใหม่</span>
              </span>
              <button
                type="button"
                onClick={handleCalculateBill}
                className="font-bold underline text-amber-200 hover:text-white cursor-pointer active:scale-95"
              >
                กดคำนวณใหม่ ⚡
              </button>
            </div>
          )}

          {!hasCalculated ? (
            /* Step 1: Must click Calculate First */
            <button
              type="button"
              onClick={handleCalculateBill}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              <Sparkles className="w-4 h-4 stroke-[2.5] text-slate-950 animate-spin duration-3000" />
              <span>⚡ ขั้นตอนที่ 1: กดคำนวณค่าไฟ (Calculate Fair Bill)</span>
            </button>
          ) : (
            /* Step 2: Unlocked Generate Slip + Recalculate options */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCalculateBill}
                title="คำนวณใหม่"
                className={`h-12 px-3.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-90 cursor-pointer ${
                  isStale
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-750'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isStale ? 'animate-spin duration-3000' : ''}`} />
                <span className="hidden xs:inline">คำนวณใหม่</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playReceiptWhoosh();
                  setIsReceiptOpen(true);
                }}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 stroke-[2.5]" />
                <span>📄 ออกใบเสร็จคิดเงินเมท (Generate Slip)</span>
              </button>
            </div>
          )}
        </div>

        {/* Digital Thermal Paper Receipt & 3D Stamp Modal */}
        <ReceiptStampModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          result={liveResult}
          roomNumber={roomNumber}
          billMonth={billMonth}
          onShowToast={showToast}
        />

        {/* Fairness 25:75 Principle Guide Modal */}
        <FairnessGuideModal
          isOpen={isGuideOpen}
          onClose={() => {
            sounds.playClick(500);
            setIsGuideOpen(false);
          }}
        />

        {/* Real-time Toast Feedback */}
        <Toast show={toast.show} message={toast.message} />
      </main>
    </div>
  );
}
