import { frosthavenClasses } from '@/domain/frosthaven-class';
import { jotlClasses } from '@/domain/jotl-class';
import ClassSelection from './ClassSelection';

export default function SelectClassPage() {
  return <ClassSelection frosthavenClasses={frosthavenClasses} jotlClasses={jotlClasses} />;
}
