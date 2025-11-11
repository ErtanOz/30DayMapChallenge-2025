import React from 'react';

export enum StatusTone {
  Default = 'default',
  Success = 'success',
  Pending = 'pending',
  Error = 'error',
}

interface StatusChipProps {
  text: string;
  tone?: StatusTone;
  className?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ text, tone = StatusTone.Default, className = '' }) => {
  let toneClasses = '';
  switch (tone) {
    case StatusTone.Success:
      toneClasses = 'border-accent-green bg-green-500/10 text-accent-green';
      break;
    case StatusTone.Pending:
      toneClasses = 'border-accent-yellow bg-yellow-500/10 text-accent-yellow';
      break;
    case StatusTone.Error:
      toneClasses = 'border-accent-red bg-red-500/10 text-accent-red';
      break;
    default:
      toneClasses = 'border-border-secondary bg-gray-700/10 text-text-secondary';
      break;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${toneClasses} ${className}`}
      data-tone={tone}
    >
      {text}
    </div>
  );
};

export default StatusChip;
