import type { Meta, StoryObj } from '@storybook/react';
import { ProfileHeader } from './ProfileHeader';

const meta: Meta<typeof ProfileHeader> = {
  title: 'Components/ProfileHeader',
  component: ProfileHeader,
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const SilverUser: Story = {
  args: {
    userName: '김하나',
    email: 'hana@example.com',
    grade: 'silver',
    badgeSize: 'sm',
    badgeVariant: 'filled',
    joinDate: '2024-03-15',
  },
};

export const GoldUser: Story = {
  args: {
    userName: '이두리',
    email: 'duri@example.com',
    grade: 'gold',
    badgeSize: 'md',
    badgeVariant: 'filled',
    joinDate: '2023-11-01',
  },
};

export const PlatinumUser: Story = {
  args: {
    userName: '박세영',
    email: 'seyoung@example.com',
    grade: 'platinum',
    badgeSize: 'md',
    badgeVariant: 'outlined',
  },
};

export const DiamondUser: Story = {
  args: {
    userName: '최다윤',
    email: 'dayun@example.com',
    grade: 'diamond',
    badgeSize: 'lg',
    badgeVariant: 'filled',
    joinDate: '2022-01-10',
  },
};
