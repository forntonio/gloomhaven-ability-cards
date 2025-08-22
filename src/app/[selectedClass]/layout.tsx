import ClassProvider from '@/context/ClassContext';
import { classNameToURI, classURIToName } from '@/domain/frosthaven-class';
import { frosthavenClasses } from '@/domain/frosthaven-class';
import { jotlClasses } from '@/domain/jotl-class';
import { getClassByName } from '@/domain/all-classes';
import type { FrosthavenClassNames } from '@/domain/frosthaven-class.type';
import type { Metadata, ResolvingMetadata } from 'next';
import DisplayClassMat from './DisplayClassMat';

export const dynamicParams = true;

type Params = Promise<{
  selectedClass: FrosthavenClassNames;
}>;

export function generateStaticParams() {
  const classes = [...frosthavenClasses, ...jotlClasses];
  return classes.map(({ name }) => ({
    selectedClass: classNameToURI(name),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { selectedClass } = await params;
  const className = classURIToName(selectedClass);
  const keywords = (await parent).keywords ?? [];

  return {
    title: `${className} - Ability Cards`,
    description: `Manage your ${className} Cards`,
    keywords: [...keywords, className],
  }
}

export default async function Layout({
  params,
  children,
}: LayoutProps<'/[selectedClass]'>) {
  const { selectedClass } = await params;
  const className = classURIToName(selectedClass);
  const fhClass = getClassByName(className);
  if (!fhClass) {
    throw new Error(`Unknown class ${className}`);
  }

  return <div data-theme={selectedClass}>
    <ClassProvider fhClass={fhClass}>
      {children}
      <div className='absolute left-0 top-0 p-4 flex flex-col items-end gap-2'>
        <DisplayClassMat />
      </div>
    </ClassProvider>
  </div>;
}
