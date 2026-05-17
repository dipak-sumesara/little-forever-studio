interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function FormInput({ label, value, onChange, placeholder, required = label !== 'Baby age' }: FormInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-body text-sm font-semibold uppercase text-cocoa/60">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-full border border-linen bg-cream px-5 py-4 text-ink outline-none transition placeholder:text-cocoa/40 focus:border-blush focus:ring-4 focus:ring-blush/20"
        placeholder={placeholder || label}
      />
    </label>
  );
}
