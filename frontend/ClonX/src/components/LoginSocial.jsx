export function LoginSocial({
  provider,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      className="login-social"
      onClick={onClick}
    >
      <i className={`bi ${icon}`} aria-hidden="true"></i>
      {provider}
    </button>
  );
}
