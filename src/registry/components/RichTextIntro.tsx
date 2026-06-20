import type { ComponentProps } from '../../types/config';

interface RichTextIntroProps {
  props: ComponentProps;
  actions?: Array<{ label: string; primary: boolean; action: { type: string; payload: string } }>;
  dispatch?: (action: { type: string; payload: string }) => void;
}

export default function RichTextIntro({ props, actions, dispatch }: RichTextIntroProps) {
  const tag = props.tag as string || '';
  const lines = props.lines as string[] || [];
  const avatar = props.avatar as { name: string; src: string } | undefined;

  return (
    <>
      <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-blue-500/60 uppercase">{tag}</div>
      <div className="flex-1 flex flex-col justify-center items-start text-left px-7 w-full gap-2.5 font-sans mt-2">
        <span className="text-[20px] md:text-[22px] font-medium tracking-wide">{lines[0]}</span>
        <div className="text-[24px] md:text-[28px] font-black tracking-tight flex items-center flex-wrap gap-x-2 gap-y-1.5">
          <span>{lines[1]}</span>
          {avatar && (
            <span className="inline-flex items-center bg-blue-500/10 dark:bg-blue-400/15 border border-blue-500/20 dark:border-blue-400/30 text-blue-600 dark:text-blue-400 pl-1.5 pr-3 py-1 rounded-[18px] text-[18px] md:text-[20px] font-bold align-middle">
              <img src={avatar.src} className="w-[28px] h-[28px] rounded-[14px] mr-1.5 border border-blue-400/30 object-cover shrink-0" alt="Avatar" />
              {avatar.name}
            </span>
          )}
        </div>
        <span className="text-[20px] md:text-[22px] font-medium tracking-wide">{lines[2]}</span>
      </div>

      {actions && (
        <div className="px-6 pb-6 w-full flex gap-2.5 shrink-0">
          {actions.map((btn, i) => (
            <button
              key={i}
              onClick={() => dispatch?.(btn.action)}
              className={`flex-1 py-3 text-[11px] font-bold tracking-widest rounded-full transition-all text-center ${
                btn.primary
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] active:scale-[0.97] hover:bg-blue-500'
                  : 'bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 active:scale-[0.97] hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}