import logo from '../../../div-logo-oficial.png'
import BackButton from '../../components/BackButton'
import './TermsPage.css'

const sections = [
  ['1. Finalidade e uso', 'O DIV apoia o registro e a consulta de viagens profissionais, despesas e comprovantes. Utilize a plataforma de forma responsável, informe dados corretos e não tente acessar informações sem autorização.'],
  ['2. Conta e acesso', 'Cada pessoa utiliza uma conta individual com nome, e-mail, senha e perfil de líder ou técnico. Proteja suas credenciais e não compartilhe sua senha. O acesso às viagens depende do perfil e da participação.'],
  ['3. Dados que coletamos', 'Coletamos dados de cadastro e perfil; informações das viagens, como título, destino, datas e descrição; e dados das despesas, como descrição, valor, data, categoria, situação de conferência e motivo de correção. Registramos também datas relacionadas ao cadastro, às viagens e à conferência.'],
  ['4. Comprovantes', 'O comprovante é obrigatório no cadastro de cada despesa. Os arquivos podem conter dados pessoais ou financeiros, inclusive de terceiros. Envie somente informações necessárias e cujo compartilhamento seja autorizado.'],
  ['5. Como usamos os dados', 'Os dados são utilizados para autenticar usuários, organizar viagens, registrar e conferir despesas, disponibilizar comprovantes e gerar relatórios. Informações sobre registros técnicos eventualmente gerados pelos provedores devem ser confirmadas antes da publicação definitiva desta política.'],
  ['6. Armazenamento e segurança', 'O frontend está hospedado na Vercel; o backend e o banco PostgreSQL estão hospedados na Render. Os comprovantes são armazenados no banco de dados. As senhas são armazenadas como hash, não em texto puro. O sistema utiliza autenticação e controles de acesso; nenhuma medida elimina totalmente os riscos de segurança.'],
  ['7. Acesso e compartilhamento', 'O líder responsável pode consultar os participantes e as despesas da viagem, acessar comprovantes e, após o encerramento, exportar um PDF com os dados e anexos. O técnico pode acessar suas próprias despesas e comprovantes. O líder que baixar o relatório deve cuidar de sua distribuição. A Vercel e a Render atuam como provedores de infraestrutura e podem tratar dados técnicos necessários aos serviços.'],
  ['8. Prazo de conservação', 'O prazo de retenção e os procedimentos de exclusão ainda precisam ser definidos. Após o encerramento, a viagem permanece disponível para consulta no sistema. A conservação poderá observar necessidades operacionais e obrigações legais aplicáveis.'],
  ['9. Seus direitos e contato', 'Nos termos da LGPD, você pode solicitar informações sobre seus dados e exercer os direitos aplicáveis, incluindo acesso, correção e eliminação quando cabível. As solicitações serão analisadas conforme a legislação e as possibilidades do serviço. Responsável: Jonathan Santos — jonathan.ssantos34@senacsp.edu.br.'],
  ['10. Alterações nesta política', 'Esta página poderá ser atualizada para refletir mudanças no serviço ou na legislação. A forma de comunicação de alterações relevantes será definida antes da publicação definitiva.'],
]

export default function TermsPage({ onBack }) {
  return <main className="terms-page">
    <header className="terms-header">
      <img className="terms-logo" src={logo} alt="DIV" />
    </header>
    <article className="terms-content">
      <div className="back-title"><BackButton onClick={onBack} /><h1>Termos de uso e política de privacidade</h1></div>
      <p className="terms-notice"><strong>Vigência informada: 15/11/2026.</strong> Rascunho sujeito a revisão jurídica e à definição dos prazos de retenção antes da publicação definitiva.</p>
      {sections.map(([title, text]) => <section className="terms-section" key={title}><h2>{title}</h2><p>{text}</p></section>)}
      <p>Contato: <a href="mailto:jonathan.ssantos34@senacsp.edu.br">jonathan.ssantos34@senacsp.edu.br</a></p>
    </article>
  </main>
}
