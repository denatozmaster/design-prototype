// @ts-nocheck
// 치아보험 탭 — 좌측 사이드바(환자 범위 토글 + 메뉴) + 우측 본문 2분할
import { useState } from "react";
import { FileSearch, Calculator, ShieldCheck } from "lucide-react";
import { tokens } from "./tokens";

const INS_SIDEBAR_W = 220;
const INS_SCOPES = ["선택된 환자", "전체 환자"];
const INS_MENU = [
  { key: "약관 분석", icon: FileSearch },
  { key: "보험금 계산", icon: Calculator },
  { key: "보험가입 정보", icon: ShieldCheck },
];

export default function DentalInsuranceTab() {
  const [scope, setScope] = useState(INS_SCOPES[0]);
  const [menu, setMenu] = useState(INS_MENU[0].key);
  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* 좌측 사이드바 */}
      <div style={{ width: INS_SIDEBAR_W, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: `1px solid ${tokens.border}`, background: tokens.bgPanel, minHeight: 0 }}>
        {/* 환자 범위 토글 */}
        <div style={{ flexShrink: 0, padding: 12 }}>
          <div style={{ display: "flex", gap: 2, padding: 2, background: tokens.border, borderRadius: 8 }}>
            {INS_SCOPES.map((s) => {
              const active = s === scope;
              return (
                <button key={s} onClick={() => setScope(s)}
                  style={{ flex: 1, border: "none", fontFamily: "inherit", fontSize: 12, fontWeight: active ? 600 : 500, color: active ? tokens.navy : tokens.textSecondary, background: active ? "#FFFFFF" : "transparent", padding: "6px 0", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active ? "0 1px 2px rgba(15,23,42,0.08)" : "none", transition: "background 0.15s ease, color 0.15s ease" }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>
        {/* 메뉴 */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "0 8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {INS_MENU.map(({ key, icon: Icon }) => {
            const active = key === menu;
            return (
              <button key={key} onClick={() => setMenu(key)} className="dops-insmenu"
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none", background: active ? tokens.border : "transparent", color: active ? tokens.textPrimary : tokens.textSecondary, fontFamily: "inherit", fontSize: 13, fontWeight: active ? 600 : 500, padding: "9px 10px", borderRadius: 7, cursor: "pointer", textAlign: "left", whiteSpace: "nowrap" }}>
                <Icon size={16} strokeWidth={2} color={active ? tokens.textPrimary : tokens.textMuted} />
                {key}
              </button>
            );
          })}
        </div>
      </div>
      {/* 우측 본문 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#FFFFFF", minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: 16 }} />
      </div>
    </div>
  );
}
