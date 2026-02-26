import type { Meta, StoryObj } from '@storybook/react';
import { MembershipGradeInfoModal } from './MembershipGradeInfoModal';

const meta: Meta<typeof MembershipGradeInfoModal> = {
  title: 'Components/MembershipGradeInfoModal',
  component: MembershipGradeInfoModal,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MembershipGradeInfoModal>;

export const SilverModal: Story = {
  args: { grade: 'silver', isOpen: true, onClose: () => {} },
};

export const GoldModal: Story = {
  args: { grade: 'gold', isOpen: true, onClose: () => {} },
};

export const PlatinumModal: Story = {
  args: { grade: 'platinum', isOpen: true, onClose: () => {} },
};

export const DiamondModal: Story = {
  args: { grade: 'diamond', isOpen: true, onClose: () => {} },
};
