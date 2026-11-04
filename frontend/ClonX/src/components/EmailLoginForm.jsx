import { Button } from "./Button";
import { requestLoginCode } from "../services/authService";

export function EmailLoginForm({ identifier, code, codeRequested, needsRegistration, profile, error, loading = false, onIdentifierChange, onCodeChange, onProfileChange, onCodeRequested, onRegistrationRequired, onError, onSubmit }) {
  async function handleRequestCode() {
    try {
      const response = await requestLoginCode(identifier, needsRegistration ? profile : {});
      if (response.registered) {
        onCodeRequested();
      } else {
        onRegistrationRequired();
      }
    } catch (requestError) {
      onError(requestError.message);
    }
  }

  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      {!codeRequested ? (
        <>
          <div className="form-floating">
            <input type="text" className="form-control" id="identifier" name="identifier"
              placeholder="Correo electrónico o nombre de usuario"
              value={identifier} onChange={onIdentifierChange} required />
            <label htmlFor="identifier">Correo electrónico o nombre de usuario</label>
          </div>
          {needsRegistration && (
            <>
              <div className="small text-secondary">No encontramos esa cuenta. Completa tus datos para crearla.</div>
              <div className="form-floating">
                <input type="text" className="form-control" id="fullName" name="fullName"
                  placeholder="Nombre completo" value={profile.fullName} onChange={onProfileChange} required />
                <label htmlFor="fullName">Nombre completo</label>
              </div>
              <div className="form-floating">
                <input type="text" className="form-control" id="username" name="username"
                  placeholder="Nombre de usuario" value={profile.username} onChange={onProfileChange} required />
                <label htmlFor="username">Nombre de usuario</label>
              </div>
              <div className="form-floating">
                <input type="email" className="form-control" id="email" name="email"
                  placeholder="Correo electrónico" value={profile.email} onChange={onProfileChange} required />
                <label htmlFor="email">Correo electrónico</label>
              </div>
            </>
          )}
          <Button color="btn-light" text={needsRegistration ? "Crear cuenta y enviar código" : "Enviar código"} type="button"
            onClick={handleRequestCode}
            disabled={loading || !identifier.trim() || (needsRegistration && (!profile.fullName.trim() || !profile.username.trim() || !profile.email.trim()))} />
        </>
      ) : (
        <>
          <div className="small text-secondary">Escribe el código que recibiste.</div>
          <div className="form-floating">
            <input type="text" inputMode="numeric" className="form-control" id="code" name="code"
              placeholder="Código de acceso" autoComplete="one-time-code"
              value={code} onChange={onCodeChange} required autoFocus />
            <label htmlFor="code">Código de acceso</label>
          </div>
          <Button color="btn-light" text={loading ? "Entrando..." : "Iniciar sesión"} type="submit"
            disabled={loading || !code.trim()} />
        </>
      )}
      {error && <div className="text-danger" role="alert">{error}</div>}
    </form>
  );
}
