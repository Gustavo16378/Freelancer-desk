const Logo = () => (
  <div className="flex items-center gap-2.5">
    <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%)',
      boxShadow: 'inset 0 0 0 1px rgba(0,180,216,0.35), inset 0 0 16px rgba(0,180,216,0.08)',
    }}>
      <span className="display font-bold text-[18px] text-cyan2" style={{ textShadow: '0 0 8px rgba(0,180,216,0.45)' }}>G</span>
    </span>
    <span className="logo-mark">
      <span className="text-dim">&lt;</span>freelancer<span className="accent">.desk</span><span className="text-dim">/&gt;</span>
    </span>
  </div>
);

export default Logo;
