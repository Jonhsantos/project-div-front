import { useState } from 'react'
import logo from '../div-logo-oficial.png'
import { getCurrentUser, loginUser, registerUser } from './features/auth/authApi'
import Trips from './features/trips/Trips'
import TermsButton from './features/auth/TermsButton'
import TermsPage from './features/auth/TermsPage'
import './features/auth/Auth.css'

const initialValues = { nome: '', email: '', senha: '', confirmarSenha: '', perfil: 'LIDER' }

function Field({ label, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} required /></label>
}

function App() {
  const [registering, setRegistering] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [showTerms, setShowTerms] = useState(false)

  function change(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function switchForm() {
    setRegistering(!registering)
    setError('')
    setNotice('')
    setValues(initialValues)
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    if (registering && values.senha !== values.confirmarSenha) {
      setError('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      if (registering) {
        await registerUser({ ...values, nome: values.nome.trim() })
        setRegistering(false)
        setValues({ ...initialValues, email: values.email })
        setNotice('Conta criada com sucesso. Entre para continuar.')
      } else {
        const { access_token } = await loginUser(values)
        const currentUser = await getCurrentUser(access_token)
        setToken(access_token)
        setUser(currentUser)
        setValues(initialValues)
      }
    } catch (err) {
      setError(err.message || 'Não foi possível concluir a solicitação.')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return <Trips user={user} token={token} onLogout={() => { setUser(null); setToken(null) }} />
  }

  if (showTerms) {
    return <TermsPage onBack={() => setShowTerms(false)} />
  }

  return (
    <main className={`auth-layout ${registering ? 'is-register' : 'is-login'}`}>
      <aside className="presentation">
        <img className="logo" src={logo} alt="DIV" />
        <p className="eyebrow">GESTÃO DE VIAGENS</p>
        <h1>Mais clareza para cada viagem.</h1>
        <p className="presentation-description">Registre despesas, acompanhe comprovantes e mantenha sua equipe alinhada.</p>
      </aside>
      <section className="content">
        {user ? (
          <div className="form-container">
            <p className="eyebrow">ACESSO REALIZADO</p>
            <h2>Olá, {user.nome}!</h2>
            <p>Você entrou como {user.perfil === 'LIDER' ? 'líder' : 'técnico'}. As viagens estarão disponíveis em uma próxima etapa.</p>
            <button className="primary" type="button" onClick={() => { setUser(null); setToken(null) }}>Sair</button>
          </div>
        ) : (
          <form className={`form-container ${registering ? 'register' : ''}`} onSubmit={submit}>
            <p className="eyebrow">{registering ? <><span className="register-desktop-text">COMECE AQUI</span><span className="register-mobile-text">BEM-VINDO AO DIV</span></> : <><span className="login-desktop-text">BEM-VINDO DE VOLTA</span><span className="login-mobile-text">BEM-VINDO AO DIV</span></>}</p>
            <h2>{registering ? 'Criar conta' : <><span className="login-desktop-text">Entre na sua conta</span><span className="login-mobile-text">Entrar</span></>}</h2>
            <p>{registering ? 'Cadastre-se para organizar suas viagens.' : <><span className="login-desktop-text">Acompanhe suas viagens e despesas em um só lugar.</span><span className="login-mobile-text">Acompanhe viagens e despesas em um só lugar.</span></>}</p>
            {registering && <Field label="Nome completo" name="nome" placeholder="Digite seu nome" autoComplete="name" maxLength={150} value={values.nome} onChange={change} />}
            <Field label="E-mail" name="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" value={values.email} onChange={change} />
            <Field label="Senha" name="senha" type="password" placeholder={registering ? 'Crie uma senha' : 'Digite sua senha'} autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 8 : 1} maxLength={128} value={values.senha} onChange={change} />
            {registering && <Field label="Confirmar senha" name="confirmarSenha" type="password" placeholder="Repita sua senha" autoComplete="new-password" minLength={8} maxLength={128} value={values.confirmarSenha} onChange={change} />}
            {registering && <fieldset className="profiles"><legend>Perfil</legend><label><input type="radio" name="perfil" value="LIDER" checked={values.perfil === 'LIDER'} onChange={change} /> Líder</label><label><input type="radio" name="perfil" value="TECNICO" checked={values.perfil === 'TECNICO'} onChange={change} /> Técnico</label></fieldset>}
            <button className="primary" type="submit" disabled={loading}>{loading ? 'Aguarde...' : registering ? 'Cadastrar' : 'Entrar'}</button>
            <p className="switch">{registering ? 'Já tem uma conta?' : <><span className="login-desktop-text">Não tem uma conta?</span><span className="login-mobile-text">Não tem conta?</span></>} <button type="button" onClick={switchForm}>{registering ? 'Entrar' : 'Cadastre-se'}</button></p>
            {error && <p className="message error" role="alert">{error}</p>}
            {notice && <p className="message success" role="status">{notice}</p>}
          </form>
        )}
      </section>
      <TermsButton onClick={() => setShowTerms(true)} />
    </main>
  )
}

export default App
