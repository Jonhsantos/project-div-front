import logo from '../../../div-logo-oficial.png'
import Icon from '../../components/Icon'
import './TermsPage.css'

const sections = [
  ['1. Finalidade', 'O DIV apoia o registro e a consulta de viagens profissionais, despesas e comprovantes pelas equipes.'],
  ['2. Conta e acesso', 'Cada pessoa utiliza uma conta individual e deve proteger suas credenciais. Não compartilhe sua senha.'],
  ['3. Perfis e permissões', 'O acesso às viagens e despesas depende da participação e do perfil. O líder responsável pode conferir as despesas de sua equipe; o técnico acessa seus próprios registros conforme as permissões.'],
  ['4. Informações e comprovantes', 'Registre informações corretas e envie somente comprovantes necessários e autorizados. Os dados pessoais e financeiros devem ser tratados de forma confidencial.'],
  ['5. Segurança e privacidade', 'O projeto prevê autenticação, controle de acesso, proteção da comunicação, registro de eventos e recuperação de dados. O tratamento de dados deve observar a LGPD e a política de privacidade aplicável.'],
  ['6. Uso responsável', 'Não tente acessar informações sem autorização, comprometer o serviço ou compartilhar informações de outras pessoas indevidamente.'],
]

export default function TermsPage({ onBack }) {
  return <main className="terms-page">
    <header className="terms-header">
      <img className="terms-logo" src={logo} alt="DIV" />
      <button className="terms-back button-icon" type="button" onClick={onBack}><Icon name="arrowBack" /> Voltar</button>
    </header>
    <article className="terms-content">
      <h1>Termos de uso</h1>
      <p className="terms-notice">Rascunho para revisão. O AT10 descreve requisitos de segurança, não termos jurídicos definitivos.</p>
      {sections.map(([title, text]) => <section className="terms-section" key={title}><h2>{title}</h2><p>{text}</p></section>)}
    </article>
  </main>
}
