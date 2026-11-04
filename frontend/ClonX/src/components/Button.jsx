
export function Button({
  text,
  color = "btn-primary",
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`btn ${color}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
