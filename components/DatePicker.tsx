'use client'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
}

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 2024 }, (_, i) => 2025 + i)

const days = Array.from({ length: 31 }, (_, i) => {
  const d = String(i + 1).padStart(2, '0')
  return { value: d, label: String(i + 1) }
})

export default function DatePicker({ label, value, onChange }: Props) {
  const parts = value ? value.split('-') : ['', '', '']
  const year = parts[0] || ''
  const month = parts[1] || ''
  const day = parts[2] || ''

  function update(newYear: string, newMonth: string, newDay: string) {
    if (newYear && newMonth && newDay) {
      onChange(`${newYear}-${newMonth}-${newDay}`)
    } else {
      // Store partial state as a placeholder string so selections aren't lost
      onChange([newYear, newMonth, newDay].join('-'))
    }
  }

  const selectClass = 'bg-gray-900 border border-gray-700 rounded-2xl px-4 py-4 text-xl flex-1'

  return (
    <div>
      <label className="block mb-2 text-lg font-bold">{label}</label>
      <div className="flex gap-3">
        <select
          value={month}
          onChange={(e) => update(year, e.target.value, day)}
          className={selectClass}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={day}
          onChange={(e) => update(year, month, e.target.value)}
          className={selectClass}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => update(e.target.value, month, day)}
          className={selectClass}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  )
}