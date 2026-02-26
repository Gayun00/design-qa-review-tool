export type MembershipGrade = 'silver' | 'gold' | 'platinum' | 'diamond';
export type IconSize = 'sm' | 'md' | 'lg';

interface MembershipIconProps {
  grade: MembershipGrade;
  size?: IconSize;
}

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

const gradeColorMap: Record<MembershipGrade, string> = {
  silver: 'text-membership-silver',
  gold: 'text-membership-gold',
  platinum: 'text-membership-platinum',
  diamond: 'text-membership-diamond',
};

const gradeSymbol: Record<MembershipGrade, string> = {
  silver: '★',
  gold: '★★',
  platinum: '★★★',
  diamond: '◆',
};

export function MembershipIcon({ grade, size = 'md' }: MembershipIconProps) {
  const px = sizeMap[size];

  return (
    <span
      className={`inline-flex items-center justify-center font-bold ${gradeColorMap[grade]}`}
      style={{ width: px, height: px, fontSize: px * 0.6 }}
      role="img"
      aria-label={`${grade} membership icon`}
    >
      {gradeSymbol[grade]}
    </span>
  );
}

export default MembershipIcon;
