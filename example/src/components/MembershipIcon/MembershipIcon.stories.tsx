import type { Meta, StoryObj } from '@storybook/react';
import { MembershipIcon } from './MembershipIcon';

const meta: Meta<typeof MembershipIcon> = {
  title: 'Components/MembershipIcon',
  component: MembershipIcon,
  argTypes: {
    grade: {
      control: 'select',
      options: ['silver', 'gold', 'platinum', 'diamond'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MembershipIcon>;

export const Silver: Story = {
  args: { grade: 'silver', size: 'md' },
};

export const Gold: Story = {
  args: { grade: 'gold', size: 'md' },
};

export const Platinum: Story = {
  args: { grade: 'platinum', size: 'md' },
};

export const Diamond: Story = {
  args: { grade: 'diamond', size: 'md' },
};

export const Small: Story = {
  args: { grade: 'gold', size: 'sm' },
};

export const Large: Story = {
  args: { grade: 'gold', size: 'lg' },
};

export const AllGrades: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <MembershipIcon grade="silver" size="lg" />
      <MembershipIcon grade="gold" size="lg" />
      <MembershipIcon grade="platinum" size="lg" />
      <MembershipIcon grade="diamond" size="lg" />
    </div>
  ),
};
