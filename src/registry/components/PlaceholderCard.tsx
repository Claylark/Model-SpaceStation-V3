import type { ComponentProps } from '../../types/config';

export default function PlaceholderCard({ props }: { props: ComponentProps }) {
  const sectionId = props.sectionId as string | undefined;
  const title = props.title as string || '';
  const subtitle = props.subtitle as string || '';

  return (
    <>
      {sectionId && (
        <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          {sectionId} SECTION
        </div>
      )}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full h-full p-6">
        <span className="font-bold tracking-widest text-2xl drop-shadow-md pr-1">{title}</span>
        <span className="opacity-60 font-sans text-xs mt-1.5 tracking-wide">{subtitle}</span>
      </div>
    </>
  );
}