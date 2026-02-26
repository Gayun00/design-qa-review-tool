import { MembershipItem } from '@/components/MembershipItem';
import type { MembershipGrade, IconSize } from '@/components/MembershipIcon';
import type { BadgeVariant } from '@/components/MembershipGradeBadge';

interface ProfileHeaderProps {
  userName: string;
  email: string;
  grade: MembershipGrade;
  badgeSize?: IconSize;
  badgeVariant?: BadgeVariant;
  joinDate?: string;
}

export function ProfileHeader({
  userName,
  email,
  grade,
  badgeSize = 'md',
  badgeVariant = 'filled',
  joinDate,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">프로필</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <MembershipItem
        userName={userName}
        grade={grade}
        badgeSize={badgeSize}
        badgeVariant={badgeVariant}
        showInfoButton={true}
      />

      {joinDate && (
        <p className="mt-3 text-xs text-gray-400">
          가입일: {joinDate}
        </p>
      )}
    </div>
  );
}

export default ProfileHeader;
