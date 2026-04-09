import { useState, useEffect, useRef } from "react";

type Block = { id: number; time: string; title: string };

const DEFAULTS: Block[] = [
  { id: 1, time: "20:00", title: "Just Chatting" },
  { id: 2, time: "21:00", title: "Fortnite Ranked" },
  { id: 3, time: "23:00", title: "Diablo IV" },
];

export default function App() {
  const [isLive, setIsLive] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>(DEFAULTS);
  const [streamTitle, setStreamTitle] = useState("Thursday Night Grind 🎮");
  const [profit, setProfit] = useState(0);
  const [runtimeSec, setRuntimeSec] = useState(0);
  const [viewers, setViewers] = useState(312);
  const [subs, setSubs] = useState(0);
  const [tips, setTips] = useState(0);
  const nextId = useRef(10);

  const STREAM_DURATION = 180 * 60;

  useEffect(() => {
    if (!isLive) return;
    const profitTimer = setInterval(() => {
      setProfit((p) => p + 240 + Math.floor(Math.random() * 180));
      setViewers((v) => Math.max(50, v + Math.floor(Math.random() * 11) - 5));
    }, 2000);
    const secTimer = setInterval(() => {
      setRuntimeSec((s) => s + 1);
    }, 1000);
    const subTimer = setInterval(() => {
      setSubs((s) => s + 1);
      setTips((t) => t + 100 + Math.floor(Math.random() * 900));
    }, 23000);
    return () => {
      clearInterval(profitTimer);
      clearInterval(secTimer);
      clearInterval(subTimer);
    };
  }, [isLive]);

  function goLive() {
    setIsLive(true);
    setProfit(0);
    setRuntimeSec(0);
    setSubs(0);
    setTips(0);
    setViewers(312);
  }

  function stopLive() {
    setIsLive(false);
  }

  function addBlock() {
    const last = blocks[blocks.length - 1];
    const [h, m] = last ? last.time.split(":").map(Number) : [20, 0];
    const nh = (h + 1) % 24;
    setBlocks([
      ...blocks,
      { id: nextId.current++, time: `${String(nh).padStart(2, "0")}:${String(m).padStart(2, "0")}`, title: "New Segment" },
    ]);
  }

  function deleteBlock(id: number) {
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  function updateBlock(id: number, field: keyof Block, value: string) {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  }

  const planProgress = Math.min(100, Math.round(((streamTitle ? 1 : 0) + Math.min(blocks.length, 4)) / 5 * 100));
  const runtimePct = Math.min(100, Math.round((runtimeSec / STREAM_DURATION) * 100));

  const segIdx = Math.min(Math.floor(runtimeSec / 60 / (180 / Math.max(blocks.length, 1))), blocks.length - 1);
  const currentSeg = blocks[segIdx]?.title ?? "—";
  const nextSeg = blocks[segIdx + 1]?.title ?? "—";

  const hh = Math.floor(runtimeSec / 3600);
  const mm = Math.floor(runtimeSec / 60) % 60;
  const ss = runtimeSec % 60;
  const runtimeStr = hh > 0
    ? `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
    : `${mm}:${String(ss).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#06060f] flex items-start justify-center py-8 px-4 font-sans">
      {/* Phone frame */}
      <div className="w-[390px] min-h-[820px] bg-[#0a0a14] rounded-[44px] border border-white/[0.07] overflow-hidden relative flex flex-col shadow-2xl">
        {/* Notch */}
        <div className="flex justify-between items-center px-7 pt-4 pb-2 text-[11px] text-white/30 select-none">
          <span>9:41</span>
          <span className="flex gap-1 text-white/20">▲ ● ●</span>
        </div>

        {!isLive ? (
          /* ────────── PRE-LIVE PLANNER ────────── */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="px-5 pb-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[1.5px] text-white/30 uppercase mb-0.5">Stream Hub</p>
                <h1 className="text-[22px] font-bold text-slate-100 leading-tight">Pre-Live Planner</h1>
              </div>
              <span className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
                PLANNING
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4 [&::-webkit-scrollbar]:hidden">
              {/* Stream Title */}
              <div>
                <p className="text-[10px] tracking-[1px] text-white/30 uppercase mb-2">Stream Title</p>
                <input
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-2.5 text-[14px] text-slate-100 outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.05] transition-all placeholder-white/20"
                  placeholder="Enter stream title..."
                />
              </div>

              {/* Planning Progress */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[12px] text-white/50 font-medium">Planning Progress</span>
                  <span className="text-[13px] font-bold text-violet-300">{planProgress}%</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
                    style={{ width: `${planProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-white/20">
                  {["Title", "Schedule", "Thumbnail", "Tags", "Category"].map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Schedule Blocks */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] tracking-[1px] text-white/30 uppercase">Schedule</p>
                  <button
                    onClick={addBlock}
                    className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-violet-500/20 transition-all"
                  >
                    + Add Block
                  </button>
                </div>
                <div className="space-y-2">
                  {blocks.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 hover:border-violet-500/20 transition-all group"
                    >
                      <input
                        value={b.time}
                        onChange={(e) => updateBlock(b.id, "time", e.target.value)}
                        className="bg-violet-500/10 border border-transparent text-violet-300 text-[12px] font-bold w-[52px] text-center rounded-lg px-1.5 py-1 outline-none focus:border-violet-400/40 transition-all"
                      />
                      <input
                        value={b.title}
                        onChange={(e) => updateBlock(b.id, "title", e.target.value)}
                        className="flex-1 bg-transparent text-slate-200 text-[13px] font-medium outline-none placeholder-white/20"
                        placeholder="Segment name"
                      />
                      <button
                        onClick={() => deleteBlock(b.id)}
                        className="text-white/20 hover:text-red-400 text-[15px] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Go Live */}
              <button
                onClick={goLive}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold text-[15px] tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-red-900/30"
              >
                ● Go Live
              </button>
            </div>
          </div>
        ) : (
          /* ────────── LIVE DASHBOARD ────────── */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="px-5 pb-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[1.5px] text-white/30 uppercase mb-0.5">Stream Hub</p>
                <h1 className="text-[22px] font-bold text-slate-100 leading-tight">Live Dashboard</h1>
              </div>
              <span className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
                LIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3 [&::-webkit-scrollbar]:hidden">
              {/* Profit Ticker */}
              <div className="bg-white/[0.03] border border-red-500/15 rounded-2xl p-4 text-center">
                <p className="text-[10px] tracking-[1.5px] text-white/30 uppercase mb-2">Live Profit Today</p>
                <p className="text-[34px] font-bold text-emerald-400 tabular-nums leading-none">
                  ¥{profit.toLocaleString()}
                </p>
                <p className="text-[11px] text-white/30 mt-1.5">
                  Live for <span className="text-white/50 font-semibold">{runtimeStr}</span>
                </p>
              </div>

              {/* Runtime Progress */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] text-white/40">Stream Progress</span>
                  <span className="text-[12px] font-bold text-red-400">{runtimePct}%</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-1000"
                    style={{ width: `${runtimePct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-white/20">
                  {blocks.slice(0, 5).map((b) => <span key={b.id}>{b.time}</span>)}
                </div>
              </div>

              {/* Current / Next Segment */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl p-3">
                  <p className="text-[9px] tracking-[1px] text-red-400/70 uppercase font-semibold mb-1.5">Now</p>
                  <p className="text-[14px] font-bold text-slate-100 leading-tight">{currentSeg}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                  <p className="text-[9px] tracking-[1px] text-white/30 uppercase font-semibold mb-1.5">Next</p>
                  <p className="text-[14px] font-bold text-white/50 leading-tight">{nextSeg}</p>
                </div>
              </div>

              {/* Analytics */}
              <p className="text-[10px] tracking-[1px] text-white/30 uppercase">Quick Analytics</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Viewers", value: viewers.toLocaleString(), color: "text-blue-400" },
                  { label: "New Subs", value: subs, color: "text-emerald-400" },
                  { label: "Tips", value: `¥${tips.toLocaleString()}`, color: "text-amber-400" },
                  { label: "Chat/min", value: Math.round(viewers / 15), color: "text-purple-400" },
                  { label: "Clips", value: Math.floor(runtimeSec / 120), color: "text-pink-400" },
                  { label: "Cheers", value: Math.floor(runtimeSec / 30), color: "text-rose-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className={`text-[18px] font-bold ${color} tabular-nums leading-none`}>{value}</p>
                    <p className="text-[10px] text-white/30 mt-1 font-medium">{label}</p>
                  </div>
                ))}
              </div>

              {/* Stop Live */}
              <button
                onClick={stopLive}
                className="w-full py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.09] text-white/60 font-bold text-[14px] hover:bg-white/[0.08] active:scale-[0.98] transition-all"
              >
                ■ Stop Stream
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
