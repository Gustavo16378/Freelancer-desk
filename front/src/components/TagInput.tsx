import { useState } from 'react';
import Icon from './Icon';

interface TagInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

const TagInput = ({ value = [], onChange, placeholder = 'Adicionar e pressionar Enter' }: TagInputProps) => {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (value.includes(v)) { setDraft(''); return; }
    onChange([...value, v]);
    setDraft('');
  };

  const remove = (t: string) => onChange(value.filter(x => x !== t));

  return (
    <div className="field flex flex-wrap gap-1.5 p-2">
      {value.map(t => (
        <span key={t} className="chip" style={{ background: 'rgba(0,180,216,0.10)', color: '#00d4ff' }}>
          {t}
          <button onClick={() => remove(t)} className="opacity-60 hover:opacity-100 ml-0.5">
            <Icon name="x" size={11} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); add(); }
          if (e.key === 'Backspace' && !draft && value.length) remove(value[value.length - 1]);
        }}
        placeholder={placeholder}
        className="flex-1 min-w-[140px] bg-transparent outline-none text-sm px-1 py-1 placeholder:text-dim2"
      />
    </div>
  );
};

export default TagInput;
