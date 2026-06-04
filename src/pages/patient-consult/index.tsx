// @ts-nocheck
// 포팅한 디자인 프로토타입 (인라인 스타일, 단일 파일) — 타입체크 제외
import { useState, useRef, useEffect } from "react";
import { Mic, Check, PenLine, Printer, Trash2, AlertTriangle, GripVertical, Info, ChevronDown, Plus, Settings, ClipboardCheck } from "lucide-react";
// 상담내역 리스트/상세: 편집 가능한 HTML 원본을 raw 문자열로 로드 (기존 base64 대체)
import CONSULT_DETAIL_HTML from "./consult-detail.html?raw";
import CONSULT_LIST_HTML from "./consult-list.html?raw";

// ─────────────────────────────────────────────────────────────
// 디자인 토큰
// ─────────────────────────────────────────────────────────────
const tokens = {
navy: "#1E3A5F",
teal: "#0D9488",
bgBase: "#F8FAFC",
bgPanel: "#FFFFFF",
bgLeft: "#FFFFFF",
bgRight: "#F1F5F9",
border: "#E2E8F0",
borderStrong: "#CBD5E1",
textPrimary: "#0F172A",
textSecondary: "#475569",
textMuted: "#94A3B8",
rec: "#475569",
red: "#DC2626",
redDeep: "#B91C1C",
redSoftBg: "#FEF2F2",
redSoftBorder: "#FECACA",
amber: "#D97706",
};

const LEFT_FLEX = 1;
const RIGHT_FLEX = 1;
const BTN_GROUP_W = 180;
const TABLE_W = 300;

const ICON_BOX = 32;
const RING_R = 14;
const RING_C = 2 * Math.PI * RING_R;
const DOT = 20;

const won = (n) => (Number.isFinite(n) ? n : 0).toLocaleString("ko-KR");
const parseNum = (s) => Number(String(s).replace(/[^0-9-]/g, "")) || 0;

const cellLabel = { fontSize: 13, color: tokens.textSecondary, whiteSpace: "nowrap" };
const cellSelect = { border: "none", outline: "none", background: "transparent", fontSize: 13, fontFamily: "inherit", color: tokens.textPrimary, cursor: "pointer", padding: 0, flex: 1, minWidth: 0 };
const selectStyle = { border: "none", outline: "none", background: "transparent", padding: "3px 4px", borderRadius: 4, fontSize: 13, fontWeight: 500, fontFamily: "inherit", color: tokens.textPrimary, cursor: "pointer", width: "auto" };
const cellTextarea = { border: "none", outline: "none", background: "transparent", resize: "none", width: "100%", height: "100%", padding: 0, margin: 0, fontSize: 13, lineHeight: 1.5, fontFamily: "inherit", color: tokens.textPrimary, boxSizing: "border-box", display: "block" };
const cellInput = { border: "none", outline: "none", background: "transparent", textAlign: "right", width: 120, fontSize: 14, fontWeight: 600, fontFamily: "inherit", color: tokens.textPrimary, fontVariantNumeric: "tabular-nums", padding: 0 };

