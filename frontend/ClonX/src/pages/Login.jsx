import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "../components/Divider";
import { EmailLoginForm } from "../components/EmailLoginForm";
import { LoginSocial } from "../components/LoginSocial";
import { login } from "../services/authService";

export function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [profile, setProfile] = useState({ fullName: "", username: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ identifier, code });
      navigate("/feed");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-12 col-md-6 login-left">
            <div className="login-form">
              <h1>Lo que está<br />pasando<br />ahora.</h1>
              <div className="login-content d-flex flex-column gap-3">
                <div className="login-subtitle">Únete a la conversación. Inicia sesión para ver lo que está pasando.</div>
                <div className="login-socials">
                  <LoginSocial provider="Continuar con Google" icon="bi-google" onClick={() => setError("El inicio con Google estará disponible próximamente.")} />
                  <LoginSocial provider="Continuar con Apple" icon="bi-apple" onClick={() => setError("El inicio con Apple estará disponible próximamente.")} />
                </div>
                <Divider />
                <EmailLoginForm identifier={identifier} code={code} generatedCode={generatedCode} codeRequested={codeRequested}
                  error={error} loading={loading}
                  needsRegistration={needsRegistration} profile={profile}
                  onIdentifierChange={(event) => setIdentifier(event.target.value)}
                  onCodeChange={(event) => setCode(event.target.value)}
                  onProfileChange={(event) => setProfile({ ...profile, [event.target.name]: event.target.value })}
                  onCodeRequested={(value, accountIdentifier = identifier) => {
                    setIdentifier(accountIdentifier);
                    setCode(value);
                    setGeneratedCode(value);
                    setCodeRequested(true);
                  }}
                  onRegistrationRequired={() => {
                    setNeedsRegistration(true);
                    setError("Completa tu nombre y elige un nombre de usuario para crear la cuenta.");
                    if (identifier.includes("@")) {
                      setProfile((current) => ({ ...current, email: identifier.trim() }));
                    }
                  }}
                  onError={setError}
                  onSubmit={handleSubmit} />
                <p className="login-hint">Si no tienes cuenta, la crearemos con tus datos.</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 login-right"><img src="/x-logo.png" alt="Logo de X" className="img-fluid" /></div>
        </div>
      </div>
    </main>
  );
}
