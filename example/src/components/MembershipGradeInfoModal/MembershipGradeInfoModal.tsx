import { MembershipGradeBadge } from '@/components/MembershipGradeBadge';
import type { MembershipGrade } from '@/components/MembershipIcon';

interface MembershipGradeInfoModalProps {
  grade: MembershipGrade;
  isOpen: boolean;
  onClose: () => void;
}

const gradeInfo: Record<MembershipGrade, { benefits: string[]; nextGrade: string }> = {
  silver: {
    benefits: ['기본 할인 5%', '무료 배송 월 1회'],
    nextGrade: '월 5만원 이상 구매 시 Gold 등급 승급',
  },
  gold: {
    benefits: ['할인 10%', '무료 배송 월 3회', '생일 쿠폰'],
    nextGrade: '월 10만원 이상 구매 시 Platinum 등급 승급',
  },
  platinum: {
    benefits: ['할인 15%', '무료 배송 무제한', '생일 쿠폰', 'VIP 라운지'],
    nextGrade: '월 30만원 이상 구매 시 Diamond 등급 승급',
  },
  diamond: {
    benefits: ['할인 20%', '무료 배송 무제한', '생일 쿠폰', 'VIP 라운지', '전담 매니저'],
    nextGrade: '최고 등급입니다',
  },
};

export function MembershipGradeInfoModal({
  grade,
  isOpen,
  onClose,
}: MembershipGradeInfoModalProps) {
  if (!isOpen) return null;

  const info = gradeInfo[grade];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-80 p-6">
        <div className="flex items-center justify-between mb-4">
          <MembershipGradeBadge grade={grade} size="lg" variant="filled" />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            &times;
          </button>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-2">혜택</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
          {info.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
          {info.nextGrade}
        </p>
      </div>
    </div>
  );
}

export default MembershipGradeInfoModal;