// ─────────────────────────────────────────────────────────────
// 녹음 버튼 (mock)
// ─────────────────────────────────────────────────────────────
function RecordButton() {
const [recording, setRecording] = useState(false);
const [hover, setHover] = useState(false);
const label = recording ? "15:37" : "녹음 시작";
return (
<div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => setRecording((r) => !r)} style={{ display: "flex", alignItems: "center", gap: 8, height: "100%", cursor: "pointer", userSelect: "none" }}>
<span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", fontWeight: recording ? 600 : 500, color: tokens.textSecondary, opacity: hover ? 1 : 0, transform: hover ? "translateX(0)" : "translateX(8px)", transition: "opacity 0.18s ease, transform 0.18s ease", whiteSpace: "nowrap", pointerEvents: "none" }}>{label}</span>
<span style={{ position: "relative", width: ICON_BOX, height: ICON_BOX, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
{recording ? (
<>
<svg width={ICON_BOX} height={ICON_BOX} viewBox={`0 0 ${ICON_BOX} ${ICON_BOX}`} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
<circle cx={ICON_BOX / 2} cy={ICON_BOX / 2} r={RING_R} fill="none" stroke={tokens.border} strokeWidth={2} />
<circle cx={ICON_BOX / 2} cy={ICON_BOX / 2} r={RING_R} fill="none" stroke={tokens.rec} strokeWidth={2} strokeLinecap="round" strokeDasharray={RING_C} style={{ animation: "dopsRecRing 60s linear infinite" }} />
</svg>
<span style={{ width: DOT, height: DOT, borderRadius: "50%", background: tokens.rec }} />
</>
) : (
<Mic size={22} color={tokens.textSecondary} strokeWidth={2} />
)}
</span>
</div>
);
}

// ─────────────────────────────────────────────────────────────
// 토글 스위치
// ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
return (
<div onClick={onChange} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
{label && <span style={{ fontSize: 12, color: tokens.textSecondary, fontWeight: 500 }}>{label}</span>}
<span style={{ width: 36, height: 20, borderRadius: 10, background: checked ? tokens.navy : tokens.borderStrong, position: "relative", transition: "background 0.2s ease", flexShrink: 0 }}>
<span style={{ position: "absolute", top: 2, left: checked ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
</span>
</div>
);
}

// ─────────────────────────────────────────────────────────────
// 액션 버튼
// ─────────────────────────────────────────────────────────────
const btnVariants = {
primary: { background: tokens.navy, color: "#FFFFFF", border: `1px solid ${tokens.navy}` },
outline: { background: "#FFFFFF", color: tokens.navy, border: `1px solid ${tokens.borderStrong}` },
ghost: { background: "#FFFFFF", color: tokens.textSecondary, border: `1px solid ${tokens.border}` },
danger: { background: "#FFFFFF", color: tokens.red, border: `1px solid ${tokens.border}` },
dangerSoft: { background: tokens.redSoftBg, color: tokens.redDeep, border: `1px solid ${tokens.redSoftBorder}` },
};

function ActionButton({ variant = "ghost", icon: Icon, children, onClick, block }) {
return (
<button onClick={onClick} style={{ height: 38, padding: "0 16px", borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: "inherit", display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined, alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", whiteSpace: "nowrap", ...btnVariants[variant] }}>
{Icon && <Icon size={15} strokeWidth={2} />}
{children}
</button>
);
}

// ─────────────────────────────────────────────────────────────
// 삭제 확인 모달 (mock)
// ─────────────────────────────────────────────────────────────
function DeleteModal({ onClose }) {
return (
<div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
<div onClick={(e) => e.stopPropagation()} style={{ width: 440, background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 20px 50px rgba(15,23,42,0.25)", display: "flex", flexDirection: "column", gap: 16 }}>
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<span style={{ width: 40, height: 40, borderRadius: 10, background: tokens.redSoftBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
<AlertTriangle size={20} color={tokens.redDeep} strokeWidth={2} />
</span>
<div style={{ fontSize: 16, fontWeight: 600, color: tokens.textPrimary }}>치료계획 삭제</div>
</div>
<p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: tokens.textSecondary }}>
선택한 치료계획과 포함된 항목·메모·동의 이력이 모두 삭제됩니다. 삭제 후에는 되돌릴 수 없습니다. 계속하시겠습니까?
</p>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
<ActionButton variant="ghost" onClick={onClose}>취소</ActionButton>
<ActionButton variant="dangerSoft" icon={Trash2} onClick={onClose}>삭제</ActionButton>
</div>
</div>
</div>
);
}

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// 금액 행 (셀) — extraStyle 로 상태별 flex/표시 제어
// ─────────────────────────────────────────────────────────────
function AmountRow({ label, value, onChange, readOnly, last, extraStyle, onBlur }) {
return (
<div style={{
      flex: 1, minHeight: 46,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      padding: "0 14px",
      background: readOnly ? tokens.bgBase : "#FFFFFF",
      borderBottom: last ? "none" : `1px solid ${tokens.border}`,
      ...extraStyle,
    }}>
<span style={{ fontSize: 13, color: tokens.textSecondary }}>{label}</span>
{readOnly ? (
<span style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary, fontVariantNumeric: "tabular-nums" }}>
{won(value)}<span style={{ fontSize: 12, fontWeight: 400, color: tokens.textMuted, marginLeft: 3 }}>원</span>
</span>
) : (
<span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
<input value={won(value)} onChange={(e) => onChange(parseNum(e.target.value))} onBlur={onBlur} inputMode="numeric" style={cellInput} />
<span style={{ fontSize: 12, color: tokens.textMuted }}>원</span>
</span>
)}
</div>
);
}

// ─────────────────────────────────────────────────────────────
// 치식 표기 (FDI) — 14열 x 2행 고정 좌표, 선택 치아만 일의자리 숫자
// 위행: 7654321 | 1234567 (좌상=Q2 / 우상=Q1)
// 아래행: 7654321 | 1234567 (좌하=Q3 / 우하=Q4)
// ─────────────────────────────────────────────────────────────
const TOOTH_CELL = 7;
const TOOTH_W = TOOTH_CELL * 14;
const TOOTH_H = TOOTH_CELL * 2;

function toothPos(fdi) {
const q = Math.floor(fdi / 10);
const p = fdi % 10;
const row = q === 1 || q === 2 ? 0 : 1; // 상악 / 하악
const col = q === 2 || q === 3 ? 7 - p : 6 + p; // 좌측(7→1) / 우측(1→7)
return { row, col };
}

function ToothNotation({ teeth = [], struck = [], dim }) {
return (
<div style={{ position: "relative", width: TOOTH_W, height: TOOTH_H, flexShrink: 0 }}>
{/* 가로 구분선 */}
<div style={{ position: "absolute", top: TOOTH_H / 2, left: 0, right: 0, height: 1, background: tokens.borderStrong }} />
{/* 세로 정중선 */}
<div style={{ position: "absolute", left: TOOTH_W / 2, top: 0, bottom: 0, width: 1, background: tokens.borderStrong }} />
{teeth.map((fdi) => {
const { row, col } = toothPos(fdi);
const isStruck = struck.includes(fdi);
return (
<span key={fdi} style={{
            position: "absolute", left: col * TOOTH_CELL, top: row * (TOOTH_H / 2),
            width: TOOTH_CELL, height: TOOTH_H / 2, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontVariantNumeric: "tabular-nums",
            color: isStruck || dim ? tokens.textMuted : tokens.textPrimary,
            textDecoration: isStruck ? "line-through" : "none",
          }}>
{fdi % 10}
</span>
);
})}
</div>
);
}

// ─────────────────────────────────────────────────────────────
// 치료계획 세부 list
// ─────────────────────────────────────────────────────────────
const LIST_COLS = "28px " + TOOTH_W + "px 1.3fr 116px 1.7fr 56px 32px";

// ─────────────────────────────────────────────────────────────
// 치료계획 데이터 — 한 환자가 여러 계획을 가짐 (계획 자체는 이 모듈 외부에서 치과의사가 작성)
// 좌측 탭 A = 계획 목록 / 우측 패널 C = 선택된 계획의 세부 내역
// ─────────────────────────────────────────────────────────────
// status = 계획 전체 상태 (작성중·상담완료·진행·완료·계획취소·중단) — 항목 status와 별개 축
const INITIAL_PLANS = [
  {
    // 작성중 — 아직 환자에게 제시 전, 안에서 만들어지는 중
    id: "p1", title: "충치·보철 추가", date: "2026-06-04",
    doctor: "황인하", staff: "", sigStatus: "미서명", sigDate: "",
    status: "작성중", discount: 0,
    lines: [
      { teeth: [36], proc: "인레이", sub: "골드 인레이", memo: "", amount: 450000, status: "예정" },
      { teeth: [46], proc: "크라운", sub: "지르코니아 크라운", memo: "", amount: 550000, status: "예정" },
      { teeth: [25], proc: "레진", sub: "구치부 레진", memo: "보험 적용", amountText: "보험본인부담", status: "예정" },
    ],
  },
  {
    // 진행 — 환자가 하기로 함 + 실제 치료 중 (항목 상태가 완료/진행중/예정 섞임)
    id: "p2", title: "임플란트 종합 재건", date: "2026-05-20",
    doctor: "황인하", staff: "박지민", sigStatus: "재서명", sigDate: "2026-05-20",
    status: "진행", discount: 200000,
    lines: [
      { teeth: [24, 25, 16], proc: "발치", sub: "", memo: "#22 #37 #47\nMissing tooth", amountText: "보험본인부담", status: "완료", struck: [24, 25, 16] },
      { teeth: [36, 35], proc: "골이식", sub: "복잡 뼈이식", memo: "치당 50만씩 100만 → 50만\n-50만 DC", amount: 500000, status: "완료" },
      { teeth: [16], proc: "상악동", sub: "Crestal", memo: "", amount: 500000, status: "완료" },
      { teeth: [16], proc: "임플란트", sub: "원가이드 IMP", memo: "50만 → 0만\n-50만 DC", amount: 0, status: "진행중" },
      { teeth: [46, 47], proc: "골이식", sub: "단순 뼈이식", memo: "치당 30만씩 120만 → 60만\n-60만 DC", amount: 600000, status: "진행중" },
      { teeth: [12, 11, 21, 23], proc: "크라운", sub: "지르코니아 (전치부)", memo: "치당 55만씩 220만 → 200만\n-20만 DC", amount: 2000000, status: "예정" },
      { teeth: [], proc: "보철 추가", sub: "폰틱 / 재제작", memo: "55만 → 50만", amount: 500000, status: "예정" },
      { teeth: [26, 27], proc: "크라운", sub: "지르코니아 (구치부)", memo: "치당 50만씩 150만 → 135만\n-15만 DC\nG 60만", amount: 1350000, status: "예정" },
    ],
  },
  {
    // 완료 — 묶인 시술이 전부 종료 (명시적으로 닫음)
    id: "p3", title: "우측 구치부 보존", date: "2026-03-23",
    doctor: "황인하", staff: "최수아", sigStatus: "완료", sigDate: "2026-03-23",
    status: "완료", discount: 0,
    lines: [
      { teeth: [44, 14], proc: "신경치료", sub: "MTA", memo: "불편감 지속 시\nEndo 완료", amount: 300000, status: "완료" },
      { teeth: [44], proc: "인레이", sub: "E-max In", memo: "G 40만", amount: 300000, status: "완료" },
      { teeth: [15], proc: "인레이", sub: "골드 인레이", memo: "", amount: 450000, status: "완료" },
    ],
  },
  {
    // 계획취소 — 상담 후 환자가 안 하기로 (시작 전 이탈). 트랙 없이 단일 배지
    id: "p4", title: "상악 심미 보철 상담", date: "2026-02-10",
    doctor: "김도윤", staff: "정하늘", sigStatus: "미서명", sigDate: "",
    status: "계획취소", discount: 0,
    lines: [
      { teeth: [11, 21], proc: "크라운", sub: "지르코니아 크라운", memo: "비용 부담으로 결정 보류 후 취소", amount: 1100000, status: "예정" },
      { teeth: [12, 22], proc: "브릿지", sub: "3-unit 지르코니아", memo: "", amount: 1500000, status: "예정" },
    ],
  },
  {
    // 중단 — 진행 중 환자가 그만둠 (일부 진행 + 미정산 가능). 트랙 없이 단일 배지
    id: "p5", title: "하악 임플란트", date: "2025-11-15",
    doctor: "황인하", staff: "박지민", sigStatus: "완료", sigDate: "2025-11-15",
    status: "중단", discount: 100000,
    lines: [
      { teeth: [46], proc: "발치", sub: "", memo: "", amountText: "보험본인부담", status: "완료", struck: [46] },
      { teeth: [46], proc: "골이식", sub: "단순 뼈이식", memo: "", amount: 600000, status: "완료" },
      { teeth: [46], proc: "임플란트", sub: "오스템 임플란트", memo: "환자 내원 중단 — 미수금 발생", amount: 1300000, status: "예정" },
    ],
  },
];

// 한 계획의 치료비 합계 (보류·보험본인부담 제외, 자동 합산)
const planTotal = (plan) =>
  plan.lines.reduce((s, l) => s + ((l.status === "보류" || l.amountText) ? 0 : (Number.isFinite(l.amount) ? l.amount : 0)), 0);
// 계획 행 요약 — 보류 아닌 시술명 중복 제거, 최대 3건 + "외 N건"
const planProcSummary = (plan) => {
  const procs = [...new Set(plan.lines.filter((l) => l.status !== "보류" && l.proc).map((l) => l.proc))];
  if (procs.length <= 3) return procs.join(" · ");
  return procs.slice(0, 3).join(" · ") + " 외 " + (procs.length - 3) + "건";
};

// 시술명별 세부옵션 후보 (하드코딩)
const PROC_OPTIONS = {
"크라운": ["지르코니아 크라운", "골드크라운", "PFM 크라운", "E-max 크라운"],
"인레이": ["E-max 인레이", "골드 인레이", "레진 인레이"],
"임플란트": ["오스템 임플란트", "메가젠 임플란트", "스트라우만 임플란트", "덴티움 임플란트"],
"골이식": ["복잡 뼈이식", "단순 뼈이식", "상악동 거상"],
"상악동": ["Crestal", "Lateral"],
"보철 추가": ["폰틱", "재제작"],
"신경치료": ["MTA", "근관치료", "재근관치료"],
"발치": [],
"레진": ["전치부 레진", "구치부 레진", "급여 레진"],
"브릿지": ["3-unit 지르코니아", "3-unit PFM"],
"스케일링": ["전악 치석제거", "치주 스케일링"],
"치주치료": ["치석제거(SRP)", "치주소파술"],
};

// 항목 추가 팔레트 — 버튼 클릭 시 선택된 계획에 해당 시술 항목이 추가된다 (좌측 탭 B열)
const ADD_CATALOG = [
{ group: "보험진료", items: ["발치", "신경치료", "SC", "치주치료"] },
{ group: "보존", items: ["레진", "CA", "VPT"] },
{ group: "보철", items: ["인레이", "크라운", "브릿지", "포스트", "레진코어"] },
{ group: "임플란트", items: ["임플란트", "뼈이식(간단)", "뼈이식(복잡)", "상악동(간단)", "상악동(복잡)"] },
{ group: "틀니", items: ["틀니", "틀니 수리", "스플린트", "이갈이장치"] },
{ group: "소아", items: ["SS크라운", "BLSM", "실란트", "불소도포(1회)", "불소도포 패키지"] },
{ group: "심미", items: ["라미네이트", "미백", "distema", "보톡스"] },
{ group: "기타", items: ["턱관절치료", "수면치료"] },
];

// 세부옵션 셀 — 클릭 시 popover로 옵션 교체 (시술명은 변경 불가)
function SubOptionCell({ proc, sub, setSub, dim }) {
const [open, setOpen] = useState(false);
const [dropUp, setDropUp] = useState(false);
const triggerRef = useRef(null);
const options = PROC_OPTIONS[proc] || [];

if (options.length === 0) {
return sub ? <span style={{ fontSize: 12, color: dim ? tokens.textMuted : tokens.textSecondary }}>{sub}</span> : null;
}

const toggle = () => {
if (!open && triggerRef.current) {
const rect = triggerRef.current.getBoundingClientRect();
const scroller = triggerRef.current.closest("[data-scroll]");
const top = scroller ? scroller.getBoundingClientRect().top : 0;
const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
const estH = options.length * 30 + 12; // popover 예상 높이
const below = bottom - rect.bottom; // 셀 아래 남은 공간
const above = rect.top - top; // 셀 위 남은 공간
setDropUp(below < estH && above > below); // 아래 부족하고 위가 더 넓으면 위로
}
setOpen((o) => !o);
};

return (
<div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
<span
ref={triggerRef}
onClick={toggle}
style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, color: dim ? tokens.textMuted : (sub ? tokens.textSecondary : tokens.textMuted), cursor: "pointer" }} >
{sub || "옵션 선택"}
<ChevronDown size={12} color={tokens.textMuted} />
</span>
{open && (
<>
<div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
<div style={{
            position: "absolute", left: 0, minWidth: 170,
            ...(dropUp ? { bottom: "calc(100% + 4px)" } : { top: "calc(100% + 4px)" }),
            background: "#FFFFFF", border: `1px solid ${tokens.border}`, borderRadius: 8,
            boxShadow: "0 6px 20px rgba(15,23,42,0.15)", padding: 4, zIndex: 50,
          }}>
{options.map((opt) => (
<div
key={opt}
className="dops-opt"
onClick={() => { setSub(opt); setOpen(false); }}
style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 10px", borderRadius: 5, fontSize: 12, color: tokens.textPrimary, cursor: "pointer", whiteSpace: "nowrap" }} >
{opt}
{opt === sub && <Check size={13} color={tokens.teal} strokeWidth={2.5} />}
</div>
))}
</div>
</>
)}
</div>
);
}

function InlineSelect({ label, value, onChange, children }) {
return (
<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
<span style={{ fontSize: 12, fontWeight: 600, color: tokens.textSecondary, whiteSpace: "nowrap" }}>{label}</span>
<select className="dops-select" value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>{children}</select>
</label>
);
}

function InfoTooltip({ text }) {
const [show, setShow] = useState(false);
return (
<span
onMouseEnter={() => setShow(true)}
onMouseLeave={() => setShow(false)}
style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "help" }} >
<Info size={13} color={tokens.textMuted} />
{show && (
<span style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: "#FFFFFF", color: tokens.textSecondary, border: `1px solid ${tokens.borderStrong}`,
          fontSize: 11, fontWeight: 400, lineHeight: 1.6, whiteSpace: "pre",
          padding: "7px 11px", borderRadius: 6,
          boxShadow: "0 4px 14px rgba(15,23,42,0.12)", zIndex: 60, pointerEvents: "none",
        }}>
{text}
</span>
)}
</span>
);
}

