export function Link({
  text,
  href = "#",
}) {
  return (
    <a className="enlace-x" href={href}>
      {text}
    </a>
  );
}
