import React, { useState, useEffect } from "react";

// ─── Mock Data ───────────────────────────────────────────────
const DOCTORS = [
  { id: 1, name: "김민수", lastSignDate: "2026-02-28", unsignedCount: 342 },
  { id: 2, name: "이지현", lastSignDate: "2026-03-15", unsignedCount: 128 },
  { id: 3, name: "박준혁", lastSignDate: "2026-04-01", unsignedCount: 24 },
];

const CHART_RECORDS = [
  { id: 1, patient: "홍길동", chartNo: "2024-00123", dates: ["2026-03-28", "2026-04-01", "2026-04-03"], status: "unsigned" },
  { id: 2, patient: "김영희", chartNo: "2024-00456", dates: ["2026-04-02"], status: "unsigned" },
  { id: 3, patient: "이철수", chartNo: "2024-00789", dates: ["2026-03-30", "2026-04-01"], status: "mismatch" },
  { id: 4, patient: "박지민", chartNo: "2024-01012", dates: ["2026-04-03"], status: "mismatch" },
  { id: 5, patient: "최수현", chartNo: "2024-01345", dates: ["2026-03-25", "2026-03-28"], status: "signed" },
  { id: 6, patient: "정하은", chartNo: "2024-01678", dates: ["2026-04-01", "2026-04-02", "2026-04-03"], status: "unsigned" },
  { id: 7, patient: "오세진", chartNo: "2024-01901", dates: ["2026-03-29"], status: "signed" },
  { id: 8, patient: "한미래", chartNo: "2024-02234", dates: ["2026-04-02", "2026-04-03"], status: "unsigned" },
];

const DAILY_RECORDS_RECEIPT = [
  { id: 1, date: "2026-04-03", status: "unsigned" },
  { id: 2, date: "2026-04-02", status: "unsigned" },
  { id: 3, date: "2026-04-01", status: "mismatch" },
  { id: 4, date: "2026-03-31", status: "signed" },
  { id: 5, date: "2026-03-30", status: "signed" },
  { id: 6, date: "2026-03-29", status: "unsigned" },
  { id: 7, date: "2026-03-28", status: "signed" },
];

const DAILY_RECORDS_XRAY = [
  { id: 1, date: "2026-04-03", status: "unsigned" },
  { id: 2, date: "2026-04-02", status: "signed" },
  { id: 3, date: "2026-04-01", status: "unsigned" },
  { id: 4, date: "2026-03-31", status: "signed" },
  { id: 5, date: "2026-03-30", status: "signed" },
  { id: 6, date: "2026-03-29", status: "mismatch" },
  { id: 7, date: "2026-03-28", status: "signed" },
];

const SIGN_HISTORY = [
  { id: 1, date: "2026-04-01 09:32", signer: "홍원장", count: 156, docType: "진료기록부" },
  { id: 2, date: "2026-04-01 09:33", signer: "홍원장", count: 1, docType: "수납대장" },
  { id: 3, date: "2026-04-01 09:33", signer: "홍원장", count: 1, docType: "방사선대장" },
  { id: 4, date: "2026-03-15 14:20", signer: "홍원장", count: 89, docType: "진료기록부", note: "장기 휴직" },
  { id: 5, date: "2026-03-01 10:15", signer: "홍원장", count: 420, docType: "진료기록부" },
  { id: 6, date: "2026-03-01 10:16", signer: "홍원장", count: 28, docType: "수납대장" },
  { id: 7, date: "2026-02-01 11:00", signer: "이지현", count: 210, docType: "진료기록부" },
];

// ─── Icons ──────────────────────────────────────────────────
const icons = {
  dashboard: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  batchSign: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4"/><path d="M4 7h16M4 12h16M4 17h16"/></svg>,
  chart: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 15l2 2 4-4"/></svg>,
  receipt: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/><path d="M8 10h8M8 14h5"/></svg>,
  xray: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="M7.5 7.5l9 9M16.5 7.5l-9 9"/></svg>,
  proxy: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  history: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  check: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>,
  alert: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  key: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  close: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  settings: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  minus: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>,
};

// ─── Utility ────────────────────────────────────────────────
const TODAY = "2026-04-05";
const OPEN_DATE = "2020-03-01"; // 개원시작일

