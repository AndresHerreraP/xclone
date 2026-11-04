
export function Input({
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}) {
  return (
    <input
      className="form-control input-x"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  );
}
