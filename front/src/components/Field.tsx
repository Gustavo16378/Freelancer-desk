interface FieldProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field = ({ label, hint, children, className = '' }: FieldProps) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    {children}
    {hint && <div className="mt-1.5 text-[11.5px] text-dim2">{hint}</div>}
  </div>
);

export default Field;
