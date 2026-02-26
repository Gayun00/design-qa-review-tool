import type { Meta, StoryObj } from '@storybook/react';
import { MembershipGradeBadge } from './MembershipGradeBadge';

const meta: Meta<typeof MembershipGradeBadge> = {
  title: 'Components/MembershipGradeBadge',
  component: MembershipGradeBadge,
};

export default meta;
type Story = StoryObj<typeof MembershipGradeBadge>;

export const SilverFilled: Story = {
  args: { grade: 'silver', size: 'md', variant: 'filled' },
};

export const GoldFilled: Story = {
  args: { grade: 'gold', size: 'md', variant: 'filled' },
};

export const PlatinumFilled: Story = {
  args: { grade: 'platinum', size: 'md', variant: 'filled' },
};

export const DiamondOutlined: Story = {
  args: { grade: 'diamond', size: 'md', variant: 'outlined' },
};

export const SmallBadge: Story = {
  args: { grade: 'gold', size: 'sm', variant: 'filled' },
};

export const LargeBadge: Story = {
  args: { grade: 'platinum', size: 'lg', variant: 'filled' },
};

export const IconOnly: Story = {
  args: { grade: 'diamond', size: 'md', variant: 'filled', showLabel: false },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MembershipGradeBadge grade="silver" variant="filled" />
        <MembershipGradeBadge grade="silver" variant="outlined" />
      </div>
      <div className="flex items-center gap-2">
        <MembershipGradeBadge grade="gold" variant="filled" />
        <MembershipGradeBadge grade="gold" variant="outlined" />
      </div>
      <div className="flex items-center gap-2">
        <MembershipGradeBadge grade="platinum" variant="filled" />
        <MembershipGradeBadge grade="platinum" variant="outlined" />
      </div>
      <div className="flex items-center gap-2">
        <MembershipGradeBadge grade="diamond" variant="filled" />
        <MembershipGradeBadge grade="diamond" variant="outlined" />
      </div>
    </div>
  ),
};
