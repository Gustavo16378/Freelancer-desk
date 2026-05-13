import { useProjects } from '@/store';

interface ProjectSelectProps {
  value: string | null;
  onChange: (v: string | null) => void;
  allowEmpty?: boolean;
}

const ProjectSelect = ({ value, onChange, allowEmpty = true }: ProjectSelectProps) => {
  const projects = useProjects();
  return (
    <select value={value ?? ''} onChange={e => onChange(e.target.value || null)} className="field">
      {allowEmpty && <option value="">— Sem projeto vinculado —</option>}
      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
};

export default ProjectSelect;
