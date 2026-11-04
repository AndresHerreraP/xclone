import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "../components/Divider";
import { EmailLoginForm } from "../components/EmailLoginForm";
import { login } from "../services/authService";

export function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ identifier, password });
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
              <div className="d-flex flex-column gap-3">
                <div className="small text-secondary">Inicia sesión con tu correo electrónico o nombre de usuario.</div>
                <EmailLoginForm identifier={identifier} password={password} error={error} loading={loading}
                  onIdentifierChange={(event) => setIdentifier(event.target.value)}
                  onPasswordChange={(event) => setPassword(event.target.value)}
                  onSubmit={handleSubmit} />
                <Divider />
                <p className="enlace">Usa una cuenta existente. El registro no está habilitado.</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 login-right"><img src="/x-logo.png" alt="Logo de X" className="img-fluid" /></div>
        </div>
      </div>
    </main>
  );
}
