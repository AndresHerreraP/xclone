import { Button } from "./Button";

export function EmailLoginForm({ identifier, password, error, loading = false, onIdentifierChange, onPasswordChange, onSubmit }) {
  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <div className="form-floating">
        <input type="text" className="form-control" id="identifier" name="identifier"
          placeholder="Correo electrónico o nombre de usuario" autoComplete="username"
          value={identifier} onChange={onIdentifierChange} required />
        <label htmlFor="identifier">Correo electrónico o nombre de usuario</label>
      </div>
      <div className="form-floating">
        <input type="password" className="form-control" id="password" name="password"
          placeholder="Contraseña" autoComplete="current-password"
          value={password} onChange={onPasswordChange} required />
        <label htmlFor="password">Contraseña</label>
      </div>
      <Button color="btn-light" text={loading ? "Entrando..." : "Iniciar sesión"} type="submit"
        disabled={loading || !identifier.trim() || !password} />
      {error && <div className="text-danger" role="alert">{error}</div>}
    </form>
  );
}