function SignatureBadge({ status, date, onClick }) {
const map = {
"미서명": { bg: tokens.bgBase, color: tokens.textMuted, border: tokens.border, label: "서명 전" },
"완료": { bg: "#ECFDF5", color: tokens.teal, border: "#A7F3D0", label: `서명 ${date}` },
"재서명": { bg: "#FFFBEB", color: tokens.amber, border: "#FDE68A", label: "서명 갱신 필요" },
};
const c = map[status] || map["미서명"];
return (
<span onClick={onClick} style={{ fontSize: 12, fontWeight: 600, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, padding: "3px 10px", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", cursor: onClick ? "pointer" : "default", userSelect: "none" }}>
{c.label}
</span>
);
}

function StatusBadge({ status, onClick }) {
const map = {
"예정": { bg: tokens.bgBase, color: tokens.textSecondary, border: tokens.border },
"보류": { bg: tokens.bgBase, color: tokens.textMuted, border: tokens.borderStrong },
"완료": { bg: "#ECFDF5", color: tokens.teal, border: "#A7F3D0" },
"진행중": { bg: "#EFF6FF", color: tokens.navy, border: "#BFDBFE" },
};
const c = map[status];
if (!c) return null;
return (
<span onClick={onClick} style={{ fontSize: 11, fontWeight: 600, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 4, padding: "1px 6px", whiteSpace: "nowrap", cursor: onClick ? "pointer" : "default", userSelect: "none" }}>
{status}
</span>
);
}

function TreatmentLine({ line }) {
const [status, setStatus] = useState(line.status);
const held = status === "보류";
const [sub, setSub] = useState(line.sub);
const [memo, setMemo] = useState(line.memo);
const [editing, setEditing] = useState(false);
const taRef = useRef(null);

// 금액 — 비급여만 편집(만원 단위 입력 / 원 전체 표시), 보험본인부담은 고정 텍스트
const isInsurance = !!line.amountText;
const [amount, setAmount] = useState(line.amount ?? 0); // 원 단위로 보관
const [editingAmt, setEditingAmt] = useState(false);
const manwon = Math.round(amount / 10000); // 입력 표시용 만원 단위

// 내용 높이에 맞춰 textarea 높이 고정 (읽기/편집 동일 박스 → 전환 시 점프 없음)
const fit = () => {
const el = taRef.current;
if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
};
useEffect(() => { fit(); }, [memo]);

return (
<div style={{
      display: "grid", gridTemplateColumns: LIST_COLS, alignItems: "center", gap: 10,
      padding: "10px 12px", borderBottom: `1px solid ${tokens.border}`,
    }}>
{/* 드래그 핸들 */}
<span style={{ display: "flex", justifyContent: "center", color: tokens.textMuted, cursor: "grab" }}>
<GripVertical size={16} />
</span>
{/* 치식 */}
<ToothNotation teeth={line.teeth} struck={line.struck || []} dim={held} />
{/* 치료계획 (시술명 + 세부옵션 2단) */}
<div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
<span style={{ fontSize: 13, fontWeight: 600, color: held ? tokens.textMuted : tokens.textPrimary }}>{line.proc}</span>
<SubOptionCell proc={line.proc} sub={sub} setSub={setSub} dim={held} />
</div>
{/* 금액 (비급여: 만원 입력 / 원 표시, 보험본인부담: 고정 텍스트) */}
{isInsurance ? (
<span style={{ textAlign: "right", fontSize: 12, fontWeight: 500, color: tokens.textMuted }}>{line.amountText}</span>
) : (
<div
onClick={() => !editingAmt && setEditingAmt(true)}
onContextMenu={(e) => { e.preventDefault(); setAmount(0); setEditingAmt(true); }}
style={{
            position: "relative", minWidth: 0, alignSelf: "stretch", display: "flex", alignItems: "center", justifyContent: "flex-end",
            marginTop: -10, marginBottom: -10, paddingTop: 10, paddingBottom: 10,
            background: editingAmt ? tokens.bgBase : "transparent",
            transition: "background 0.15s ease",
          }} >
{editingAmt ? (
<span style={{ display: "inline-flex", alignItems: "baseline", gap: 3 }}>
<input
value={manwon}
autoFocus
inputMode="numeric"
onChange={(e) => { setAmount(parseNum(e.target.value) * 10000); }}
onBlur={() => setEditingAmt(false)}
style={{ width: 64, textAlign: "right", border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 600, fontFamily: "inherit", color: tokens.textPrimary, fontVariantNumeric: "tabular-nums", padding: 0 }}
/>
<span style={{ fontSize: 11, fontWeight: 400, color: tokens.textMuted }}>만원</span>
</span>
) : (
<span style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: held ? tokens.textMuted : tokens.textPrimary, fontVariantNumeric: "tabular-nums", textDecoration: held ? "line-through" : "none", cursor: "pointer" }}>
{won(amount)}<span style={{ fontSize: 11, fontWeight: 400, color: tokens.textMuted, marginLeft: 3 }}>원</span>
</span>
)}
</div>
)}
{/* 메모 (읽기/편집 동일 textarea, 배경은 stretch 셀이 담당 → cell width·height 단절 없이 채움) */}
<div
onClick={() => !editing && setEditing(true)}
style={{
          position: "relative", minWidth: 0, alignSelf: "stretch", display: "flex",
          marginTop: -10, marginBottom: -10,   // row 세로 padding(10) 영역까지 배경 확장
          paddingTop: 10, paddingBottom: 10,    // 콘텐츠 위치는 그대로 유지
          background: editing ? tokens.bgBase : "transparent",
          transition: "background 0.15s ease",
        }} >
<textarea
ref={taRef}
value={memo}
readOnly={!editing}
placeholder="메모 추가"
onChange={(e) => { setMemo(e.target.value); fit(); }}
onBlur={() => setEditing(false)}
style={{ width: "100%", boxSizing: "border-box", border: "none", outline: "none", background: "transparent", resize: "none", overflow: "hidden", padding: 0, margin: 0, fontSize: 12, lineHeight: 1.4, fontFamily: "inherit", color: held ? tokens.textMuted : (memo ? tokens.textSecondary : tokens.textMuted), cursor: editing ? "text" : "pointer", alignSelf: "flex-start" }}
/>
</div>
{/* 상태 (클릭 → 예정 ↔ 보류 토글) */}
<span style={{ display: "flex", justifyContent: "center" }}>
<StatusBadge status={status} onClick={(e) => { e.stopPropagation(); setStatus((p) => (p === "보류" ? "예정" : "보류")); }} />
</span>
{/* 삭제 */}
<span style={{ display: "flex", justifyContent: "center", color: tokens.textMuted, cursor: "pointer" }}>
<Trash2 size={15} />
</span>
</div>
);
}

