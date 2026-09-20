interface Props {
  name: string;
  code: string;
  onNameChange: (v: string) => void;
  onCodeChange: (v: string) => void;
  idPrefix: string;
}

export function NameCodeFields({
  name,
  code,
  onNameChange,
  onCodeChange,
  idPrefix,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor={`${idPrefix}-name`}
          className="block font-display text-[10px] tracking-[2px] text-[#9ca3af] mb-1.5"
        >
          NAME
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="이름을 입력하세요"
          className="w-full box-border bg-[#0d0d14] border-[3px] border-[#3f3f4f] text-[#f5f5f5] text-lg px-3 py-2.5 outline-none"
        />
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-code`}
          className="block font-display text-[10px] tracking-[2px] text-[#4ade80] mb-1.5"
        >
          ACCESS CODE
        </label>
        <input
          id={`${idPrefix}-code`}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={code}
          onChange={(e) =>
            onCodeChange(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="••••"
          className="rb-code-input w-full box-border bg-[#0d0d14] border-[3px] border-[#234a34] text-[#22ff88] font-display text-xl tracking-[14px] text-center pl-[18px] py-3 outline-none"
        />
      </div>
    </div>
  );
}
