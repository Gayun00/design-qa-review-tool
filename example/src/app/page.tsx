import { ProfileHeader } from '@/components/ProfileHeader';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Design QA Test App</h1>
      <ProfileHeader
        userName="김하나"
        email="hana@example.com"
        grade="gold"
        badgeSize="md"
        badgeVariant="filled"
        joinDate="2024-03-15"
      />
    </main>
  );
}