function TreatmentList({ lines, planId, onAddBlank }) {
return (
<div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", border: `1px solid ${tokens.border}`, borderRadius: 8, overflow: "hidden", minHeight: 0 }}>
{/* 헤더 */}
<div style={{
        display: "grid", gridTemplateColumns: LIST_COLS, alignItems: "center", gap: 10,
        padding: "8px 12px", background: tokens.bgBase, borderBottom: `1px solid ${tokens.border}`,
        fontSize: 11, fontWeight: 600, color: tokens.textMuted, flexShrink: 0,
      }}>
<span />
<span style={{ textAlign: "center" }}>치식</span>
<span>치료계획</span>
<span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
금액
<InfoTooltip text={"우클릭하면 0원부터 새로 입력할 수 있어요\n금액은 만원 단위로 적어주세요"} />
</span>
<span>메모</span>
<span style={{ textAlign: "center" }}>상태</span>
<span />
</div>
{/* 스크롤 바디 */}
<div data-scroll style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
{lines.map((line, i) => <TreatmentLine key={planId + "-" + i} line={line} />)}
{/* 항목 추가 placeholder (항상 목록 맨 아래) */}
<div
onClick={onAddBlank}
className="dops-opt"
style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 54, color: tokens.textMuted, fontSize: 13, cursor: "pointer" }} >
<Plus size={15} strokeWidth={2} /> 새 치료 항목 추가
</div>
</div>
</div>
);
}

