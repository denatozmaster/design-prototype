import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import {
  entryTabs,
  upperTeeth,
  lowerTeeth,
  upperDeciduousTeeth,
  lowerDeciduousTeeth,
  frequentTreatments,
  additionalCategories,
  treatmentMainTabs,
  bottomFormData,
  footerButtons,
} from './mock-data'

function ToothChart() {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])

  const toggleTooth = (num: number) => {
    setSelectedTeeth((prev) =>
      prev.includes(num) ? prev.filter((t) => t !== num) : [...prev, num]
    )
  }

  const ToothButton = ({ num }: { num: number }) => {
    const selected = selectedTeeth.includes(num)
    return (
      <button
        onClick={() => toggleTooth(num)}
        className={`w-[30px] h-[30px] rounded text-[11px] font-medium transition-colors ${
          selected
            ? 'bg-blue-500 text-white'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
      >
        {num}
      </button>
    )
  }

  return (
    <div className="px-6 py-3 border-b">
      <div className="flex flex-col items-center gap-1.5">
        {/* Upper permanent */}
        <div className="flex gap-1">
          {upperTeeth.map((t) => (
            <ToothButton key={t} num={t} />
          ))}
        </div>
        {/* Upper deciduous */}
        <div className="flex gap-1">
          <div className="w-[186px]" />
          {upperDeciduousTeeth.map((t) => (
            <ToothButton key={t} num={t} />
          ))}
          <div className="w-[186px]" />
        </div>
        {/* Lower deciduous */}
        <div className="flex gap-1">
          <div className="w-[186px]" />
          {lowerDeciduousTeeth.map((t) => (
            <ToothButton key={t} num={t} />
          ))}
          <div className="w-[186px]" />
        </div>
        {/* Lower permanent */}
        <div className="flex gap-1">
          {lowerTeeth.map((t) => (
            <ToothButton key={t} num={t} />
          ))}
        </div>
      </div>

      {/* Quick selection row */}
      <div className="flex items-center gap-2 mt-2 justify-end">
        <span className="text-[10px] text-neutral-400">전악선택</span>
        <button className="text-[10px] px-1.5 py-0.5 rounded border text-neutral-500 hover:bg-neutral-50">상악</button>
        <button className="text-[10px] px-1.5 py-0.5 rounded border text-neutral-500 hover:bg-neutral-50">하악</button>
        <button
          onClick={() => setSelectedTeeth([])}
          className="text-[10px] px-1.5 py-0.5 rounded border text-neutral-500 hover:bg-neutral-50 flex items-center gap-0.5"
        >
          <RotateCcw className="w-2.5 h-2.5" /> 초기화
        </button>
      </div>
    </div>
  )
}

function TreatmentInput() {
  const [activeMainTab, setActiveMainTab] = useState('자주하는 진료')

  return (
    <div className="flex flex-col">
      {/* Treatment Main Tabs */}
      <div className="flex items-center border-b">
        <div className="flex items-center gap-0.5 px-3 py-1 overflow-x-auto flex-1">
          {treatmentMainTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={`px-2 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                activeMainTab === tab
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 px-2 shrink-0">
          <button className="text-[10px] px-2 py-1 rounded-md bg-teal-500 text-white font-medium">
            새 진료 추가
          </button>
          <button className="text-[10px] px-2 py-1 rounded-md bg-neutral-200 text-neutral-600 font-medium">
            새 메모
          </button>
        </div>
      </div>

      {/* Treatment Buttons Grid */}
      <div className="px-3 py-2 overflow-y-auto" style={{ maxHeight: '220px' }}>
        {/* Category buttons rows */}
        {frequentTreatments.map((cat, i) => (
          <div key={i} className="flex items-start gap-2 mb-1.5">
            <span className="shrink-0 text-[10px] font-semibold text-neutral-500 w-14 pt-1 text-right">
              {cat.label}
            </span>
            <div className="flex flex-wrap gap-0.5">
              {cat.items.map((item, j) => (
                <button
                  key={j}
                  className="px-2 py-1 text-[11px] rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Separator */}
        <div className="border-t my-2" />

        {/* Additional categories */}
        {additionalCategories.map((cat, i) => (
          <div key={i} className="flex items-start gap-2 mb-1.5">
            <span className="shrink-0 text-[10px] font-semibold text-neutral-500 w-14 pt-1 text-right">
              {cat.label}
            </span>
            <div className="flex flex-wrap gap-0.5">
              {cat.items.map((item, j) => (
                <button
                  key={j}
                  className={`px-2 py-1 text-[11px] rounded border whitespace-nowrap transition-colors ${
                    item === '계속'
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : item === '완료'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : item === '삭제'
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BottomForm() {
  return (
    <div className="border-t bg-neutral-50/50">
      <div className="flex divide-x">
        {/* Left: Form fields */}
        <div className="w-[300px] p-3 space-y-2">
          <FormRow label="진료일">
            <span className="text-[11px] text-neutral-700">{bottomFormData.진료일}</span>
            <span className="ml-2 text-[11px] text-neutral-400">상병명</span>
            <button className="ml-1 text-[10px] text-blue-500">상병 추가</button>
          </FormRow>
          <FormRow label="보험">
            <span className="text-[11px] text-neutral-700">{bottomFormData.보험}</span>
          </FormRow>
          <FormRow label="진찰료">
            <div className="flex items-center gap-1">
              <select className="h-5 text-[11px] bg-white border rounded px-1 text-neutral-600">
                <option>초진</option>
                <option>재진</option>
              </select>
              {['검진대상', '장애인', '임신부'].map((opt) => (
                <label key={opt} className="flex items-center gap-0.5 text-[10px] text-neutral-500">
                  <input type="checkbox" className="w-3 h-3 rounded" />
                  {opt}
                </label>
              ))}
            </div>
          </FormRow>
          <FormRow label="진료의사">
            <div className="flex items-center gap-1">
              <select className="h-5 text-[11px] bg-white border rounded px-1 text-neutral-600">
                <option>원장1차</option>
              </select>
              <select className="h-5 text-[11px] bg-white border rounded px-1 text-neutral-600">
                <option>영상자기...</option>
              </select>
            </div>
          </FormRow>
          <FormRow label="결과">
            <select className="h-5 text-[11px] bg-white border rounded px-1 text-neutral-600">
              <option>계속</option>
              <option>완료</option>
            </select>
          </FormRow>
          <FormRow label="출결여부">
            <span className="text-[11px] text-neutral-500">-</span>
            <span className="ml-4 text-[11px] text-neutral-500">건재 수납</span>
          </FormRow>
          <FormRow label="본인부담">
            <span className="text-[11px] text-neutral-500">-</span>
          </FormRow>
        </div>

        {/* Right: Additional info areas */}
        <div className="flex-1 p-3">
          <div className="grid grid-rows-2 gap-2 h-full">
            <div className="rounded-md border bg-white p-2">
              <span className="text-[10px] text-neutral-400 font-medium">기타체크</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {['신질특허', '특요대원'].map((item) => (
                  <span key={item} className="px-1.5 py-0.5 text-[10px] rounded bg-neutral-100 text-neutral-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-md border bg-white p-2">
              <span className="text-[10px] text-neutral-400 font-medium">메모</span>
              <p className="text-[11px] text-neutral-500 mt-1">진료 관련 메모가 여기에 표시됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 w-14 text-[11px] font-medium text-neutral-500 text-right">{label}</span>
      <div className="flex items-center gap-1 flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default function ClinicalEntry() {
  const [activeTab, setActiveTab] = useState('진료 입력')

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Entry Tabs */}
      <div className="flex items-center h-[46px] px-3 border-b shrink-0">
        <div className="flex items-center gap-0.5">
          {entryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tooth Chart */}
        <ToothChart />

        {/* Treatment Input */}
        <TreatmentInput />

        {/* Bottom Form */}
        <BottomForm />
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between h-9 px-3 border-t bg-neutral-50 shrink-0">
        {footerButtons.map((btn, i) => (
          <button
            key={i}
            className="text-[10px] text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  )
}
