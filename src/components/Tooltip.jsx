import React from 'react';
import { Info } from 'lucide-react';

const Tooltip = ({ title, content }) => (
  <div className="relative group/tooltip inline-block ml-1">
    <Info size={14} className="text-slate-600 cursor-help hover:text-slate-400 transition-colors" />
    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-800 text-[11px] text-slate-200 rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-none z-[100] border border-slate-700 shadow-2xl leading-relaxed text-left ring-1 ring-black/50 translate-y-2 group-hover/tooltip:translate-y-0">
      <p className="font-black text-blue-400 mb-1 uppercase tracking-tighter border-b border-slate-700 pb-1">{title}</p>
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export default Tooltip;