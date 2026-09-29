import React, { useState } from 'react';
import { Zap, RotateCcw, Info, Download, Volume2, VolumeX } from 'lucide-react';
import { generateSingleFileHTML } from '../utils/singleFileGenerator';
import { sounds } from '../utils/soundEffects';

interface HeaderProProps {
  onOpenGuide: () => void;
  onReset: () => void;
  roomNumber: string;
  setRoomNumber: (v: string) => void;
  billMonth: string;
  setBillMonth: (v: string) => void;
  onShowToast: (msg: string) => void;
}

export const HeaderPro: React.FC<HeaderProProps> = ({
  onOpenGuide,
  onReset,
  roomNumber,
  setRoomNumber,
  billMonth,
  setBillMonth,
  onShowToast,
}) => {
  const [soundOn, setSoundOn] = useState(sounds.isEnabled());

  const handleToggleSound = () => {
    const nextState = sounds.toggleSound();
    setSoundOn(nextState);
    onShowToast(nextState ? 'เปิดเสียงเอฟเฟกต์แล้ว 🔊' : 'ปิดเสียงเอฟเฟกต์ 🔇');
  };

  const handleDownloadSingleFile = () => {
    sounds.playClick(900);
    try {
      const htmlContent = generateSingleFileHTML();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fairdorm-pro-singlefile.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('ดาวน์โหลดโค้ด Single-File HTML สำหรับส่งงานสำเร็จ! 📁');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => sounds.playCalculateChime()}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform cursor-pointer"
            title="FairDorm Pro"
          >
            <Zap className="w-5 h-5 fill-slate-950 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-sans">
                FairDorm Pro
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                Interactive Multi-Mate
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              หารค่าไฟหอตามใช้จริง 25:75 ไม่หารเท่า
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
            aria-label={soundOn ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
              soundOn
                ? 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Download standalone single-file for university assignment */}
          <button
            onClick={handleDownloadSingleFile}
            title="ดาวน์โหลดไฟล์เดี่ยว Single-File HTML"
            aria-label="ดาวน์โหลดไฟล์เดี่ยว Single-File HTML"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all active:scale-90"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick(600);
              onOpenGuide();
            }}
            title="คู่มือและสูตรคำนวณ"
            aria-label="คู่มือและสูตรคำนวณ"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick(500);
              onReset();
            }}
            title="รีเซ็ตค่าเริ่มต้น"
            aria-label="รีเซ็ตค่าเริ่มต้น"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Room & Month metadata */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">ห้อง:</span>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="เช่น 402"
            className="w-16 px-2 py-0.5 bg-slate-800/80 border border-slate-700 rounded text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">รอบบิล:</span>
          <input
            type="text"
            value={billMonth}
            onChange={(e) => setBillMonth(e.target.value)}
            placeholder="เช่น ก.ย. 69"
            className="w-24 px-2 py-0.5 bg-slate-800/80 border border-slate-700 rounded text-slate-200 font-medium focus:outline-none focus:border-emerald-500 text-right"
          />
        </div>
      </div>
    </header>
  );
};
