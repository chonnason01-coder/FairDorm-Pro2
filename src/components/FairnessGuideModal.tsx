import React from 'react';
import { X, ShieldCheck, Zap, Thermometer, Flame } from 'lucide-react';

interface FairnessGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairnessGuideModal: React.FC<FairnessGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                หลักการคำนวณ FairDorm Pro
              </h3>
              <p className="text-[11px] text-slate-400">
                ระบบหารค่าไฟหอตามการใช้งานจริง (25 : 75)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่างคำอธิบาย"
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              1. ค่าไฟกองกลาง 25% (หารเท่ากันทุกคน)
            </h4>
            <p className="text-slate-400 text-[11px]">
              คือเครื่องใช้ไฟฟ้าส่วนรวมที่ทุกคนได้ประโยชน์ร่วมกัน 24 ชม. เช่น ตู้เย็น, หลอดไฟห้อง, พัดลมระบายอากาศ, เราเตอร์ Wi-Fi และเครื่องทำน้ำอุ่น
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <h4 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              2. ค่าแอร์ตามจริง 75% (ถ่วงน้ำหนัก ชม. + อุณหภูมิ)
            </h4>
            <p className="text-slate-400 text-[11px]">
              แอร์กินไฟสูงสุดในห้อง (65-75% ของบิล) การเปิดแอร์ 18°C-22°C คอมเพรสเซอร์ทำงานหนักกว่า 25°C ถึง 20-25% ระบบจึงนำอุณหภูมิมาถ่วงน้ำหนักร่วมกับชั่วโมงใช้งานจริง
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              3. เครื่องใช้ไฟฟ้ากินไฟเฉพาะบุคคล (+วัตต์)
            </h4>
            <p className="text-slate-400 text-[11px]">
              คอมพิวเตอร์เกมมิ่ง (250W), หม้อชาบู/กระทะไฟฟ้า (1,200W) และไดร์เป่าผม (1,800W) จะถูกนำมาคิดสัดส่วนเพิ่มให้เพื่อนร่วมห้องที่ไม่ได้ใช้ไม่ต้องรับภาระ
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition-all"
        >
          เข้าใจแล้ว เริ่มใช้งานเลย 🚀
        </button>
      </div>
    </div>
  );
};