// ─────────────────────────────────────────────────────────────
// 메타데이터 카드 (patientMode: 환자에게 보기 → 할인액 숨김)
// ─────────────────────────────────────────────────────────────
function MetadataPanel({ patientMode, setPatientMode, total, vat, initialDiscount }) {
const [memo, setMemo] = useState("");

const base = total + vat;
const [discount, setDiscount] = useState(initialDiscount || 0);
const contract = base - discount;                 // 계약금액 = (합계+부가세) − 할인 (파생값, 합계 변동 시 자동 반영)
const onDiscount = (d) => setDiscount(d);
const onContract = (c) => setDiscount(base - c);

const rowDivider = `1px solid ${tokens.border}`;

return (
<div style={{ display: "flex", border: `1px solid ${tokens.border}`, borderRadius: 8, overflow: "hidden", background: "#FFFFFF" }}>
{/* 좌측 컬럼 (메모) */}
<div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: rowDivider, minWidth: 0 }}>
<div style={{ flex: 1, position: "relative", padding: "12px 14px", minHeight: 96 }}>
<textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="계획 전체 메모" style={cellTextarea} />
</div>
</div>

      {/* 우측 컬럼 (금액) */}
      <div style={{ width: TABLE_W, flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <AmountRow label="치료비 합계" value={total} readOnly extraStyle={{ flex: "none", height: 46 }} />
        <AmountRow label="부가가치세" value={vat} readOnly extraStyle={{ flex: "none", height: 46 }} />
        <AmountRow
          label="할인액" value={discount} onChange={onDiscount}
          extraStyle={{
            flex: "none",
            height: patientMode ? 0 : 46,
            minHeight: 0,
            opacity: patientMode ? 0 : 1,
            paddingTop: 0, paddingBottom: 0,
            overflow: "hidden",
            borderBottom: patientMode ? "none" : `1px solid ${tokens.border}`,
            transition: "height 0.3s ease, opacity 0.2s ease",
          }}
        />
        <AmountRow
          label="계약금액" value={contract} onChange={onContract} last
          onBlur={() => { if (discount > 0) setPatientMode(false); }}
          extraStyle={{ flex: "none", height: patientMode ? 92 : 46, transition: "height 0.3s ease" }}
        />
      </div>
    </div>

);
}

// ─────────────────────────────────────────────────────────────
// 우측 영역
// ─────────────────────────────────────────────────────────────
const placeholderStyle = {
border: `1px dashed ${tokens.borderStrong}`, borderRadius: 8, background: "#FFFFFF",
display: "flex", alignItems: "center", justifyContent: "center", color: tokens.textMuted, fontSize: 13,
};

const SIG_CYCLE = ["미서명", "완료", "재서명"];

