import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { formatBaht } from '../utils/calculator';
import {
  TrendingDown,
  TrendingUp,
  Equal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calculator,
  AlertCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { AnimatedCounter } from './AnimatedCounter';

interface LiveFairShareBarProps {
  result: CalculationResult | null;
  hasCalculated?: boolean;
  isCalculating?: boolean;
  isStale?: boolean;
  onCalculate?: (e?: React.MouseEvent) => void;
}

export const LiveFairShareBar: React.FC<LiveFairShareBarProps> = ({
  result,
  hasCalculated = false,
  isCalculating = false,
  isStale = false,
  onCalculate,
}) => {
  const [showFormula, setShowFormula] = useState(false);

  // If result is null
  if (!result) {
    return null;
  }

  // If user hasn't pressed calculate yet: Show the engaging Teaser / Calculate Prompt Card
  if (!hasCalculated) {
    return (
      <div
        id="live-analysis-card"
        className="bg-slate-800/80 border-2 border-dashed border-emerald-500/40 rounded-2xl p-5 text-center space-y-4 backdrop-blur-sm shadow-xl shadow-emerald-950/20 relative overflow-hidden"
      >
        {/* Ambient glow behind card */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
          <Calculator className="w-7 h-7 stroke-[2.2] animate-bounce duration-1000" />
        </div>

        <div className="space-y-1 relative z-10">
          <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5">
            <span>⚡ สรุปยอดและแบ่งสัดส่วนค่าไฟ</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            ระบบจะคำนวณแยกกองกลาง 25% (หารเท่า) และค่าแอร์+เครื่องใช้ไฟฟ้า 75% ตามชั่วโมงและวันที่อยู่จริง
          </p>
        </div>

        {onCalculate && (
          <div className="pt-1 relative z-10">
            <button
              type="button"
              onClick={onCalculate}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>กดคำนวณค่าไฟเลย (Calculate Fair Bill)</span>
            </button>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              💡 หลังกดคำนวณแล้ว จะสามารถออกใบเสร็จส่งลงกลุ่ม LINE ได้ทันที
            </p>
          </div>
        )}
      </div>
    );
  }

  const { roommates, totalBill, equalSharePerPerson, baseCommonFee, variableCost } = result;

  return (
    <div
      id="live-analysis-card"
      className={`bg-slate-800/80 border rounded-2xl p-4 space-y-3.5 shadow-sm backdrop-blur-xs transition-all duration-300 ${
        isCalculating
          ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-[1.01] bg-slate-800'
          : isStale
          ? 'border-amber-500/60 ring-1 ring-amber-500/30'
          : 'border-slate-700/80'
      }`}
    >
      {/* Stale Data Warning Banner */}
      {isStale && onCalculate && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs text-amber-300 animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span className="text-[11px] font-medium leading-tight">
              มีการแก้ไขข้อมูล — กดคำนวณใหม่เพื่ออัปเดตยอดล่าสุด
            </span>
          </div>
          <button
            type="button"
            onClick={onCalculate}
            className="px-2.5 py-1 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 border border-amber-500/40 text-amber-200 text-[10px] font-black shrink-0 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>คำนวณใหม่</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <span>📊 สัดส่วนค่าไฟที่ต้องจ่ายจริง</span>
          {isCalculating ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
              <Sparkles className="w-2.5 h-2.5" /> กำลังประมวลผล...
            </span>
          ) : isStale ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-full font-bold">
              รออัปเดต
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full font-bold">
              คำนวณแล้ว ✓
            </span>
          )}
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          หากหารเท่า: คนละ ฿{formatBaht(equalSharePerPerson)}
        </span>
      </div>

      {/* Dynamic Multi-segment Progress Bar with smooth microinteractions */}
      <div className="h-9 w-full bg-slate-900 rounded-xl overflow-hidden flex p-1 gap-1 border border-slate-700/80 shadow-inner">
        {roommates.map((m) => {
          return (
            <div
              key={m.id}
              title={`${m.name}: ${m.percentage}% (฿${formatBaht(m.totalShare)})`}
              style={{
                flex: `${Math.max(1.5, m.percentage)} 1 0%`,
                backgroundColor: m.hex,
                minWidth: '24px',
              }}
              className={`h-full rounded-md sm:rounded-lg transition-all duration-500 ease-out flex items-center justify-center sm:justify-between px-1 sm:px-2 text-slate-950 font-black text-xs overflow-hidden shadow-xs shrink-0 select-none ${
                isCalculating ? 'brightness-125 scale-y-105' : ''
              }`}
            >
              {roommates.length <= 5 || m.percentage >= 9 ? (
                <span className="truncate text-[10px] sm:text-[11px] max-w-[55px] hidden xs:inline sm:inline">
                  {m.name}
                </span>
              ) : null}
              <span className="text-[10px] font-mono tabular-nums shrink-0">
                {m.percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Roommates Individual Result Cards Grid with Animated Counter */}
      <div
        className={`grid gap-2.5 ${
          roommates.length === 2
            ? 'grid-cols-2'
            : roommates.length <= 4
            ? 'grid-cols-2 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        }`}
      >
        {roommates.map((m) => (
          <div
            key={m.id}
            onClick={() => sounds.playClick(600)}
            className={`bg-slate-900/90 border rounded-xl p-3 flex flex-col justify-between relative overflow-hidden transition-all duration-300 cursor-pointer active:scale-95 ${
              isCalculating
                ? 'border-emerald-500/80 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'border-slate-700/80 hover:border-slate-600'
            }`}
          >
            {/* Ambient accent glow */}
            <div
              className="absolute -top-6 -right-6 w-14 h-14 rounded-full opacity-15 pointer-events-none blur-lg"
              style={{ backgroundColor: m.hex }}
            />

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className="text-xs font-bold truncate"
                  style={{ color: m.hex }}
                >
                  {m.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  <AnimatedCounter value={m.percentage} decimals={1} suffix="%" />
                </span>
              </div>
              <div
                className={`text-xl font-black tabular-nums tracking-tight mt-0.5 transition-all ${
                  isCalculating ? 'text-emerald-300 scale-105 origin-left' : 'text-white'
                }`}
              >
                <AnimatedCounter value={m.totalShare} prefix="฿" duration={550} />
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                ~{m.totalDailyKWh} หน่วย/วัน ({m.stayDays} วัน • แอร์ {m.acDays}ว.)
              </div>
            </div>

            {/* Difference vs equal split */}
            <div className="mt-2 pt-1.5 border-t border-slate-800/80">
              {m.diffFromEqual < 0 ? (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <TrendingDown className="w-3 h-3 shrink-0 stroke-[2.5]" />
                  <span>ประหยัด ฿{formatBaht(Math.abs(m.diffFromEqual))}</span>
                </div>
              ) : m.diffFromEqual > 0 ? (
                <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                  <TrendingUp className="w-3 h-3 shrink-0 stroke-[2.5]" />
                  <span>จ่ายเพิ่ม ฿{formatBaht(m.diffFromEqual)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Equal className="w-3 h-3 shrink-0" />
                  <span>เท่ากับหารเฉลี่ย</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Formula Explanation */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            sounds.playClick(700);
            setShowFormula(!showFormula);
          }}
          className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 py-1 transition-colors cursor-pointer"
        >
          <span>ดูรายละเอียดแจงยอดค่าไฟ (25 : 75 Fair Share)</span>
          {showFormula ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showFormula && (
          <div className="mt-2 bg-slate-900/90 rounded-xl p-3 border border-slate-700/60 text-xs space-y-2 text-slate-300 animate-in fade-in duration-200">
            <div className="flex justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white">
                1. กองกลาง 25% (ตู้เย็น, หลอดไฟ, เราเตอร์):
              </span>
              <span className="font-mono text-emerald-400">
                ฿{formatBaht(baseCommonFee)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pl-2">
              • หารเท่า {roommates.length} คน: คนละ ฿
              {formatBaht(baseCommonFee / roommates.length)}
            </p>

            <div className="flex justify-between pt-1 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white">
                2. แอร์ & อุปกรณ์หนัก 75%:
              </span>
              <span className="font-mono text-cyan-400">
                ฿{formatBaht(variableCost)}
              </span>
            </div>
            <div className="space-y-1 pl-2 text-[11px] text-slate-400">
              {roommates.map((m) => (
                <div key={m.id} className="flex justify-between">
                  <span>
                    • {m.name} ({m.hours}h @ {m.temperature}°C
                    {m.activeAppliances.length > 0
                      ? ` +${m.activeAppliances.map((a) => a.emoji).join('')}`
                      : ''}
                    ):
                  </span>
                  <span className="font-mono font-bold text-white">
                    ฿{formatBaht(m.variableShare)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
