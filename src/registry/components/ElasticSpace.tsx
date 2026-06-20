import type { ComponentProps } from '../../types/config';

interface ElasticSpaceProps {
  props: ComponentProps;
}

export default function ElasticSpace({ props }: ElasticSpaceProps) {
  const tag = props.tag as string || '';
  const title = props.title as string || '';
  const desc = props.desc as string || '';
  const hashtags = props.hashtags as string[] | undefined;

  return (
    <>
      <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-blue-500/60 uppercase">{tag}</div>
      <div className="flex-1 flex flex-col justify-center items-start text-left px-7 w-full font-sans">
        <h4 className="text-[18px] font-bold flex items-center gap-2 mb-3">{title}</h4>
        <p className="text-[13px] leading-relaxed opacity-70">{desc}</p>
        {hashtags && (
          <div className="flex gap-2 mt-4 w-full">
            {hashtags.map((tag, i) => (
              <span key={i} className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${i % 2 === 0 ? 'bg-purple-500/10 text-purple-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="px-6 pb-6 w-full shrink-0 text-center">
        <span className="text-[11px] font-medium opacity-50 flex items-center justify-center gap-1">
          继续滑动解锁下一板块
          <span className="material-symbols-rounded block select-none text-[14px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>arrow_forward</span>
        </span>
      </div>
    </>
  );
}