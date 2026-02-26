'use client';

import { useState } from 'react';
import { MembershipGradeBadge, type BadgeVariant } from '@/components/MembershipGradeBadge';
import { MembershipGradeInfoModal } from '@/components/MembershipGradeInfoModal';
import type { MembershipGrade, IconSize } from '@/components/MembershipIcon';

interface MembershipItemProps {
  userName: string;
  grade: MembershipGrade;
  badgeSize?: IconSize;
  badgeVariant?: BadgeVariant;
  showInfoButton?: boolean;
}

export function MembershipItem({
  userName,
  grade,
  badgeSize = 'md',
  badgeVariant = 'filled',
  showInfoButton = true,
}: MembershipItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-500">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <MembershipGradeBadge
            grade={grade}
            size={badgeSize}
            variant={badgeVariant}
          />
        </div>
      </div>

      {showInfoButton && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          등급 정보
        </button>
      )}

      <MembershipGradeInfoModal
        grade={grade}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default MembershipItem;
