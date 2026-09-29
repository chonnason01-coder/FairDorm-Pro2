import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Copy,
  Camera,
  Share2,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { CalculationResult } from '../types';
import { formatBaht } from '../utils/calculator';
import { sounds } from '../utils/soundEffects';

interface ReceiptStampModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  roomNumber: string;
  billMonth: string;
  onShowToast: (msg: string) => void;
}

export const ReceiptStampModal: React.FC<ReceiptStampModalProps> = ({
  isOpen,
  onClose,
  result,
  roomNumber,
  billMonth,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [promptPayNumber, setPromptPayNumber] = useState('');
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [savedImageBlob, setSavedImageBlob] = useState<Blob | null>(null);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);
  const captureContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sounds.playReceiptWhoosh();
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'],
        });
      } catch (e) {}

      setShowStamp(false);
      const timer = setTimeout(() => {
        setShowStamp(true);
        sounds.playStampSlam();
      }, 180);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    totalBill,
    unitRate,
    totalUnits,
    roommates,
    baseCommonFee,
    variableCost,
    selectedBTU,
  } = result;

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // LINE formatted text with 30-day tracking and unit rates
  const lineSummaryText = `⚡ สรุปค่าไฟหอห้อง ${roomNumber || '402'} [${billMonth || 'เดือนนี้'}]
💰 ยอดรวมทั้งห้อง: ฿${formatBaht(totalBill)} บาท (ใช้ไป ~${totalUnits || 0} หน่วย @ ฿${unitRate || 8}/หน่วย)
-------------------------
${roommates
  .map(
    (m) =>
      `👤 ${m.name}: ฿${formatBaht(m.totalShare)} บาท (~${m.estimatedUnits} หน่วย • ${m.percentage}%)
  • อยู่หอ: ${m.stayDays} วัน/30 วัน
  • แอร์: ${m.hours} ชม./วัน (${m.acDays ?? m.stayDays} วัน/เดือน) @ ${m.temperature}°C${
        m.activeAppliances.length > 0
          ? `\n  • เครื่องใช้: ${m.activeAppliances
              .map(
                (a) =>
                  `${a.emoji}${a.name} (${a.watts}W • ${
                    a.durationMinutes >= 60
                      ? `${a.durationMinutes / 60}ชม.`
                      : `${a.durationMinutes}น.`
                  } • ${a.daysPerMonth}วัน/เดือน)`
              )
              .join(', ')}`
          : ''
      }`
  )
  .join('\n\n')}
-------------------------
${promptPayNumber.trim() ? `💳 โอนเข้าพร้อมเพย์/บัญชี: ${promptPayNumber.trim()}\n` : ''}💡 คำนวณยุติธรรมด้วย FairDorm Pro
(กองกลาง 25% หารเท่า ${roommates.length} คน + แอร์และเครื่องใช้ 75% คิดตาม kWh และวันที่อยู่จริง)`;

  const handleCopyLine = async () => {
    sounds.playClick(900);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(lineSummaryText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = lineSummaryText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      onShowToast('คัดลอกสรุปข้อความแล้ว! ส่งลง LINE ได้เลย 🎉');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Pure 2D Canvas Fallback Generator in case html2canvas ever encounters environment restrictions
  const renderFallbackCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 750;
    const headerHeight = 220;
    const rowHeight = 70;
    const roommatesHeight = roommates.length * rowHeight;
    const footerHeight = 200;
    canvas.height = headerHeight + roommatesHeight + footerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Background
    ctx.fillStyle = '#fffdf9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ FAIRDORM PRO ⚡', canvas.width / 2, 60);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('ใบแจ้งหนี้ค่าไฟรายบุคคลตามจริง (25 : 75 Fair Share)', canvas.width / 2, 95);

    ctx.font = '18px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(
      `ห้อง ${roomNumber || '402'} • รอบ ${billMonth || 'เดือนนี้'} • ${currentDate}`,
      canvas.width / 2,
      130
    );
    ctx.fillText(
      `แอร์: ${selectedBTU.label} (${selectedBTU.watts}W) • ค่าไฟหอ: ฿${unitRate}/หน่วย (~${totalUnits} หน่วย)`,
      canvas.width / 2,
      160
    );

    // Dashed divider
    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.moveTo(30, 185);
    ctx.lineTo(canvas.width - 30, 185);
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();
    ctx.setLineDash([]);

    // Total Bill Bar
    ctx.textAlign = 'left';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`ยอดรวมบิลห้อง: ฿${formatBaht(totalBill)} บาท`, 40, 220);

    ctx.textAlign = 'right';
    ctx.font = '17px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(
      `กองกลาง 25%: ฿${formatBaht(baseCommonFee)} | ตามจริง 75%: ฿${formatBaht(variableCost)}`,
      canvas.width - 40,
      220
    );

    // Roommate Rows
    let y = 260;
    roommates.forEach((m) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(30, y - 25, canvas.width - 60, 58);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(30, y - 25, canvas.width - 60, 58);

      // Color bullet
      ctx.fillStyle = m.hex || '#10b981';
      ctx.beginPath();
      ctx.arc(52, y + 4, 10, 0, Math.PI * 2);
      ctx.fill();

      // Name & days
      ctx.textAlign = 'left';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(m.name, 75, y);

      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(
        `อยู่ ${m.stayDays}/30วัน • แอร์ ${m.hours}h (${m.acDays ?? m.stayDays}วัน/ด.) @ ${m.temperature}°C${
          m.activeAppliances.length > 0
            ? ` • ${m.activeAppliances.map((a) => `${a.emoji}${a.name} ${a.watts}W(${a.daysPerMonth}ว)`).join(', ')}`
            : ''
        }`,
        75,
        y + 22
      );

      // Total Share
      ctx.textAlign = 'right';
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#047857';
      ctx.fillText(`฿${formatBaht(m.totalShare)}`, canvas.width - 45, y);

      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(
        `~${m.estimatedUnits} หน่วย (${m.percentage}%)`,
        canvas.width - 45,
        y + 22
      );

      y += rowHeight;
    });

    // Stamp in top right
    ctx.save();
    ctx.translate(canvas.width - 140, 75);
    ctx.rotate((10 * Math.PI) / 180);
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.85)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-90, -25, 180, 50);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FAIR-CERTIFIED', 0, -2);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('★ ยุติธรรม • ห้ามต่อยกัน ★', 0, 16);
    ctx.restore();

    // Footer
    y += 20;
    if (promptPayNumber.trim()) {
      ctx.fillStyle = '#ecfdf5';
      ctx.fillRect(30, y, canvas.width - 60, 40);
      ctx.strokeStyle = '#a7f3d0';
      ctx.strokeRect(30, y, canvas.width - 60, 40);
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💳 โอนเข้าพร้อมเพย์/บัญชี: ${promptPayNumber.trim()}`, canvas.width / 2, y + 26);
      y += 55;
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('คำนวณยุติธรรมด้วย FairDorm Pro • รักษาความสงบสุขและมิตรภาพของรูมเมท 🤝', canvas.width / 2, y + 30);

    return canvas;
  };

  const handleSaveImage = async () => {
    sounds.playClick(850);
    setIsSavingImage(true);

    try {
      let canvas: HTMLCanvasElement | null = null;
      const targetElement = captureContainerRef.current || receiptRef.current;

      if (targetElement) {
        try {
          canvas = await html2canvas(targetElement, {
            scale: 2,
            backgroundColor: '#fffdf9',
            useCORS: true,
            logging: false,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
          });
        } catch (captureErr) {
          console.warn('html2canvas encountered error, falling back to 2D canvas renderer:', captureErr);
          canvas = renderFallbackCanvas();
        }
      } else {
        canvas = renderFallbackCanvas();
      }

      if (!canvas) {
        canvas = renderFallbackCanvas();
      }

      // Convert to blob for rock-solid saving across all browsers & iframes
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            onShowToast('ไม่สามารถแปลงรูปภาพได้');
            setIsSavingImage(false);
            return;
          }

          setSavedImageBlob(blob);
          const url = URL.createObjectURL(blob);
          setSavedImageUrl(url);

          const fileName = `fairdorm-bill-room${roomNumber || '402'}-${Date.now()}.png`;

          // 1. Try automatic download via <a> tag
          let downloadTriggered = false;
          try {
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            downloadTriggered = true;
          } catch (e) {
            console.warn('Auto download blocked by browser/iframe policy:', e);
          }

          // 2. Open Preview & Action Modal so user can also view / copy / long-press save directly!
          setShowImagePreviewModal(true);
          onShowToast('สร้างรูปภาพสลิปค่าไฟสำเร็จ! 📸');
          setIsSavingImage(false);
        },
        'image/png',
        1.0
      );
    } catch (err) {
      console.error('Image capture failed completely:', err);
      // Even if complete failure, try fallback canvas
      const fallback = renderFallbackCanvas();
      fallback.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setSavedImageUrl(url);
          setSavedImageBlob(blob);
          setShowImagePreviewModal(true);
          onShowToast('สร้างรูปภาพสลิปค่าไฟสำเร็จ! 📸');
        }
      });
      setIsSavingImage(false);
    }
  };

  const handleShareImage = async () => {
    sounds.playClick(750);
    if (!savedImageBlob) return;

    try {
      const file = new File([savedImageBlob], `fairdorm-slip-room${roomNumber || '402'}.png`, {
        type: 'image/png',
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `บิลค่าไฟห้อง ${roomNumber || '402'}`,
          text: `สลิปค่าไฟห้อง ${roomNumber || '402'} คำนวณด้วย FairDorm Pro`,
        });
        onShowToast('แชร์รูปภาพสำเร็จ 🚀');
      } else {
        // Fallback: Copy image to clipboard
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': savedImageBlob }),
          ]);
          onShowToast('คัดลอกรูปภาพลง Clipboard แล้ว! นำไปวางในแชตได้เลย 📋');
        } else {
          onShowToast('แตะค้างที่รูปภาพด้านล่างเพื่อบันทึกลงเครื่องครับ');
        }
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
        {/* Background dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Grab Handle */}
          <div className="pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" />
          </div>

          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                🧾
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  ใบเสร็จสลิปค่าไฟหอพัก
                </h3>
                <p className="text-[10px] text-slate-400">
                  Fair-Certified พร้อมปั๊มตราประทับ
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick(400);
                onClose();
              }}
              aria-label="ปิดหน้าต่างสลิป"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Receipt Preview Area */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Thermal Paper Minimal Receipt */}
            <div
              ref={receiptRef}
              id="printable-receipt"
              style={{ backgroundColor: '#fffdf9' }}
              className="text-slate-900 p-5 sm:p-6 rounded-2xl relative shadow-xl font-mono-receipt border border-slate-300 overflow-hidden"
            >
              {/* 3D Certified Verification Stamp (Angle-offset in top right so it never blocks numbers or names) */}
              {showStamp && (
                <div
                  onClick={() => sounds.playStampSlam()}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-auto cursor-pointer rotate-[10deg] hover:rotate-[5deg] transition-all duration-200 active:scale-95 select-none"
                  title="คลิกเพื่อปั๊มซ้ำ"
                >
                  <div className="border-2 border-red-600 rounded-xl px-2.5 py-1 text-center text-red-600 font-black tracking-wider uppercase shadow-sm bg-red-100 select-none opacity-85 hover:opacity-100 transition-opacity">
                    <div className="text-[11px] sm:text-xs leading-tight font-black">
                      FAIR-CERTIFIED
                    </div>
                    <div className="text-[8px] tracking-normal font-bold text-red-700">
                      ★ ยุติธรรม • ห้ามต่อยกัน ★
                    </div>
                  </div>
                </div>
              )}

              {/* Receipt Header */}
              <div className="text-center pb-3 border-b-2 border-dashed border-slate-300">
                <div className="text-base font-black tracking-wider text-slate-950">
                  ⚡ FAIRDORM PRO ⚡
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  ใบแจ้งหนี้ค่าไฟรายบุคคลตามจริง (25 : 75 Fair Share)
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  ห้อง {roomNumber || '402'} • รอบ {billMonth || 'เดือนนี้'} • {currentDate}
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  แอร์: {selectedBTU.label} ({selectedBTU.watts}W) • อัตราค่าไฟหอ: ฿{unitRate}/หน่วย (~{totalUnits} หน่วย)
                </div>
              </div>

              {/* Receipt Total Bill Breakdown */}
              <div className="py-2.5 border-b-2 border-dashed border-slate-300 space-y-1 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-900 pb-0.5">
                  <span>ยอดรวมบิลห้องนี้:</span>
                  <span className="text-sm font-black tabular-nums">
                    ฿{formatBaht(totalBill)} บาท
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 flex justify-between items-center">
                  <span>• กองกลาง 25% (หารเท่า {roommates.length} คน):</span>
                  <span className="tabular-nums font-semibold">
                    ฿{formatBaht(baseCommonFee)} (คนละ ฿{formatBaht(baseCommonFee / roommates.length)})
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 flex justify-between items-center">
                  <span>• แอร์ & เครื่องใช้ 75% (คิดตามจริง + วันอยู่):</span>
                  <span className="tabular-nums font-semibold">
                    ฿{formatBaht(variableCost)}
                  </span>
                </div>
              </div>

              {/* Per-Roommate Breakdown */}
              <div className="py-3 space-y-2 border-b-2 border-dashed border-slate-300 text-xs">
                {roommates.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: m.hex }}
                        />
                        <span className="truncate max-w-[130px] font-bold">
                          {m.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black tabular-nums text-emerald-800">
                          ฿{formatBaht(m.totalShare)}{' '}
                        </span>
                        <span className="text-[10px] font-normal text-slate-500">
                          (~{m.estimatedUnits} หน่วย • {m.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 pl-4 space-y-0.5 leading-tight">
                      <div className="flex items-center justify-between">
                        <span>
                          อยู่หอ {m.stayDays}/30 วัน • แอร์ {m.hours} ชม./วัน ({m.acDays ?? m.stayDays} วัน/ด.) @ {m.temperature}°C ({m.tempStatus.label})
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          ~{m.monthlyKWh} kWh/ด.
                        </span>
                      </div>
                      {m.activeAppliances.length > 0 && (
                        <div className="text-slate-600 font-medium">
                          เครื่องใช้:{' '}
                          {m.activeAppliances
                            .map(
                              (a) =>
                                `${a.emoji}${a.name} (${a.watts}W • ${
                                  a.durationMinutes >= 60
                                    ? `${a.durationMinutes / 60}ชม.`
                                    : `${a.durationMinutes}น.`
                                } • ${a.daysPerMonth}วัน/ด.)`
                            )
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* PromptPay account if entered */}
              {promptPayNumber.trim() && (
                <div className="mt-2.5 py-2 px-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
                  <span className="font-bold">โอนเข้าพร้อมเพย์/บัญชี:</span>
                  <span className="font-mono font-bold">
                    {promptPayNumber.trim()}
                  </span>
                </div>
              )}

              {/* Thermal Footer */}
              <div className="pt-3 text-center text-[10px] text-slate-500 space-y-0.5">
                <div>คำนวณยุติธรรมด้วย FairDorm Pro</div>
                <div className="font-bold text-slate-700">
                  รักษาความสงบสุขและมิตรภาพของรูมเมท 🤝
                </div>
              </div>
            </div>

            {/* PromptPay Input Box */}
            <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                💳 เบอร์พร้อมเพย์รับเงินโอน (จะปรากฏในสลิปและข้อความ LINE)
              </label>
              <input
                type="text"
                value={promptPayNumber}
                onChange={(e) => setPromptPayNumber(e.target.value)}
                placeholder="เช่น 081-234-5678 หรือ เลขที่บัญชี กสิกร"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Raw Text Preview */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-1">
                ตัวอย่างข้อความสำหรับส่งเข้ากลุ่ม LINE:
              </div>
              <pre className="p-3 bg-slate-950 text-slate-300 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 select-all max-h-32 overflow-y-auto">
                {lineSummaryText}
              </pre>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
            {/* Copy LINE Button */}
            <button
              type="button"
              onClick={handleCopyLine}
              className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>คัดลอกสำเร็จ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>คัดลอกสรุปข้อความลง LINE</span>
                </>
              )}
            </button>

            {/* Save Image Button */}
            <button
              type="button"
              onClick={handleSaveImage}
              disabled={isSavingImage}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>{isSavingImage ? 'กำลังบันทึก...' : '📸 บันทึกรูปภาพบิล'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rock-solid Image Preview & Direct Save Modal (Guarantees user can always save the image!) */}
      {showImagePreviewModal && savedImageUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm sm:max-w-md w-full p-4 space-y-3.5 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-base">📸</span>
                <span className="font-bold text-sm text-white">
                  รูปภาพสลิปบิลค่าไฟห้อง {roomNumber || '402'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowImagePreviewModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview Area */}
            <div className="overflow-y-auto flex-1 flex flex-col items-center justify-center p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <img
                src={savedImageUrl}
                alt="สลิปบิลค่าไฟ FairDorm Pro"
                className="max-h-[60vh] object-contain rounded-xl shadow-lg"
              />
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                💡 สามารถแตะค้างที่รูปภาพเพื่อเลือก <strong>"บันทึกรูปภาพ (Save Image)"</strong> ได้ทันที
              </p>
            </div>

            {/* Actions in Preview Modal */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={savedImageUrl}
                download={`fairdorm-slip-room${roomNumber || '402'}-${Date.now()}.png`}
                onClick={() => sounds.playClick(850)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>ดาวน์โหลดรูปภาพ (PNG)</span>
              </a>

              <button
                type="button"
                onClick={handleShareImage}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>แชร์ / คัดลอก</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
