import type { ComponentProps } from '../../types/config';
import { useAppContext } from '../../context/AppContext';

export default function PlaceholderCard({ props }: { props: ComponentProps }) {
  const { state } = useAppContext();
  const { locale, isDark } = state;
  const sectionId = props.sectionId as string | undefined;
  const title = props.title as string || '';
  const subtitle = props.subtitle as string || '';

  const rtlLocales = ['ar-SA'];
  const isRTL = rtlLocales.includes(locale);

  return (
    <>
      {sectionId && (
        <div className={`absolute top-4 left-6 text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {sectionId} SECTION
        </div>
      )}
      <div className={`flex-1 flex flex-col items-center justify-center text-center w-full h-full p-6 ${isRTL ? 'rtl' : ''}`}>
        <span className={`font-bold tracking-widest text-2xl drop-shadow-md pr-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</span>
        <span className={`opacity-60 font-sans text-xs mt-1.5 tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</span>
        <div className="mt-3 text-[9px] opacity-30 font-mono">{locale}</div>
      </div>
    </>
  );
}