// C 헤더 인쇄 아이콘 메뉴 — 클릭 시 출력물 종류 드롭다운
const PRINT_DOCS = ["치료계획서", "견적서", "동의서"];
function PrintMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen((o) => !o)} aria-label="인쇄" className="dops-newplan"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: "none", color: tokens.textSecondary, borderRadius: 6, cursor: "pointer", padding: 0 }}>
        <Printer size={18} strokeWidth={2} />
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", minWidth: 184, background: "#FFFFFF", border: `1px solid ${tokens.border}`, borderRadius: 8, boxShadow: "0 6px 20px rgba(15,23,42,0.15)", padding: 4, zIndex: 50 }}>
            {PRINT_DOCS.map((d) => (
              <div key={d} className="dops-opt" onClick={() => setOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 5, fontSize: 13, color: tokens.textPrimary, cursor: "pointer", whiteSpace: "nowrap" }}>
                <Printer size={14} color={tokens.textMuted} /> {d} 인쇄
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RightPanel({ plan, lines, onAddBlank, onDelete }) {
const [patientMode, setPatientMode] = useState(false);
const [doctor, setDoctor] = useState(plan.doctor);
const [staff, setStaff] = useState(plan.staff);
const [sigStatus, setSigStatus] = useState(plan.sigStatus);
const cycleSig = () => setSigStatus((s) => SIG_CYCLE[(SIG_CYCLE.indexOf(s) + 1) % SIG_CYCLE.length]);
const total = planTotal(plan);
const vat = 0;                                     // 비급여 진료는 면세가 일반적 — 행은 유지(읽기전용)
return (
<section style={{ flex: RIGHT_FLEX, minWidth: 0, background: tokens.bgRight, display: "flex", flexDirection: "column", padding: 16, gap: 16, minHeight: 0 }}>
{/* 헤더 bar + 세부 list (작은 간격으로 붙임) */}
<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minHeight: 0 }}>
{/* 얇은 bar (카드 제거, 투명 배경, 우측 정렬) */}
<div style={{ height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "0 4px" }}>
{/* 좌: 계획 귀속 정보 */}
<div style={{ display: "flex", alignItems: "center", gap: 32 }}>
<InlineSelect label="담당의사" value={doctor} onChange={setDoctor}>
<option value="황인하">황인하</option>
<option value="김도윤">김도윤</option>
<option value="이서진">이서진</option>
</InlineSelect>
<InlineSelect label="상담직원" value={staff} onChange={setStaff}>
<option value="" disabled>선택</option>
<option value="박지민">박지민</option>
<option value="최수아">최수아</option>
<option value="정하늘">정하늘</option>
</InlineSelect>
<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
<span style={{ fontSize: 12, fontWeight: 600, color: tokens.textSecondary, whiteSpace: "nowrap" }}>상담일</span>
<span style={{ fontSize: 13, fontWeight: 500, color: tokens.textPrimary, fontVariantNumeric: "tabular-nums" }}>{plan.date}</span>
</div>
</div>
{/* 우: 상태 · 도구 */}
<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
<SignatureBadge status={sigStatus} date={plan.sigDate} onClick={cycleSig} />
<RecordButton />
<Toggle checked={patientMode} onChange={() => setPatientMode((v) => !v)} />
<PrintMenu />
</div>
</div>
{/* 세부 list */}
<TreatmentList lines={lines} planId={plan.id} onAddBlank={onAddBlank} />
</div>

      {/* 하단 — 메타데이터 / 버튼 그룹 */}
      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <MetadataPanel patientMode={patientMode} setPatientMode={setPatientMode} total={total} vat={vat} initialDiscount={plan.discount} />
        </div>
        <div style={{ width: BTN_GROUP_W, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <ActionButton block variant="primary" icon={Check}>치료계획 확정</ActionButton>
          <ActionButton block variant="outline" icon={PenLine}>환자 서명</ActionButton>
          <ActionButton block variant="ghost" icon={ClipboardCheck}>상담 완료로 변경</ActionButton>
          <ActionButton block variant="danger" icon={Trash2} onClick={onDelete}>삭제</ActionButton>
        </div>
      </div>
    </section>

);
}

// ─────────────────────────────────────────────────────────────
// 좌측 "치료계획" 탭 — A(계획 목록) | B(항목 추가 팔레트)
//  계획 선택 → 우측 패널 C(세부 내역)에 로드 / B 버튼 → 선택 계획에 항목 추가
// ─────────────────────────────────────────────────────────────

// ── 계획 전체 상태 (항목 상태와 별개 축) ──────────────────────
// 정상 4트랙 = 작성중 → 상담완료 → 진행 → 완료. 계획취소·중단은 곁가지(트랙에서 제외).
// 색 의미: 작성중·상담완료=중립 / 진행=활성 / 완료=긍정 / 계획취소·중단=주의(오류·위험 아님)
const MAIN_TRACK = ["작성중", "상담완료", "진행", "완료"];
const PLAN_STATUS_COLOR = {
  "작성중":   { bg: tokens.bgBase, color: tokens.textSecondary, border: tokens.border },
  "상담완료": { bg: tokens.bgBase, color: tokens.textSecondary, border: tokens.borderStrong },
  "진행":     { bg: "#EFF6FF", color: tokens.navy, border: "#BFDBFE" },
  "완료":     { bg: "#ECFDF5", color: tokens.teal, border: "#A7F3D0" },
  "계획취소": { bg: "#FFFBEB", color: tokens.amber, border: "#FDE68A" },
  "중단":     { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
};

function PlanStatusBadge({ status }) {
  const c = PLAN_STATUS_COLOR[status] || PLAN_STATUS_COLOR["작성중"];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 5, padding: "2px 8px", whiteSpace: "nowrap", lineHeight: 1.5 }}>
      {status}
    </span>
  );
}

// 메인 4트랙 모두 표시(비현재는 dim) + 현재 상태만 색상 배지. 계획취소·중단이면 트랙 제거하고 단일 배지만.
function PlanStatusTrack({ status }) {
  if (status === "계획취소" || status === "중단") {
    return <PlanStatusBadge status={status} />;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {MAIN_TRACK.map((s) => (
        s === status
          ? <PlanStatusBadge key={s} status={s} />
          : <span key={s} style={{ fontSize: 11, fontWeight: 500, color: tokens.textMuted }}>{s}</span>
      ))}
    </div>
  );
}

