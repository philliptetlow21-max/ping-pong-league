"use client";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

export default function YearSelector({
  years,
  selectedYear,
  onChange,
}: YearSelectorProps) {
  if (years.length === 0) return null;

  return (
    <select
      value={selectedYear}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}
