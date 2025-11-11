import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Switch: React.FC<SwitchProps> = ({ label, className = '', ...props }) => {
  return (
    <label className={`flex items-center gap-2 text-sm text-text-secondary ${className}`}>
      <input
        type="checkbox"
        className="relative h-5 w-9 appearance-none rounded-full bg-bg-tertiary outline-none transition-colors duration-200 ease-in-out cursor-pointer checked:bg-accent-green 
                   before:absolute before:left-[3px] before:top-[3px] before:h-3.5 before:w-3.5 before:rounded-full before:bg-white before:transition-transform before:duration-200 before:ease-in-out before:content-['']
                   checked:before:translate-x-[16px]"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
};

export default Switch;
