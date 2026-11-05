import { Button } from "./Button";
import { requestLoginCode } from "../services/authService";

export function EmailLoginForm({ identifier, code, generatedCode, codeRequested, needsRegistration, profile, error, loading = false, onIdentifierChange, onCodeChange, onProfileChange, onCodeRequested, onRegistrationRequired, onError, onSubmit }) {
  async function handleRequestCode() {
    try {
      const response = await requestLoginCode(identifier, needsRegistration ? profile : {});
      if (response.registered) {
        onCodeRequested(response.code, response.username || response.email || identifier.trim());
      } else {
        onRegistrationRequired();
      }
    } catch (requestError) {
      onError(requestError.message);
    }
  }

  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <>
        <div className="form-floating">
          <input type="text" inputMode={codeRequested ? "numeric" : "email"}
            className="form-control" id={codeRequested ? "code" : "identifier"}
            name={codeRequested ? "code" : "identifier"}
            placeholder={codeRequested ? "Código de acceso" : "Correo electrónico o nombre de usuario"}
            autoComplete={codeRequested ? "one-time-code" : "username"}
            value={codeRequested ? code : identifier}
            onChange={codeRequested ? onCodeChange : onIdentifierChange}
            required autoFocus={codeRequested} />
          <label htmlFor={codeRequested ? "code" : "identifier"}>
            {codeRequested ? "Código de acceso" : "Correo electrónico o nombre de usuario"}
          </label>
        </div>
        {!codeRequested ? (
          <>
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
          <div className="login-step-label">Paso 2 de 2</div>
          <div className="small text-secondary">Escribe el código de acceso que recibiste.</div>
          {generatedCode && (
            <div className="login-code-preview">
              <span>Tu código de acceso</span>
              <strong>{generatedCode}</strong>
              <small>Este código es válido durante 10 minutos</small>
            </div>
          )}
          <Button color="btn-light" text={loading ? "Entrando..." : "Iniciar sesión"} type="submit"
            disabled={loading || !code.trim()} />
          </>
        )}
      </>
      {error && <div className="text-danger" role="alert">{error}</div>}
    </form>
  );
}
