'use client';

interface BirthFormData {
  year: string; month: string; day: string; hour: string; minute: string; country: string; city: string;
}

interface BirthFormProps {
  form: BirthFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const SHI_CHEN = [
  { value: '0', label: '子时 Zi · 23:00-01:00', short: '子 23-01' },
  { value: '2', label: '丑时 Chou · 01:00-03:00', short: '丑 01-03' },
  { value: '4', label: '寅时 Yin · 03:00-05:00', short: '寅 03-05' },
  { value: '6', label: '卯时 Mao · 05:00-07:00', short: '卯 05-07' },
  { value: '8', label: '辰时 Chen · 07:00-09:00', short: '辰 07-09' },
  { value: '10', label: '巳时 Si · 09:00-11:00', short: '巳 09-11' },
  { value: '12', label: '午时 Wu · 11:00-13:00', short: '午 11-13' },
  { value: '14', label: '未时 Wei · 13:00-15:00', short: '未 13-15' },
  { value: '16', label: '申时 Shen · 15:00-17:00', short: '申 15-17' },
  { value: '18', label: '酉时 You · 17:00-19:00', short: '酉 17-19' },
  { value: '20', label: '戌时 Xu · 19:00-21:00', short: '戌 19-21' },
  { value: '22', label: '亥时 Hai · 21:00-23:00', short: '亥 21-23' },
];

export default function BirthForm({ form, onChange, onSubmit, loading }: BirthFormProps) {
  const years = Array.from({ length: 100 }, (_, i) => 2026 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];
  const isValid = form.year && form.month && form.day;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <p className="text-xs text-[#7c3aed] tracking-[0.2em] uppercase mb-3 font-medium">Birth Date · 出生日期</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'year', label: 'Year 年', options: years.map(y => ({ v: y, l: String(y) })) },
            { name: 'month', label: 'Month 月', options: months.map(m => ({ v: m, l: String(m).padStart(2, '0') })) },
            { name: 'day', label: 'Day 日', options: days.map(d => ({ v: d, l: String(d).padStart(2, '0') })) },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-[10px] text-[#9ca3af] mb-1.5 tracking-wider">{f.label}</label>
              <select name={f.name} value={form[f.name as keyof BirthFormData]} onChange={onChange}
                className="input-mystic text-sm py-3">
                <option value="">—</option>
                {f.options.map(o => (
                  <option key={o.v} value={o.v} className="bg-white">{o.l}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-[#7c3aed] tracking-[0.2em] uppercase mb-3 font-medium">Birth Time · 出生时辰</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-[#9ca3af] mb-1.5 tracking-wider">Shi Chen 时辰</label>
            <select name="hour" value={form.hour} onChange={onChange} className="input-mystic text-sm py-3">
              <option value="">Unknown</option>
              {SHI_CHEN.map(sc => (
                <option key={sc.value} value={sc.value} className="bg-white">{sc.short}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-[#9ca3af] mb-1.5 tracking-wider">Minute 分</label>
            <select name="minute" value={form.minute} onChange={onChange} className="input-mystic text-sm py-3">
              <option value="">00</option>
              {minutes.map(m => (
                <option key={m} value={m} className="bg-white">{String(m).padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-[#7c3aed] tracking-[0.2em] uppercase mb-3 font-medium">Birth Place · 出生地点</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-[#9ca3af] mb-1.5 tracking-wider">Country 国家</label>
            <input name="country" value={form.country} onChange={onChange}
              placeholder="e.g. United States" className="input-mystic text-sm" />
          </div>
          <div>
            <label className="block text-[10px] text-[#9ca3af] mb-1.5 tracking-wider">City 城市</label>
            <input name="city" value={form.city} onChange={onChange}
              placeholder="e.g. New York" className="input-mystic text-sm" />
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading || !isValid}
        className="btn-gold w-full text-base py-4 rounded-xl font-semibold tracking-wide">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Reading the stars...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-lg">🔮</span>
            Reveal My Destiny — Free
          </span>
        )}
      </button>
    </form>
  );
}
