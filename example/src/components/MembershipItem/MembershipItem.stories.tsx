import type { Meta, StoryObj } from '@storybook/react';
import { MembershipItem } from './MembershipItem';

const meta: Meta<typeof MembershipItem> = {
  title: 'Components/MembershipItem',
  component: MembershipItem,
};

export default meta;
type Story = StoryObj<typeof MembershipItem>;

export const SilverMember: Story = {
  args: {
    userName: '김하나',
    grade: 'silver',
    badgeSize: 'sm',
    badgeVariant: 'filled',
  },
};

export const GoldMember: Story = {
  args: {
    userName: '이두리',
    grade: 'gold',
    badgeSize: 'sm',
    badgeVariant: 'filled',
  },
};

export const PlatinumMember: Story = {
  args: {
    userName: '박세영',
    grade: 'platinum',
    badgeSize: 'md',
    badgeVariant: 'outlined',
  },
};

export const DiamondMember: Story = {
  args: {
    userName: '최다윤',
    grade: 'diamond',
    badgeSize: 'md',
    badgeVariant: 'filled',
    showInfoButton: true,
  },
};

export const WithoutInfoButton: Story = {
  args: {
    userName: '정수민',
    grade: 'gold',
    badgeSize: 'sm',
    showInfoButton: false,
  },
};