function getDaysAgo(dateStr) {
  return Math.floor((new Date(TODAY) - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
}

function subtractDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function formatDateRange(dates) {
  if (!dates || dates.length === 0) return "";
  const sorted = [...dates].sort();
  if (sorted.length === 1) return formatDate(sorted[0]);
  return `${formatDate(sorted[0])} ~ ${formatDate(sorted[sorted.length - 1])}`;
}

function StatusBadge({ status }) {
  const m = {
    unsigned: { label: "서명필요", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    mismatch: { label: "서명필요", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    signed: { label: "서명완료", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  };
  const s = m[status];
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${s.bg} ${s.text} ${s.border}`}>{s.label}</span>;
}

// ─── DateRangePicker ────────────────────────────────────────
function getQuickRanges() {
  const today = new Date(TODAY);
  // 최근 3일
  const d3From = subtractDays(TODAY, 2);
  // 지난주 (월~일)
  const dayOfWeek = today.getDay() || 7; // 일=7
  const lastMonEnd = new Date(today); lastMonEnd.setDate(today.getDate() - dayOfWeek);
  const lastMonStart = new Date(lastMonEnd); lastMonStart.setDate(lastMonEnd.getDate() - 6);
  const lwFrom = lastMonStart.toISOString().split("T")[0];
  const lwTo = lastMonEnd.toISOString().split("T")[0];
  // 지난달
  const lmEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  const lmStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lmFrom = lmStart.toISOString().split("T")[0];
  const lmTo = lmEnd.toISOString().split("T")[0];
  // 이번달
  const tmStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const tmFrom = tmStart.toISOString().split("T")[0];
  const tmTo = TODAY;

  return [
    { label: "최근 3일", from: d3From, to: TODAY },
    { label: "지난주", from: lwFrom, to: lwTo },
    { label: "지난달", from: lmFrom, to: lmTo },
    { label: "이번달", from: tmFrom, to: tmTo },
    { label: "전체", from: OPEN_DATE, to: TODAY },
  ];
}

function DateRangePicker({ dateFrom, dateTo, onChangeFrom, onChangeTo }) {
  const ranges = getQuickRanges();
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-2">기간 선택</label>
      <div className="flex items-center gap-2 flex-wrap">
        <input type="date" value={dateFrom} onChange={(e)=>onChangeFrom(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"/>
        <span className="text-gray-400 text-sm">~</span>
        <input type="date" value={dateTo} onChange={(e)=>onChangeTo(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"/>
        <div className="flex gap-1 ml-1">
          {ranges.map((r)=>{
            const active = dateFrom === r.from && dateTo === r.to;
            return (
              <button key={r.label} onClick={()=>{onChangeFrom(r.from);onChangeTo(r.to);}}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${active ? "bg-blue-900 text-white border-blue-900" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300"}`}>{r.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Sign Toast (App-level, non-blocking) ───────────────────
function SignToast({ toast, onDone }) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setProgress(0); setComplete(false);
    const duration = 20000;
    const start = Date.now();
    let raf;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) { raf = requestAnimationFrame(tick); }
      else { setComplete(true); setTimeout(() => onDone(), 3000); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 w-80 animate-in" style={{animation:"slideIn 0.3s ease-out"}}>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${complete ? "bg-emerald-100" : "bg-blue-100"}`}>
            {complete
              ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
              : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1e40af" strokeWidth="2" className="animate-spin" style={{animation:"spin 1.5s linear infinite"}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {complete ? "서명 완료" : "서명 처리 중"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {toast.label} · {toast.count}건{complete ? " 처리 완료" : ""}
            </p>
            {!complete && (
              <div className="mt-2.5">
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-200" style={{width:`${progress}%`, backgroundColor:"#1e40af"}}/>
                </div>
                <p className="text-xs text-gray-400 mt-1 tabular-nums">{progress}%</p>
              </div>
            )}
          </div>
          {complete && (
            <button onClick={onDone} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
              {icons.close}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PIN Modal ──────────────────────────────────────────────
function PinModal({ open, onClose, onConfirm, targetCount, targetLabel }) {
  const [pins, setPins] = useState(["","","","","",""]);
  const inputRefs = [null,null,null,null,null,null].map(()=>({current:null}));

  if (!open) return null;

  const triggerSign = () => {
    setPins(["","","","","",""]);
    onConfirm();
  };

  const handleChange = (idx, value) => {
    const digit = value.replace(/\D/g,"").slice(-1);
    const next = [...pins];
    next[idx] = digit;
    setPins(next);
    if (digit && idx < 5) {
      inputRefs[idx+1].current?.focus();
    }
    if (digit && idx === 5 && next.every(d=>d!=="")) {
      setTimeout(triggerSign, 150);
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (pins[idx]) {
        const next = [...pins]; next[idx] = ""; setPins(next);
      } else if (idx > 0) {
        const next = [...pins]; next[idx-1] = ""; setPins(next);
        inputRefs[idx-1].current?.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs[idx-1].current?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      inputRefs[idx+1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (!pasted) return;
    const next = [...pins];
    for (let i=0; i<6; i++) next[i] = pasted[i] || "";
    setPins(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs[focusIdx].current?.focus();
    if (pasted.length === 6) setTimeout(triggerSign, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backgroundColor:"rgba(0,0,0,0.4)"}}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
        <button onClick={()=>{setPins(["","","","","",""]);onClose();}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">{icons.close}</button>
        <h3 className="text-base font-semibold text-gray-900 mb-1">전자서명</h3>
        <p className="text-sm text-gray-500 mb-5">{targetLabel} <span className="font-semibold text-gray-900">{targetCount}건</span>에 서명합니다</p>
        <label className="block text-xs font-medium text-gray-600 mb-3">PIN 6자리 입력</label>
        <div className="flex gap-2 mb-4 justify-center">
          {[0,1,2,3,4,5].map((i)=>(
            <input
              key={i}
              ref={(el)=>{inputRefs[i].current=el;}}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={pins[i]}
              onChange={(e)=>handleChange(i,e.target.value)}
              onKeyDown={(e)=>handleKeyDown(i,e)}
              onPaste={i===0?handlePaste:undefined}
              onFocus={(e)=>e.target.select()}
              autoFocus={i===0}
              className={`w-11 h-14 rounded-lg border-2 text-center text-xl font-bold outline-none transition-all ${pins[i]?"border-blue-500 bg-blue-50 text-blue-800":"border-gray-200 bg-gray-50 text-gray-400"} focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">6자리 입력 시 자동으로 서명이 실행됩니다</p>
      </div>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────
function DashboardPage({onNavigate}) {
  const myLastSign = "2026-04-01";
  const myDaysAgo = getDaysAgo(myLastSign);
  const myUnsigned = { chart: 48, receipt: 3, xray: 2 };
  const total = myUnsigned.chart + myUnsigned.receipt + myUnsigned.xray;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">서명 현황</h1>
        <p className="text-sm text-gray-500 mt-0.5">대표원장 · 2026.04.05 기준</p>
      </div>
      {/* 마지막 서명일 강조 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-6 mb-5">
          <div>
            <p className="text-xs text-gray-500 mb-1">마지막 서명일</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatDate(myLastSign)}</p>
          </div>
          <div className="h-10 w-px bg-gray-200"/>
          <div>
            <p className="text-xs text-gray-500 mb-1">경과</p>
            <p className={`text-2xl font-bold tabular-nums ${myDaysAgo>=30?"text-red-600":"text-gray-900"}`}>{myDaysAgo}일</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[{label:"진료기록부",value:myUnsigned.chart,nav:"chart"},{label:"수납대장",value:myUnsigned.receipt,nav:"receipt"},{label:"방사선대장",value:myUnsigned.xray,nav:"xray"},{label:"전체 미서명",value:total,nav:"batch",accent:true}].map((item)=>(
            <button key={item.label} onClick={()=>onNavigate(item.nav)} className={`rounded-lg p-4 text-center border transition-colors cursor-pointer ${item.accent?"bg-gray-50 border-blue-200 hover:bg-blue-50":"bg-gray-50 border-gray-100 hover:border-blue-200 hover:bg-blue-50"}`}>
              <p className={`text-2xl font-bold tabular-nums ${item.accent?"text-blue-700":"text-gray-900"}`}>{item.value}</p>
              <p className={`text-xs mt-1 ${item.accent?"text-blue-600":"text-gray-500"}`}>{item.label}</p>
            </button>
          ))}
        </div>
      </div>
      {/* 인증서 */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">{icons.key}</div>
          <div>
            <p className="text-sm font-medium text-gray-800">공인인증서 등록됨</p>
            <p className="text-xs text-gray-500">유효기간: 2027.01.15 · 남은 기간 285일</p>
          </div>
        </div>
        <button onClick={()=>alert("공인인증서 설정 페이지로 이동합니다.\n(별도 설정 > 인증서 관리 화면)")} className="text-xs text-gray-500 hover:text-blue-700 flex items-center gap-1 transition-colors">{icons.settings}<span>관리</span></button>
      </div>
      {/* 봉직의 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">의사별 서명 현황</h2>
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left">
              <th className="px-4 py-2.5 font-medium text-gray-500 text-xs">의사명</th>
              <th className="px-4 py-2.5 font-medium text-gray-500 text-xs">마지막 서명일</th>
              <th className="px-4 py-2.5 font-medium text-gray-500 text-xs">경과일수</th>
              <th className="px-4 py-2.5 font-medium text-gray-500 text-xs text-right">미서명 건수</th>
            </tr></thead>
            <tbody>{DOCTORS.map((doc)=>{
              const days=getDaysAgo(doc.lastSignDate);const warn=days>=30;
              return(<tr key={doc.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{doc.name}</td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">{formatDate(doc.lastSignDate)}</td>
                <td className={`px-4 py-3 tabular-nums font-semibold ${warn?"text-red-600":"text-gray-600"}`}>{days}일</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-800">{doc.unsignedCount}건</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Batch Sign ─────────────────────────────────────────────
function BatchSignPage({showToast}) {
  const [dateFrom,setDateFrom]=useState("2026-03-01");
  const [dateTo,setDateTo]=useState(TODAY);
  const [docTypes,setDocTypes]=useState({chart:true,receipt:true,xray:true});
  const [queried,setQueried]=useState(false);
  const [pinOpen,setPinOpen]=useState(false);
  const counts={chart:48,receipt:3,xray:2};
  const selectedCount=(docTypes.chart?counts.chart:0)+(docTypes.receipt?counts.receipt:0)+(docTypes.xray?counts.xray:0);
  const toggleOne=(k)=>setDocTypes((p)=>({...p,[k]:!p[k]}));
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-bold text-gray-900">일괄서명</h1><p className="text-sm text-gray-500 mt-0.5">3종 문서를 한번에 서명합니다</p></div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-end gap-3">
          <div className="flex-1"><DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo}/></div>
          <button onClick={()=>{setQueried(true);setDocTypes({chart:true,receipt:true,xray:true});}} className="px-4 py-2 text-sm font-semibold rounded-lg text-white mb-0.5" style={{backgroundColor:"#1e40af"}}>조회</button>
        </div>
      </div>
      {queried&&(
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">조회 결과 <span className="font-normal text-gray-400 ml-1">클릭하여 서명 대상을 선택하세요</span></h2>
          <div className="grid grid-cols-3 gap-3">
            {[{key:"chart",label:"진료기록부",count:counts.chart},{key:"receipt",label:"수납대장",count:counts.receipt},{key:"xray",label:"방사선대장",count:counts.xray}].map((item)=>(
              <button key={item.key} onClick={()=>toggleOne(item.key)}
                className={`rounded-lg p-4 text-center border transition-colors cursor-pointer ${docTypes[item.key]?"border-blue-200 bg-blue-50 hover:bg-blue-100":"border-gray-200 bg-gray-50 opacity-50 hover:opacity-70"}`}>
                <p className={`text-xl font-bold tabular-nums ${docTypes[item.key]?"text-gray-900":"text-gray-400"}`}>{item.count}</p>
                <p className={`text-xs mt-0.5 ${docTypes[item.key]?"text-gray-600":"text-gray-400"}`}>{item.label}</p>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">서명 대상 <span className="font-bold text-gray-900">{selectedCount}건</span></p>
            <button onClick={()=>setPinOpen(true)} disabled={selectedCount===0} className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white" style={{backgroundColor:selectedCount>0?"#1e40af":"#cbd5e1"}}>서명하기</button>
          </div>
        </div>
      )}
      <PinModal open={pinOpen} onClose={()=>setPinOpen(false)} onConfirm={()=>{setPinOpen(false);setQueried(false);showToast("일괄서명",selectedCount);}} targetCount={selectedCount} targetLabel="일괄서명"/>
    </div>
  );
}

// ─── Chart Sign (통합: 본인 + 모든 의사) ─────────────────────
const ALL_CHART_RECORDS = {
  "홍원장": [
    { id: 1, patient: "홍길동", chartNo: "2024-00123", dates: ["2026-03-28", "2026-04-01", "2026-04-03"], status: "unsigned" },
    { id: 2, patient: "김영희", chartNo: "2024-00456", dates: ["2026-04-02"], status: "unsigned" },
    { id: 3, patient: "이철수", chartNo: "2024-00789", dates: ["2026-03-30", "2026-04-01"], status: "mismatch" },
    { id: 4, patient: "최수현", chartNo: "2024-01345", dates: ["2026-03-25", "2026-03-28"], status: "signed" },
    { id: 5, patient: "한미래", chartNo: "2024-02234", dates: ["2026-04-02", "2026-04-03"], status: "unsigned" },
  ],
  "김민수": [
    { id: 101, patient: "강서윤", chartNo: "2024-03001", dates: ["2026-03-10", "2026-03-12"], status: "unsigned" },
    { id: 102, patient: "윤도현", chartNo: "2024-03002", dates: ["2026-03-15"], status: "unsigned" },
    { id: 103, patient: "임채원", chartNo: "2024-03003", dates: ["2026-03-01", "2026-03-05", "2026-03-08"], status: "unsigned" },
  ],
  "이지현": [
    { id: 201, patient: "박지민", chartNo: "2024-04001", dates: ["2026-03-20", "2026-03-22"], status: "unsigned" },
    { id: 202, patient: "정하은", chartNo: "2024-04002", dates: ["2026-04-01", "2026-04-03"], status: "signed" },
  ],
};

function ChartSignPage({showToast}) {
  const [dateFrom,setDateFrom]=useState("2026-03-25");
  const [dateTo,setDateTo]=useState(TODAY);
  const [allDoctors,setAllDoctors]=useState(false);
  const [loading,setLoading]=useState(false);
  const [loadProgress,setLoadProgress]=useState(0);
  const [queried,setQueried]=useState(false);
  const [selected,setSelected]=useState({});
  const [pinOpen,setPinOpen]=useState(false);

  // 표시할 데이터: 체크 해제 시 본인만, 체크 시 전체
  const visibleGroups = allDoctors
    ? Object.entries(ALL_CHART_RECORDS)
    : [["홍원장", ALL_CHART_RECORDS["홍원장"]]];

  const allRecords = visibleGroups.flatMap(([,recs])=>recs);
  const actionable = allRecords.filter(r=>r.status!=="signed");
  const hasOtherDoctorRecords = allDoctors && visibleGroups.some(([name])=>name!=="홍원장");
  const initSelect=()=>{const s={};actionable.forEach(r=>(s[r.id]=true));return s;};

  const handleQuery=()=>{
    setLoading(true);setLoadProgress(0);setQueried(false);
    const start=Date.now();const duration=5000;
    const tick=()=>{
      const elapsed=Date.now()-start;
      const pct=Math.min(100,Math.round((elapsed/duration)*100));
      setLoadProgress(pct);
      if(elapsed<duration){requestAnimationFrame(tick);}
      else{setLoading(false);setQueried(true);setSelected(initSelect());}
    };
    requestAnimationFrame(tick);
  };

  const toggleRecord=(id)=>setSelected((p)=>({...p,[id]:!p[id]}));
  const selectedCount=Object.values(selected).filter(Boolean).length;
  const allActionableSelected=actionable.length>0&&actionable.every(r=>selected[r.id]);
  const someActionableSelected=actionable.some(r=>selected[r.id]);
  const toggleAll=()=>{
    if(allActionableSelected){const s={};actionable.forEach(r=>(s[r.id]=false));setSelected(s);}
    else{setSelected(initSelect());}
  };

  // 다른 의사 기록이 선택에 포함되어 있는지 확인
  const otherDoctorNames = Object.keys(ALL_CHART_RECORDS).filter(n=>n!=="홍원장");
  const otherDoctorRecordIds = otherDoctorNames.flatMap(n=>ALL_CHART_RECORDS[n].filter(r=>r.status!=="signed").map(r=>r.id));
  const hasOtherSelected = otherDoctorRecordIds.some(id=>selected[id]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-bold text-gray-900">진료기록부 서명</h1><p className="text-sm text-gray-500 mt-0.5">환자별 진료기록 서명</p></div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="flex items-end gap-3">
          <div className="flex-1"><DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo}/></div>
          <button onClick={handleQuery} className="px-4 py-2 text-sm font-semibold rounded-lg text-white mb-0.5" style={{backgroundColor:"#1e40af"}}>조회</button>
        </div>
        {/* 대표원장 전용: 모든 의사 기록 검색 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={allDoctors} onChange={(e)=>{setAllDoctors(e.target.checked);setQueried(false);}}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200"/>
          <span className="text-sm text-gray-700">모든 의사 기록 검색</span>
        </label>
      </div>

      {loading&&(
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">진료기록부 조회 중...</p>
            <p className="text-xs text-gray-400 mb-4">서명 대상 기록을 검색하고 있습니다</p>
            <div className="w-full max-w-md mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-100" style={{width:`${loadProgress}%`,backgroundColor:"#1e40af"}}/>
            </div>
            <p className="text-xs text-gray-400 mt-2 tabular-nums">{loadProgress}%</p>
          </div>
        </div>
      )}

      {/* 조회 전 + 모든 의사 체크 시 안내 */}
      {!queried && !loading && allDoctors && (
        <div className="flex gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">{icons.alert}</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">다른 의사의 진료기록 서명 안내</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">진료기록부 서명은 진료를 수행한 의사 본인이 하는 것이 원칙입니다. 퇴사 후 연락 불가 등 불가피한 경우에 한하여 다른 의사의 진료기록에 서명해 주시기 바랍니다.</p>
          </div>
        </div>
      )}

      {queried&&!loading&&(
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">
              {allDoctors ? `${visibleGroups.length}명 의사` : "본인"} · 전체 {allRecords.length}건 · 서명 대상 <span className="font-semibold text-gray-800">{selectedCount}건</span> 선택
            </p>
            <button onClick={()=>setPinOpen(true)} disabled={selectedCount===0} className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white" style={{backgroundColor:selectedCount>0?"#1e40af":"#cbd5e1"}}>선택 건 서명</button>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {visibleGroups.map(([doctorName, records])=>(
              <div key={doctorName}>
                {/* 의사별 그룹 헤더 (모든 의사 모드일 때만) */}
                {allDoctors && (
                  <div className={`px-5 py-2 border-b flex items-center gap-2 ${doctorName==="홍원장"?"bg-blue-50 border-blue-100":"bg-gray-50 border-gray-100"}`}>
                    <span className={`text-xs font-semibold ${doctorName==="홍원장"?"text-blue-700":"text-gray-700"}`}>{doctorName}</span>
                    {doctorName==="홍원장" && <span className="text-xs text-blue-500">(본인)</span>}
                    <span className="text-xs text-gray-400">{records.filter(r=>r.status!=="signed").length}건 서명필요</span>
                  </div>
                )}
                <table className="w-full text-sm">
                  {/* 첫 그룹에만 헤더 표시 */}
                  {doctorName===visibleGroups[0][0] && (
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="text-left border-b border-gray-100">
                        <th className="px-5 py-2.5 w-10">
                          <button onClick={toggleAll} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allActionableSelected?"bg-blue-600 border-blue-600 text-white":someActionableSelected?"bg-blue-600 border-blue-600 text-white":"border-gray-300 bg-white"}`}>
                            {allActionableSelected?icons.check:someActionableSelected?icons.minus:null}
                          </button>
                        </th>
                        <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">환자</th>
                        <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">차트번호</th>
                        <th className="px-3 py-2.5 font-medium text-gray-500 text-xs text-right">건수</th>
                        <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">진료일</th>
                        <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">상태</th>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {records.map((rec)=>{
                      const isA=rec.status!=="signed";
                      return(
                        <tr key={rec.id} className={`border-b border-gray-50 transition-colors ${isA?"hover:bg-blue-50/30":"opacity-50"}`}>
                          <td className="px-5 py-3">
                            {isA?(<button onClick={()=>toggleRecord(rec.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected[rec.id]?"bg-blue-600 border-blue-600 text-white":"border-gray-300 bg-white"}`}>{selected[rec.id]&&icons.check}</button>
                            ):(<div className="w-4 h-4 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-emerald-500">{icons.check}</div>)}
                          </td>
                          <td className="px-3 py-3 font-medium text-gray-800">{rec.patient}</td>
                          <td className="px-3 py-3 text-gray-500 tabular-nums text-xs">{rec.chartNo}</td>
                          <td className="px-3 py-3 text-right tabular-nums font-semibold text-gray-800">{rec.dates.length}</td>
                          <td className="px-3 py-3 text-gray-600 text-xs">{formatDateRange(rec.dates)}</td>
                          <td className="px-3 py-3"><StatusBadge status={rec.status}/></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 다른 의사 기록 포함 시 특이사항+PIN 모달, 아니면 일반 PIN 모달 */}
      {hasOtherSelected
        ? <IndividualSignModal open={pinOpen} onClose={()=>setPinOpen(false)} onConfirm={()=>{setPinOpen(false);showToast("진료기록부",selectedCount);}} targetCount={selectedCount} doctorName="진료기록부"/>
        : <PinModal open={pinOpen} onClose={()=>setPinOpen(false)} onConfirm={()=>{setPinOpen(false);showToast("진료기록부",selectedCount);}} targetCount={selectedCount} targetLabel="진료기록부"/>
      }
    </div>
  );
}

// ─── Daily Doc Sign ─────────────────────────────────────────
function DailyDocSignPage({title,subtitle,records,showToast}) {
  const [dateFrom,setDateFrom]=useState("2026-03-28");
  const [dateTo,setDateTo]=useState(TODAY);
  const [queried,setQueried]=useState(false);
  const [selected,setSelected]=useState({});
  const [pinOpen,setPinOpen]=useState(false);
  const actionable=records.filter((r)=>r.status!=="signed");
  const handleQuery=()=>{setQueried(true);const sel={};actionable.forEach((r)=>(sel[r.id]=true));setSelected(sel);};
  const toggleRecord=(id)=>setSelected((p)=>({...p,[id]:!p[id]}));
  const selectedCount=Object.values(selected).filter(Boolean).length;
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-bold text-gray-900">{title}</h1><p className="text-sm text-gray-500 mt-0.5">{subtitle}</p></div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-end gap-3">
          <div className="flex-1"><DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo}/></div>
          <button onClick={handleQuery} className="px-4 py-2 text-sm font-semibold rounded-lg text-white mb-0.5" style={{backgroundColor:"#1e40af"}}>조회</button>
        </div>
      </div>
      {queried&&(
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">전체 {records.length}건 · 서명 대상 <span className="font-semibold text-gray-800">{selectedCount}건</span> 선택</p>
            <button onClick={()=>setPinOpen(true)} disabled={selectedCount===0} className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white" style={{backgroundColor:selectedCount>0?"#1e40af":"#cbd5e1"}}>선택 건 서명</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white"><tr className="text-left border-b border-gray-100">
                <th className="px-5 py-2.5 w-10"></th>
                <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">날짜</th>
                <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">상태</th>
              </tr></thead>
              <tbody>{records.map((rec)=>{
                const isA=rec.status!=="signed";
                return(<tr key={rec.id} className={`border-b border-gray-50 transition-colors ${isA?"hover:bg-blue-50/30":"opacity-50"}`}>
                  <td className="px-5 py-3">
                    {isA?(<button onClick={()=>toggleRecord(rec.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected[rec.id]?"bg-blue-600 border-blue-600 text-white":"border-gray-300 bg-white"}`}>{selected[rec.id]&&icons.check}</button>
                    ):(<div className="w-4 h-4 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-emerald-500">{icons.check}</div>)}
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-800 tabular-nums">{formatDate(rec.date)}</td>
                  <td className="px-3 py-3"><StatusBadge status={rec.status}/></td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </div>
      )}
      <PinModal open={pinOpen} onClose={()=>setPinOpen(false)} onConfirm={()=>{setPinOpen(false);showToast(title,selectedCount);}} targetCount={selectedCount} targetLabel={title}/>
    </div>
  );
}

// ─── Individual Sign Modal (특이사항 + PIN 통합) ─────────────
function IndividualSignModal({ open, onClose, onConfirm, targetCount, doctorName }) {
  const [note, setNote] = useState("");
  const [pins, setPins] = useState(["","","","","",""]);
  const inputRefs = [null,null,null,null,null,null].map(()=>({current:null}));

  if (!open) return null;

  const triggerSign = () => {
    setPins(["","","","","",""]); const n=note.trim(); setNote("");
    onConfirm(n);
  };

  const handleChange = (idx, value) => {
    const digit = value.replace(/\D/g,"").slice(-1);
    const next = [...pins]; next[idx] = digit; setPins(next);
    if (digit && idx < 5) inputRefs[idx+1].current?.focus();
    if (digit && idx === 5 && next.every(d=>d!=="")) setTimeout(triggerSign, 150);
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (pins[idx]) { const next=[...pins]; next[idx]=""; setPins(next); }
      else if (idx>0) { const next=[...pins]; next[idx-1]=""; setPins(next); inputRefs[idx-1].current?.focus(); }
      e.preventDefault();
    } else if (e.key==="ArrowLeft"&&idx>0) inputRefs[idx-1].current?.focus();
    else if (e.key==="ArrowRight"&&idx<5) inputRefs[idx+1].current?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (!pasted) return;
    const next=[...pins]; for(let i=0;i<6;i++) next[i]=pasted[i]||""; setPins(next);
    inputRefs[Math.min(pasted.length,5)].current?.focus();
    if (pasted.length===6) setTimeout(triggerSign,150);
  };

  const handleClose = () => { setPins(["","","","","",""]); setNote(""); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backgroundColor:"rgba(0,0,0,0.4)"}}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">{icons.close}</button>
        <h3 className="text-base font-semibold text-gray-900 mb-0.5">전자서명</h3>
        <p className="text-sm text-gray-500 mb-5">{doctorName} · <span className="font-semibold text-gray-900">{targetCount}건</span></p>

        {/* 특이사항 입력 (선택) */}
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">특이사항 <span className="text-gray-400 font-normal">(선택)</span></label>
        <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="특이사항이 있으면 입력하세요"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 mb-5"/>

        {/* PIN 입력 */}
        <label className="block text-xs font-medium text-gray-600 mb-3">PIN 6자리 입력</label>
        <div className="flex gap-2 mb-4 justify-center">
          {[0,1,2,3,4,5].map((i)=>(
            <input
              key={i}
              ref={(el)=>{inputRefs[i].current=el;}}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={pins[i]}
              onChange={(e)=>handleChange(i,e.target.value)}
              onKeyDown={(e)=>handleKeyDown(i,e)}
              onPaste={i===0?handlePaste:undefined}
              onFocus={(e)=>e.target.select()}
              className={`w-11 h-14 rounded-lg border-2 text-center text-xl font-bold outline-none transition-all ${
                pins[i] ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-gray-50 text-gray-400"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">6자리 입력 시 자동으로 서명이 실행됩니다</p>
      </div>
    </div>
  );
}

// ─── Individual Sign (의사별 서명) ──────────────────────────
const ALL_DOCTORS = [
  { id: 0, name: "홍원장", unsignedCount: 48 },
  ...DOCTORS,
];

function IndividualSignPage({showToast}) {
  const [selectedDoctor,setSelectedDoctor]=useState(null);
  const [dateFrom,setDateFrom]=useState("2026-03-01");
  const [dateTo,setDateTo]=useState(TODAY);
  const [loading,setLoading]=useState(false);
  const [loadProgress,setLoadProgress]=useState(0);
  const [queried,setQueried]=useState(false);
  const [selected,setSelected]=useState({});
  const [pinOpen,setPinOpen]=useState(false);

  const individualRecords=[
    {id:101,patient:"강서윤",chartNo:"2024-03001",dates:["2026-03-10","2026-03-12"],status:"unsigned"},
    {id:102,patient:"윤도현",chartNo:"2024-03002",dates:["2026-03-15"],status:"unsigned"},
    {id:103,patient:"임채원",chartNo:"2024-03003",dates:["2026-03-01","2026-03-05","2026-03-08"],status:"unsigned"},
    {id:104,patient:"송지아",chartNo:"2024-03004",dates:["2026-03-20","2026-03-22"],status:"signed"},
  ];

  const actionable=individualRecords.filter(r=>r.status!=="signed");
  const initSelect=()=>{const s={};actionable.forEach(r=>(s[r.id]=true));return s;};

  const handleQuery=()=>{
    setLoading(true);setLoadProgress(0);setQueried(false);
    const start=Date.now();const duration=5000;
    const tick=()=>{
      const elapsed=Date.now()-start;
      const pct=Math.min(100,Math.round((elapsed/duration)*100));
      setLoadProgress(pct);
      if(elapsed<duration){requestAnimationFrame(tick);}
      else{setLoading(false);setQueried(true);setSelected(initSelect());}
    };
    requestAnimationFrame(tick);
  };

  const toggleRecord=(id)=>setSelected((p)=>({...p,[id]:!p[id]}));
  const selectedCount=Object.values(selected).filter(Boolean).length;
  const allActionableSelected=actionable.length>0&&actionable.every(r=>selected[r.id]);
  const someActionableSelected=actionable.some(r=>selected[r.id]);
  const toggleAll=()=>{
    if(allActionableSelected){const s={};actionable.forEach(r=>(s[r.id]=false));setSelected(s);}
    else{setSelected(initSelect());}
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-bold text-gray-900">의사별 서명</h1><p className="text-sm text-gray-500 mt-0.5">진료의사별 진료기록부 서명</p></div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">진료의사 선택</label>
          <div className="flex gap-2 flex-wrap">{ALL_DOCTORS.map((doc)=>(
            <button key={doc.id} onClick={()=>{setSelectedDoctor(doc);setQueried(false);setLoading(false);}} className={`px-4 py-2 text-sm rounded-lg border transition-colors ${selectedDoctor?.id===doc.id?"bg-blue-50 border-blue-200 text-blue-800 font-semibold":"bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {doc.name}<span className="ml-1.5 text-xs opacity-60">{doc.unsignedCount}건</span>
            </button>
          ))}</div>
        </div>
        {selectedDoctor&&(
          <div className="flex items-end gap-3">
            <div className="flex-1"><DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo}/></div>
            <button onClick={handleQuery} className="px-4 py-2 text-sm font-semibold rounded-lg text-white mb-0.5" style={{backgroundColor:"#1e40af"}}>조회</button>
          </div>
        )}
      </div>

      {/* 조회 전: 안내 메시지 / 로딩 중: 프로그레스 / 조회 후: 검색 결과 */}
      {!queried && !loading && (
        <div className="flex gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">{icons.alert}</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">다른 의사의 진료기록 서명 안내</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">진료기록부 서명은 진료를 수행한 의사 본인이 하는 것이 원칙입니다. 퇴사 후 연락 불가 등 불가피한 경우에 한하여 다른 의사의 진료기록에 서명해 주시기 바랍니다.</p>
          </div>
        </div>
      )}

      {loading&&(
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">진료기록부 조회 중...</p>
            <p className="text-xs text-gray-400 mb-4">서명 대상 기록을 검색하고 있습니다</p>
            <div className="w-full max-w-md mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-100" style={{width:`${loadProgress}%`,backgroundColor:"#1e40af"}}/>
            </div>
            <p className="text-xs text-gray-400 mt-2 tabular-nums">{loadProgress}%</p>
          </div>
        </div>
      )}

      {queried&&!loading&&(
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">전체 {individualRecords.length}건 · 서명 대상 <span className="font-semibold text-gray-800">{selectedCount}건</span> 선택</p>
            <button onClick={()=>setPinOpen(true)} disabled={selectedCount===0} className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white" style={{backgroundColor:selectedCount>0?"#1e40af":"#cbd5e1"}}>선택 건 서명</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left border-b border-gray-100">
                  <th className="px-5 py-2.5 w-10">
                    <button onClick={toggleAll} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allActionableSelected?"bg-blue-600 border-blue-600 text-white":someActionableSelected?"bg-blue-600 border-blue-600 text-white":"border-gray-300 bg-white"}`}>
                      {allActionableSelected?icons.check:someActionableSelected?icons.minus:null}
                    </button>
                  </th>
                  <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">환자</th>
                  <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">차트번호</th>
                  <th className="px-3 py-2.5 font-medium text-gray-500 text-xs text-right">건수</th>
                  <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">진료일</th>
                  <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">상태</th>
                </tr>
              </thead>
              <tbody>
                {individualRecords.map((rec)=>{
                  const isA=rec.status!=="signed";
                  return(
                    <tr key={rec.id} className={`border-b border-gray-50 transition-colors ${isA?"hover:bg-blue-50/30":"opacity-50"}`}>
                      <td className="px-5 py-3">
                        {isA?(<button onClick={()=>toggleRecord(rec.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected[rec.id]?"bg-blue-600 border-blue-600 text-white":"border-gray-300 bg-white"}`}>{selected[rec.id]&&icons.check}</button>
                        ):(<div className="w-4 h-4 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-emerald-500">{icons.check}</div>)}
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-800">{rec.patient}</td>
                      <td className="px-3 py-3 text-gray-500 tabular-nums text-xs">{rec.chartNo}</td>
                      <td className="px-3 py-3 text-right tabular-nums font-semibold text-gray-800">{rec.dates.length}</td>
                      <td className="px-3 py-3 text-gray-600 text-xs">{formatDateRange(rec.dates)}</td>
                      <td className="px-3 py-3"><StatusBadge status={rec.status}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <IndividualSignModal open={pinOpen} onClose={()=>setPinOpen(false)} onConfirm={()=>{setPinOpen(false);showToast(`${selectedDoctor?.name} 서명`,selectedCount);}} targetCount={selectedCount} doctorName={selectedDoctor?.name||""}/>
    </div>
  );
}

// ─── History ────────────────────────────────────────────────
function HistoryPage() {
  const [dateFrom,setDateFrom]=useState(subtractDays(TODAY,365));
  const [dateTo,setDateTo]=useState(TODAY);
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-bold text-gray-900">서명 이력</h1><p className="text-sm text-gray-500 mt-0.5">전체 서명 이력 조회</p></div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo}/>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50"><tr className="text-left">
              <th className="px-5 py-2.5 font-medium text-gray-500 text-xs">서명일시</th>
              <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">서명자</th>
              <th className="px-3 py-2.5 font-medium text-gray-500 text-xs text-right">건수</th>
              <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">문서 종류</th>
              <th className="px-3 py-2.5 font-medium text-gray-500 text-xs">특이사항</th>
            </tr></thead>
            <tbody>{SIGN_HISTORY.map((h)=>(
              <tr key={h.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-700 tabular-nums text-xs">{h.date}</td>
                <td className="px-3 py-3 font-medium text-gray-800">{h.signer}</td>
                <td className="px-3 py-3 text-right tabular-nums font-semibold text-gray-800">{h.count}건</td>
                <td className="px-3 py-3 text-gray-600 text-xs">{h.docType}</td>
                <td className="px-3 py-3 text-xs text-gray-500">{h.note||""}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────
const MENU=[
  {id:"dashboard",label:"서명 현황",icon:icons.dashboard},
  {id:"batch",label:"일괄서명",icon:icons.batchSign},
  {id:"chart",label:"진료기록부",icon:icons.chart, lastSignDate:"2026-04-01"},
  {id:"receipt",label:"수납대장",icon:icons.receipt, lastSignDate:"2026-02-20"},
  {id:"xray",label:"방사선대장",icon:icons.xray, lastSignDate:"2026-04-01"},
  {id:"history",label:"서명 이력",icon:icons.history},
];

export default function App() {
  const [page,setPage]=useState("dashboard");
  const [toast,setToast]=useState(null);
  const showToast=(label,count)=>setToast({label,count,key:Date.now()});
  const renderPage=()=>{
    switch(page){
      case "dashboard":return <DashboardPage onNavigate={setPage}/>;
      case "batch":return <BatchSignPage showToast={showToast}/>;
      case "chart":return <ChartSignPage showToast={showToast}/>;
      case "receipt":return <DailyDocSignPage title="수납대장 서명" subtitle="본인부담금 수납대장 · 일별 1건" records={DAILY_RECORDS_RECEIPT} showToast={showToast}/>;
      case "xray":return <DailyDocSignPage title="방사선대장 서명" subtitle="방사선발생장치 사용대장 · 일별 1건" records={DAILY_RECORDS_XRAY} showToast={showToast}/>;
      case "history":return <HistoryPage/>;
      default:return <DashboardPage/>;
    }
  };
  return (
    <div className="flex h-screen bg-gray-50" style={{fontFamily:"'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {MENU.map((item)=>{
            const days = item.lastSignDate ? getDaysAgo(item.lastSignDate) : null;
            const warn = days !== null && days >= 30;
            return (
              <button key={item.id} onClick={()=>setPage(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${page===item.id?"bg-blue-50 text-blue-800 font-semibold":"text-gray-600 hover:bg-gray-50 hover:text-gray-800"}`}>
                <span className={page===item.id?"text-blue-700":"text-gray-400"}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {warn && <span className="text-xs font-bold text-red-600 tabular-nums">{days}일</span>}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto"><div className="max-w-4xl mx-auto px-8 py-8">{renderPage()}</div></main>
      <SignToast toast={toast} onDone={()=>setToast(null)}/>
    </div>
  );
}
