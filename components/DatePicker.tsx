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
  // Parse only if it looks like a full or partial date
  const isValidDate = value && value.length >= 8 && value.includes('-')
  const parts = isValidDate ? value.split('-') : ['', '', '']
  const year = parts[0] || ''
  const month = parts[1] || ''
  const day = parts[2] || ''

  function update(newYear: string, newMonth: string, newDay: string) {
    if (newYear && newMonth && newDay) {
      onChange(`${newYear}-${newMonth}-${newDay}`)
    } else {
      // Keep partial state so selections aren't lost
      onChange(`${newYear}-${newMonth}-${newDay}`)
    }
  }

  function handleMonthChange(newMonth: string) {
    update(year, newMonth, day)
  }

  function handleDayChange(newDay: string) {
    update(year, month, newDay)
  }

  function handleYearChange(newYear: string) {
    update(newYear, month, day)
  }

  const selectClass = 'bg-gray-900 border border-gray-700 rounded-2xl px-4 py-4 text-xl flex-1'

  return (
    <div>
      <label className="block mb-2 text-lg font-bold">{label}</label>
      <div className="flex gap-3">
        <select
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={day}
          onChange={(e) => handleDayChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      {(month || day || year) && (
        <button
          onClick={() => onChange('')}
          className="mt-2 text-gray-500 hover:text-gray-300 text-sm"
        >
          Clear date
        </button>
      )}
    </div>
  )
}