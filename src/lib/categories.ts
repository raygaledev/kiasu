import {
  Code,
  Palette,
  Briefcase,
  FlaskConical,
  Languages,
  Music,
  Heart,
  PenLine,
  User,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { type Category } from './category-values';

export { CATEGORY_VALUES, type Category } from './category-values';

const ICON_MAP: Record<Category, LucideIcon> = {
  programming: Code,
  design: Palette,
  business: Briefcase,
  science: FlaskConical,
  language: Languages,
  music: Music,
  health: Heart,
  writing: PenLine,
  personal: User,
  other: BookOpen,
};

export const CATEGORIES = (
  Object.entries(ICON_MAP) as [Category, LucideIcon][]
).map(([value, icon]) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
  icon,
}));

export function getCategoryIcon(category: string): LucideIcon {
  return ICON_MAP[category as Category] ?? BookOpen;
}
