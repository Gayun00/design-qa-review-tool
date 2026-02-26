import { MembershipIcon, type MembershipGrade, type IconSize } from '@/components/MembershipIcon';

export type BadgeVariant = 'filled' | 'outlined';

interface MembershipGradeBadgeProps {
  grade: MembershipGrade;
  size?: IconSize;
  variant?: BadgeVariant;
  showLabel?: boolean;
}

const gradeLabel: Record<MembershipGrade, string> = {
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
};

const gradeBgMap: Record<MembershipGrade, string> = {
  silver: 'bg-membership-silver/10',
  gold: 'bg-membership-gold/10',
  platinum: 'bg-membership-platinum/10',
  diamond: 'bg-membership-diamond/10',
};

const gradeBorderMap: Record<MembershipGrade, string> = {
  silver: 'border-membership-silver',
  gold: 'border-membership-gold',
  platinum: 'border-membership-platinum',
  diamond: 'border-membership-diamond',
};

const gradeTextMap: Record<MembershipGrade, string> = {
  silver: 'text-membership-silver',
  gold: 'text-membership-gold',
  platinum: 'text-membership-platinum',
  diamond: 'text-membership-diamond',
};

const sizeTextMap: Record<IconSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const sizePaddingMap: Record<IconSize, string> = {
  sm: 'px-1.5 py-0.5',
  md: 'px-2 py-1',
  lg: 'px-3 py-1.5',
};

export function MembershipGradeBadge({
  grade,
  size = 'md',
  variant = 'filled',
  showLabel = true,
}: MembershipGradeBadgeProps) {
  const baseClasses = `inline-flex items-center gap-1 rounded-full font-medium ${sizePaddingMap[size]} ${sizeTextMap[size]}`;

  const variantClasses =
    variant === 'filled'
      ? `${gradeBgMap[grade]} ${gradeTextMap[grade]}`
      : `border ${gradeBorderMap[grade]} ${gradeTextMap[grade]} bg-transparent`;

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      <MembershipIcon grade={grade} size={size} />
      {showLabel && <span>{gradeLabel[grade]}</span>}
    </span>
  );
}

export default MembershipGradeBadge;
