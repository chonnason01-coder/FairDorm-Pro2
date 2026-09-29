import React, { useState } from 'react';
import { Receipt, Wind, Check, Zap, Gauge, ArrowRightLeft } from 'lucide-react';
import { BTUOption } from '../types';
import { BTU_OPTIONS, formatBaht } from '../utils/calculator';
import { sounds } from '../utils/soundEffects';

interface GlobalConfigCardProps {
  totalBill: number;
  setTotalBill: (val: number) => void;
  unitRate?: number;
  setUnitRate?: (rate: number) => void;
  selectedBTU: BTUOption;
  setSelectedBTU: (btu: BTUOption) => void;
}

const PRESET_BILLS = [1800, 2400, 3200, 4000];
const PRESET_RATES = [5, 7, 8, 10];

export const GlobalConfigCard: React.FC<GlobalConfigCardProps> = ({
  totalBill,
  setTotalBill,
  unitRate = 8,
  setUnitRate,
  selectedBTU,
  setSelectedBTU,
}) => {
  // Input mode: 'bill' (enter total baht) or 'units' (enter total units or meter start/end)
  const [inputMode, setInputMode] = useState<'bill' | 'meter'>('bill');
  const [meterStart, setMeterStart] = useState<string>('');
  const [meterEnd, setMeterEnd] = useState<string>('');

  const safeUnitRate = unitRate || 8;
  const calculatedUnits =
    safeUnitRate > 0 ? Math.round((totalBill / safeUnitRate) * 10) / 10 : 0;
  const baseFee = Math.round(totalBill * 0.25);
  const variableFee = totalBill - baseFee;

  const handlePresetBillClick = (preset: number) => {
    sounds.playClick(650);
    setTotalBill(preset);
  };

  const handleRateClick = (rate: number) => {
    sounds.playClick(700);
    setUnitRate?.(rate);
  };

  const handleBTUClick = (option: BTUOption) => {
    sounds.playClick(850);
    setSelectedBTU(option);
  };

  const handleMeterChange = (startStr: string, endStr: string) => {
    const s = parseFloat(startStr) || 0;
    const e = parseFloat(endStr) || 0;
    if (e >= s && e > 0) {
      const units = e - s;
      const computedBill = Math.round(units * (unitRate || 8));
      setTotalBill(computedBill);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-sm backdrop-blur-sm">
      {/* 1. Unit Rate Setting (บาท/หน่วย) - User request for 5, 8, 10 etc. */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="unitRateInput"
            className="text-xs font-bold text-slate-300 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>อัตราค่าไฟหอพัก (บาท / หน่วย)</span>
          </label>
          <span className="text-[10px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
            {calculatedUnits} หน่วย ({totalBill > 0 ? `฿${formatBaht(totalBill)}` : '฿0'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center flex-1">
            <span className="absolute left-3 text-sm font-bold text-slate-400 font-mono">
              ฿
            </span>
            <input
              id="unitRateInput"
              type="number"
              min="1"
              max="30"
              step="0.5"
              value={unitRate || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setUnitRate?.(isNaN(val) ? 8 : val);
              }}
              placeholder="8"
              className="w-full pl-8 pr-16 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-base font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent tabular-nums"
            />
            <span className="absolute right-3 text-xs font-medium text-slate-400">
              บาท/หน่วย
            </span>
          </div>

          {/* Quick Rate Preset Chips */}
          <div className="flex items-center gap-1">
            {PRESET_RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateClick(rate)}
                className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all active:scale-90 border ${
                  unitRate === rate
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs shadow-amber-500/20'
                    : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {rate}฿
              </button>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          💡 หอพักแต่ละที่คิดค่าไฟไม่เท่ากัน (บางหอ 5฿, บางหอ 7฿, 8฿ หรือ 10฿/หน่วย)
        </p>
      </div>

      {/* 2. Total Bill / Meter Calculation Mode Toggle */}
      <div className="pt-2 border-t border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span>ยอดรวมค่าไฟห้องเดือนนี้</span>
          </div>

          {/* Switch Mode Tab */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700 text-[10px]">
            <button
              type="button"
              onClick={() => {
                sounds.playClick(600);
                setInputMode('bill');
              }}
              className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                inputMode === 'bill'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              กรอกยอดเงิน (฿)
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick(600);
                setInputMode('meter');
              }}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-0.5 ${
                inputMode === 'meter'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-2.5 h-2.5" />
              <span>เลขมิเตอร์ (หน่วย)</span>
            </button>
          </div>
        </div>

        {inputMode === 'bill' ? (
          <div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-lg font-bold text-slate-500">
                ฿
              </span>
              <input
                id="totalBillInput"
                type="number"
                min="0"
                step="50"
                value={totalBill === 0 ? '' : totalBill}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTotalBill(isNaN(val) ? 0 : val);
                }}
                placeholder="2400"
                className="w-full pl-9 pr-14 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xl font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent tabular-nums transition-all"
              />
              <span className="absolute right-3.5 text-xs font-bold text-slate-400">
                บาท
              </span>
            </div>

            {/* Quick Amount presets */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 no-scrollbar">
              <span className="text-[11px] text-slate-400 shrink-0">ลัด:</span>
              {PRESET_BILLS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetBillClick(preset)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all active:scale-90 shrink-0 ${
                    totalBill === preset
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs shadow-emerald-500/20 ring-1 ring-emerald-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  ฿{formatBaht(preset)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/80 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  เลขมิเตอร์ครั้งก่อน (ต้นเดือน):
                </label>
                <input
                  type="number"
                  value={meterStart}
                  onChange={(e) => {
                    setMeterStart(e.target.value);
                    handleMeterChange(e.target.value, meterEnd);
                  }}
                  placeholder="เช่น 1200"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  เลขมิเตอร์ครั้งนี้ (ปลายเดือน):
                </label>
                <input
                  type="number"
                  value={meterEnd}
                  onChange={(e) => {
                    setMeterEnd(e.target.value);
                    handleMeterChange(meterStart, e.target.value);
                  }}
                  placeholder="เช่น 1500"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
              <span className="text-slate-400">
                รวมหน่วยที่ใช้:{' '}
                <strong className="text-cyan-400 font-mono">
                  {meterEnd && meterStart && parseFloat(meterEnd) >= parseFloat(meterStart)
                    ? parseFloat(meterEnd) - parseFloat(meterStart)
                    : calculatedUnits}{' '}
                  หน่วย
                </strong>
              </span>
              <span className="text-white font-black font-mono">
                = ฿{formatBaht(totalBill)} บาท (@ ฿{unitRate}/หน่วย)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. BTU Selector */}
      <div className="pt-2 border-t border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            ขนาดแอร์ประจำห้อง (BTU)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {selectedBTU.watts}W (x{selectedBTU.multiplier})
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {BTU_OPTIONS.map((option) => {
            const isSelected = selectedBTU.btu === option.btu;
            return (
              <button
                key={option.btu}
                type="button"
                onClick={() => handleBTUClick(option)}
                className={`relative p-2.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 shadow-xs shadow-emerald-500/10'
                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    ~{option.watts} วัตต์
                  </p>
                </div>
                <div className="mt-1 text-[9px] text-slate-400 truncate">
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 25:75 Visual Proportion Pill */}
      <div className="bg-slate-900/90 rounded-xl p-2.5 flex items-center justify-between text-[11px] border border-slate-700/60">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>
            กองกลาง <strong>25%</strong> (฿{formatBaht(baseFee)})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>
            ตามใช้จริง <strong>75%</strong> (฿{formatBaht(variableFee)})
          </span>
        </div>
      </div>
    </div>
  );
};
