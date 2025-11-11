import React from 'react';

interface PanelSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  pulse?: boolean;
}

const PanelSection: React.FC<PanelSectionProps> = ({ id, title, subtitle, children, pulse }) => {
  return (
    <section
      id={id}
      className={`flex flex-col gap-3 rounded-xl border border-border-secondary bg-bg-secondary p-4 transition-colors ${
        pulse ? 'pulse-highlight' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <strong className="text-text-primary text-base font-semibold">{title}</strong>
        {subtitle && <span className="text-text-tertiary text-xs">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
};

export default PanelSection;
