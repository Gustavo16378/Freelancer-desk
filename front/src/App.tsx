import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Shell from '@/layout/Shell';
import Agenda from '@/pages/Agenda';
import Dashboard from '@/pages/Dashboard';
import Projetos from '@/pages/Projetos';
import ProjetoDetalhe from '@/pages/ProjetoDetalhe';
import Pagamentos from '@/pages/Pagamentos';
import Graficos from '@/pages/Graficos';
import { useAppStore } from '@/store';

const ProjetoDetalheWrapper = () => {
  const { id = '' } = useParams<{ id: string }>();
  const project = useAppStore(s => s.projects.find(p => p.id === id));
  return (
    <Shell title={project?.name ?? 'Projeto'}>
      <ProjetoDetalhe id={id} />
    </Shell>
  );
};

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/agenda" replace />} />
      <Route path="/agenda" element={<Shell title="Agenda"><Agenda /></Shell>} />
      <Route path="/dashboard" element={<Shell title="Dashboard"><Dashboard /></Shell>} />
      <Route path="/projetos" element={<Shell title="Projetos"><Projetos /></Shell>} />
      <Route path="/projetos/:id" element={<ProjetoDetalheWrapper />} />
      <Route path="/pagamentos" element={<Shell title="Pagamentos"><Pagamentos /></Shell>} />
      <Route path="/graficos" element={<Shell title="Gráficos"><Graficos /></Shell>} />
      <Route path="*" element={<Navigate to="/agenda" replace />} />
    </Routes>
  </HashRouter>
);

export default App;
