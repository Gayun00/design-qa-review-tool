import type { QAConfig } from '@design-qa/core';

const config: QAConfig = {
  host: {
    tsconfig: './tsconfig.json',
    globalCss: './src/app/globals.css',
    globalDecorator: './.storybook/preview.ts',
  },
  reviews: [
    // ── 1단계: 기본 컴포넌트 자체 리뷰 ──
    {
      name: 'MembershipIcon',
      storyPath: './src/components/MembershipIcon/MembershipIcon.stories.tsx',
      stories: ['Silver', 'Gold', 'Platinum', 'Diamond', 'Small', 'Large', 'AllGrades'],
    },
    {
      name: 'MembershipGradeBadge',
      storyPath: './src/components/MembershipGradeBadge/MembershipGradeBadge.stories.tsx',
      stories: ['SilverFilled', 'GoldFilled', 'PlatinumFilled', 'DiamondOutlined', 'SmallBadge', 'LargeBadge', 'IconOnly', 'AllVariants'],
      // 하위 컴포넌트: MembershipIcon
      childComponents: [
        {
          name: 'MembershipIcon',
          componentPath: './src/components/MembershipIcon',
          usages: [
            { story: 'SilverFilled', props: { grade: 'silver', size: 'md' } },
            { story: 'GoldFilled', props: { grade: 'gold', size: 'md' } },
            { story: 'PlatinumFilled', props: { grade: 'platinum', size: 'md' } },
            { story: 'DiamondOutlined', props: { grade: 'diamond', size: 'md' } },
            { story: 'SmallBadge', props: { grade: 'gold', size: 'sm' } },
            { story: 'LargeBadge', props: { grade: 'platinum', size: 'lg' } },
          ],
        },
      ],
    },
    {
      name: 'MembershipGradeInfoModal',
      storyPath: './src/components/MembershipGradeInfoModal/MembershipGradeInfoModal.stories.tsx',
      stories: ['SilverModal', 'GoldModal', 'PlatinumModal', 'DiamondModal'],
      // 하위 컴포넌트: MembershipGradeBadge
      childComponents: [
        {
          name: 'MembershipGradeBadge',
          componentPath: './src/components/MembershipGradeBadge',
          usages: [
            { story: 'SilverModal', props: { grade: 'silver', size: 'lg', variant: 'filled' } },
            { story: 'GoldModal', props: { grade: 'gold', size: 'lg', variant: 'filled' } },
            { story: 'PlatinumModal', props: { grade: 'platinum', size: 'lg', variant: 'filled' } },
            { story: 'DiamondModal', props: { grade: 'diamond', size: 'lg', variant: 'filled' } },
          ],
        },
      ],
    },

    // ── 2단계: 사용처 컴포넌트 리뷰 (중첩 props 추적) ──
    {
      name: 'MembershipItem',
      storyPath: './src/components/MembershipItem/MembershipItem.stories.tsx',
      stories: ['SilverMember', 'GoldMember', 'PlatinumMember', 'DiamondMember', 'WithoutInfoButton'],
      // 하위 컴포넌트: MembershipGradeBadge + MembershipGradeInfoModal
      childComponents: [
        {
          name: 'MembershipGradeBadge',
          componentPath: './src/components/MembershipGradeBadge',
          usages: [
            { story: 'SilverMember', props: { grade: 'silver', size: 'sm', variant: 'filled' } },
            { story: 'GoldMember', props: { grade: 'gold', size: 'sm', variant: 'filled' } },
            { story: 'PlatinumMember', props: { grade: 'platinum', size: 'md', variant: 'outlined' } },
            { story: 'DiamondMember', props: { grade: 'diamond', size: 'md', variant: 'filled' } },
            { story: 'WithoutInfoButton', props: { grade: 'gold', size: 'sm', variant: 'filled' }, label: 'badgeVariant 미지정 → default filled' },
          ],
        },
        {
          name: 'MembershipGradeInfoModal',
          componentPath: './src/components/MembershipGradeInfoModal',
          usages: [
            { story: 'SilverMember', props: { grade: 'silver', isOpen: true, onClose: () => {} } },
            { story: 'DiamondMember', props: { grade: 'diamond', isOpen: true, onClose: () => {} } },
          ],
        },
      ],
    },
    {
      name: 'ProfileHeader',
      storyPath: './src/components/ProfileHeader/ProfileHeader.stories.tsx',
      stories: ['SilverUser', 'GoldUser', 'PlatinumUser', 'DiamondUser'],
      // 하위 컴포넌트: MembershipItem (→ MembershipGradeBadge → MembershipIcon)
      childComponents: [
        {
          name: 'MembershipItem',
          componentPath: './src/components/MembershipItem',
          usages: [
            {
              story: 'SilverUser',
              props: { userName: '김하나', grade: 'silver', badgeSize: 'sm', badgeVariant: 'filled', showInfoButton: true },
            },
            {
              story: 'GoldUser',
              props: { userName: '이두리', grade: 'gold', badgeSize: 'md', badgeVariant: 'filled', showInfoButton: true },
            },
            {
              story: 'PlatinumUser',
              props: { userName: '박세영', grade: 'platinum', badgeSize: 'md', badgeVariant: 'outlined', showInfoButton: true },
            },
            {
              story: 'DiamondUser',
              props: { userName: '최다윤', grade: 'diamond', badgeSize: 'lg', badgeVariant: 'filled', showInfoButton: true },
            },
          ],
        },
      ],
    },
  ],
};

export default config;