// A열 — 이 환자의 치료계획 목록 + 새 계획
function PlanListColumn({ plans, selectedId, onSelect, onAddPlan }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", borderRight: `1px solid ${tokens.border}`, minHeight: 0 }}>
      {/* 헤더 */}
      <div style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", borderBottom: `1px solid ${tokens.border}` }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary }}>
          치료계획 <span style={{ color: tokens.textMuted, fontWeight: 600 }}>{plans.length}</span>
        </span>
        <button onClick={onAddPlan} className="dops-newplan" style={{ display: "inline-flex", alignItems: "center", gap: 4, border: "none", color: tokens.navy, fontSize: 12, fontWeight: 600, fontFamily: "inherit", padding: "5px 10px", borderRadius: 6, cursor: "pointer" }}>
          <Plus size={13} strokeWidth={2.4} /> 새 계획
        </button>
      </div>
      {/* 목록 (세로 스크롤) */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {plans.map((p) => {
          const sel = p.id === selectedId;
          const procs = planProcSummary(p);
          return (
            <div key={p.id} onClick={() => onSelect(p.id)} className={sel ? "" : "dops-planrow"}
              style={{ position: "relative", padding: "13px 16px", cursor: "pointer", borderBottom: `1px solid ${tokens.border}`, background: sel ? "#F0F8F6" : "transparent" }}>
              {sel && <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: tokens.teal }} />}
              {/* 1행: 날짜(타이틀) + 총액 */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: tokens.textPrimary, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{p.date}</div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: tokens.textPrimary, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  {won(planTotal(p))}<span style={{ fontSize: 11, fontWeight: 400, color: tokens.textMuted, marginLeft: 2 }}>원</span>
                </span>
              </div>
              {/* 2행: 계획 상태 트랙 (작성중·상담완료·진행·완료 / 이탈 시 단일 배지) */}
              <div style={{ marginTop: 8 }}>
                <PlanStatusTrack status={p.status} />
              </div>
              {/* 3행: 시술 요약 + 서명 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: tokens.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{procs}</div>
                <SignatureBadge status={p.sigStatus} date={p.sigDate} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 항목 메뉴 설정 모달 (개발용 placeholder)
function ItemMenuSettingsModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 420, background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 20px 50px rgba(15,23,42,0.25)", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 10, background: tokens.bgBase, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Settings size={20} color={tokens.navy} strokeWidth={2} />
          </span>
          <div style={{ fontSize: 16, fontWeight: 600, color: tokens.textPrimary }}>항목 메뉴 설정</div>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: tokens.textSecondary }}>항목 메뉴 설정 modal 진입</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ActionButton variant="primary" onClick={onClose}>확인</ActionButton>
        </div>
      </div>
    </div>
  );
}

// 항목 추가 시 치식 선택 게이트 (개발용 placeholder — 실제로는 치식선택기가 먼저 뜸)
function ToothPickerModal({ proc, onConfirm, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 420, background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 20px 50px rgba(15,23,42,0.25)", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: tokens.textPrimary }}>치식 선택{proc ? ` · ${proc}` : ""}</div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: tokens.textSecondary }}>치식선택기에서 치식 선택 필수</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ActionButton variant="primary" onClick={onConfirm}>확인</ActionButton>
        </div>
      </div>
    </div>
  );
}

// B열 — 항목 추가 팔레트 (시술별 버튼). 버튼 클릭 → 치식선택기(게이트) → 확인 시 선택 계획에 항목 추가(우측 C에 반영)
function AddItemPalette({ onAddItem }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingProc, setPendingProc] = useState(null);
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: tokens.bgBase, minHeight: 0 }}>
      <div style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: `1px solid ${tokens.border}` }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary }}>항목 추가</span>
        <InfoTooltip text={"버튼을 누르면 선택한 계획의\n세부 내역(오른쪽)에 항목이 추가됩니다."} />
        <button onClick={() => setSettingsOpen(true)} className="dops-newplan" aria-label="항목 메뉴 설정"
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, border: "none", color: tokens.textMuted, borderRadius: 6, cursor: "pointer", padding: 0 }}>
          <Settings size={16} strokeWidth={2} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "12px 12px 8px" }}>
        {ADD_CATALOG.map((g) => (
          <div key={g.group} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.textMuted, letterSpacing: 0.4, marginBottom: 7, paddingLeft: 2 }}>{g.group}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {g.items.map((name) => (
                <button key={name} onClick={() => setPendingProc(name)} className="dops-addbtn"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${tokens.border}`, background: "#FFFFFF", color: tokens.textPrimary, fontSize: 12.5, fontWeight: 500, fontFamily: "inherit", padding: "7px 11px", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>
                  <Plus size={12} strokeWidth={2.2} color={tokens.teal} /> {name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {settingsOpen && <ItemMenuSettingsModal onClose={() => setSettingsOpen(false)} />}
      {pendingProc && <ToothPickerModal proc={pendingProc} onConfirm={() => { onAddItem(pendingProc); setPendingProc(null); }} onClose={() => setPendingProc(null)} />}
    </div>
  );
}

function TreatmentPlanTab({ plans, selectedId, onSelect, onAddPlan, onAddItem }) {
  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      <PlanListColumn plans={plans} selectedId={selectedId} onSelect={onSelect} onAddPlan={onAddPlan} />
      <AddItemPalette onAddItem={onAddItem} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 사진보기 — 간단한 임상사진 뷰어 (검정 배경, 메인 이미지 + 하단 썸네일 좌우 스크롤)
//   원본: public/images/<name> · 썸네일: public/images/thumb/<name>
// ──────────────────────────────────────────────────────────────
const PHOTO_FILES = [
  "20231007_123040.jpg", "20231007_123537.jpg", "20231007_123538.jpg", "20231007_123742.jpg", "20231007_123743.jpg",
  "20231007_131850.jpg", "20231007_131851.jpg", "20231007_131853.jpg", "20231007_190750.jpg", "20231012_192253.jpg",
  "20231012_192254.jpg", "20231013_175910.jpg", "20231013_175949.jpg", "20231019_191035.jpg", "20231026_191957.jpg",
  "20231026_191958.jpg", "20231026_191959.jpg", "20231026_192000.jpg", "20231026_192001.jpg", "20231026_192002.jpg",
  "20231026_192003.jpg", "20231026_192004.jpg", "20231026_192005.jpg", "20231026_192006.jpg", "20231102_191619.jpg",
  "20231102_191620.jpg", "20231102_191621.jpg", "20240401_151942.jpg", "20240525_100209.jpg", "20240525_100605.jpg",
  "20240525_100606.jpg", "20250315_100623.jpg", "20250315_100952.jpg", "20250315_102039.jpg", "20250315_102854.jpg",
  "20250315_102855.jpg", "20250315_103325.jpg", "20250319_163826.jpg", "20251014_163100.jpg",
];
const photoSrc = (n) => `${import.meta.env.BASE_URL}images/${n}`;
const thumbSrc = (n) => `${import.meta.env.BASE_URL}images/thumb/${n}`;

function PhotoViewerTab() {
  const [idx, setIdx] = useState(0);
  const stripRef = useRef(null);
  // 세로 휠 → 가로 스크롤 (passive:false 로 페이지 스크롤 방지)
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  return (
    <div style={{ height: "100%", width: "100%", minWidth: 0, display: "flex", flexDirection: "column", background: "#000", minHeight: 0 }}>
      {/* 메인 이미지 */}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src={photoSrc(PHOTO_FILES[idx])} alt={PHOTO_FILES[idx]} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
      </div>
      {/* 썸네일 푸터 (좌우 스크롤) */}
      <div ref={stripRef} className="dops-thumbs" style={{ flexShrink: 0, minWidth: 0, display: "flex", alignItems: "center", gap: 8, overflowX: "auto", overflowY: "hidden", padding: "13px 12px", background: "#0A0A0A", borderTop: "1px solid #1F1F1F" }}>
        {PHOTO_FILES.map((n, i) => (
          <button key={n} onClick={() => setIdx(i)} title={n}
            style={{ flexShrink: 0, width: 124, height: 88, padding: 0, border: i === idx ? `2px solid ${tokens.teal}` : "2px solid transparent", borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "#000", opacity: i === idx ? 1 : 0.55 }}>
            <img src={thumbSrc(n)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 좌측 영역 — 탭 구성
// ─────────────────────────────────────────────────────────────
const LEFT_TABS = ["치료계획", "사진보기", "치아보험", "상담내역", "치료사례"];

function LeftPanel({ plans, selectedId, onSelect, onAddPlan, onAddItem }) {
const [activeTab, setActiveTab] = useState("치료계획");
return (
<section style={{ flex: LEFT_FLEX, minWidth: 0, background: tokens.bgLeft, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
{/* 탭 바 */}
<div style={{ height: 44, flexShrink: 0, display: "flex", alignItems: "stretch", borderBottom: `1px solid ${tokens.border}`, paddingLeft: 8 }}>
{LEFT_TABS.map((tab) => {
const active = tab === activeTab;
return (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className="dops-tab"
style={{
                position: "relative", border: "none", background: "transparent",
                fontFamily: "inherit", fontSize: 13, fontWeight: active ? 600 : 500,
                color: active ? tokens.navy : tokens.textMuted,
                padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap",
              }} >
{tab}
{active && <span style={{ position: "absolute", left: 12, right: 12, bottom: -1, height: 2, background: tokens.navy, borderRadius: 1 }} />}
</button>
);
})}
</div>
{/* 본문 */}
<div style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden" }}>
{activeTab === "치료계획" ? (
<TreatmentPlanTab plans={plans} selectedId={selectedId} onSelect={onSelect} onAddPlan={onAddPlan} onAddItem={onAddItem} />
) : activeTab === "상담내역" ? <ConsultationTab />
: activeTab === "사진보기" ? <PhotoViewerTab /> : null}
</div>
</section>
);
}

// ──────────────────────────────────────────────────────────────
// 상담내역 리스트/상세 — 편집 가능한 HTML 파일(consult-list.html / consult-detail.html)을 iframe srcDoc으로 렌더
// ──────────────────────────────────────────────────────────────

function ConsultationTab() {
const [view, setView] = useState("list");
useEffect(() => {
const onMsg = (e) => {
const d = e.data;
if (!d || typeof d !== "object") return;
if (d.type === "dops-open-detail") setView("detail");
else if (d.type === "dops-back-list") setView("list");
};
window.addEventListener("message", onMsg);
return () => window.removeEventListener("message", onMsg);
}, []);
return (
<iframe
key={view}
title="상담내역"
srcDoc={view === "list" ? CONSULT_LIST_HTML : CONSULT_DETAIL_HTML}
style={{ width: "100%", height: "100%", border: "none", display: "block" }}
/>
);
}

export default function DopsShell() {
const [showDelete, setShowDelete] = useState(false);
const [plans, setPlans] = useState(INITIAL_PLANS);
const [selectedId, setSelectedId] = useState(INITIAL_PLANS[0].id);
const seq = useRef(0);
const selected = plans.find((p) => p.id === selectedId) || plans[0];

// B 팔레트 → 선택 계획에 시술 항목 추가
const addItem = (proc) =>
setPlans((prev) => prev.map((p) => (p.id === selectedId ? { ...p, lines: [...p.lines, { teeth: [], proc, sub: "", memo: "", amount: 0, status: "예정" }] } : p)));
// C 목록 맨 아래 "새 치료 항목 추가" (빈 줄)
const addBlank = () => addItem("");
// A "새 계획"
const addPlan = () => {
seq.current += 1;
const id = "new-" + seq.current;
setPlans((prev) => [{ id, title: "새 치료계획", date: "2026-06-04", doctor: "황인하", staff: "", sigStatus: "미서명", sigDate: "", status: "작성중", discount: 0, lines: [] }, ...prev]);
setSelectedId(id);
};
return (
<div style={{ width: "100%", display: "flex", justifyContent: "center", background: tokens.bgBase }}>
<div style={{ position: "relative", width: "100%", maxWidth: 1920, height: 840, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "Pretendard, -apple-system, system-ui, sans-serif", border: `1px solid ${tokens.border}` }}>
<header style={{ height: 40, flexShrink: 0, background: tokens.bgPanel, borderBottom: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
<span style={{ color: tokens.textMuted, fontSize: 12, letterSpacing: 0.5 }}>상단 메뉴바 · 40px</span>
</header>
<main style={{ height: 800, flexShrink: 0, display: "flex", minHeight: 0 }}>
<LeftPanel plans={plans} selectedId={selectedId} onSelect={setSelectedId} onAddPlan={addPlan} onAddItem={addItem} />
<RightPanel key={selectedId} plan={selected} lines={selected.lines} onAddBlank={addBlank} onDelete={() => setShowDelete(true)} />
</main>
{showDelete && <DeleteModal onClose={() => setShowDelete(false)} />}
</div>
<style>{`         @keyframes dopsRecRing { from { stroke-dashoffset: ${RING_C}; } to { stroke-dashoffset: 0; } }
        .dops-opt:hover { background: #F1F5F9; }
        .dops-select:hover { background: #F1F5F9; }
        .dops-tab:hover { background: #F8FAFC; }
        .dops-planrow:hover { background: #F8FAFC; }
        .dops-addbtn:hover { background: #F0F8F6; border-color: #0D9488; }
        .dops-newplan { background: transparent; }
        .dops-newplan:hover { background: #E2E8F0; }
        .dops-thumbs::-webkit-scrollbar { height: 10px; }
        .dops-thumbs::-webkit-scrollbar-thumb { background: #6B7280; border-radius: 999px; }
        .dops-thumbs::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
        .dops-thumbs::-webkit-scrollbar-track { background: transparent; }
      `}</style>
</div>
);
}
