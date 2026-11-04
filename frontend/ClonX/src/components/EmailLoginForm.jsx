import { Button } from "./Button";
import { requestLoginCode } from "../services/authService";

export function EmailLoginForm({ identifier, code, codeRequested, error, loading = false, onIdentifierChange, onCodeChange, onCodeRequested, onError, onSubmit }) {
  async function handleRequestCode() {
    try {
      await requestLoginCode(identifier);
      onCodeRequested();
    } catch (requestError) {
      onError(requestError.message);
    }
  }

  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <div className="form-floating">
        <input type="text" className="form-control" id="identifier" name="identifier"
          placeholder="Correo electrónico o nombre de usuario" autoComplete="username"
          value={identifier} onChange={onIdentifierChange} required />
        <label htmlFor="identifier">Correo electrónico o nombre de usuario</label>
      </div>
      {!codeRequested ? (
        <Button color="btn-light" text="Enviar código" type="button"
          onClick={handleRequestCode} disabled={loading || !identifier.trim()} />
      ) : (
        <>
          <div className="small text-secondary">Escribe el código que recibiste.</div>
          <div className="form-floating">
            <input type="text" inputMode="numeric" className="form-control" id="code" name="code"
              placeholder="Código de acceso" autoComplete="one-time-code"
              value={code} onChange={onCodeChange} required />
            <label htmlFor="code">Código de acceso</label>
          </div>
          <Button color="btn-light" text={loading ? "Entrando..." : "Iniciar sesión"} type="submit"
            disabled={loading || !identifier.trim() || !code.trim()} />
        </>
      )}
      {error && <div className="text-danger" role="alert">{error}</div>}
    </form>
  );
}
