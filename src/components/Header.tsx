import React from 'react';
import { Sparkles, Info, RotateCcw, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset: () => void;
  roomNumber: string;
  setRoomNumber: (room: string) => void;
  billMonth: string;
  setBillMonth: (month: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onReset,
  roomNumber,
  setRoomNumber,
  billMonth,
  setBillMonth,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Zap className="w-5 h-5 fill-white/90 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                FairDorm
              </span>
              <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                30:70 Fair Split
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5">
              หารค่าไฟหอตามชั่วโมงแอร์จริง ไม่หารเท่า
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenGuide}
            title="ทำไมต้อง 30:70 ?"
            aria-label="กติกาการคำนวณ 30:70"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            title="รีเซ็ตค่าเริ่มต้น"
            aria-label="รีเซ็ตค่าเริ่มต้น"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Room & Month Quick Inputs */}
      <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium">ห้อง:</span>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="เช่น 402"
            className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium">บิลรอบ:</span>
          <input
            type="text"
            value={billMonth}
            onChange={(e) => setBillMonth(e.target.value)}
            placeholder="เช่น ก.ย. 69"
            className="w-28 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
          />
        </div>
      </div>
    </header>
  );
};
