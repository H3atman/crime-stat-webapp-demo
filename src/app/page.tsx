import ModernCrimeStatsDashboard from "@/components/modern-crime-stats-dashboard"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-7xl">
        <ModernCrimeStatsDashboard />
      </div>
    </main>
  );
}
