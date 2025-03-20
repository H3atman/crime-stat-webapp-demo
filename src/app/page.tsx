import ModernCrimeStatsDashboard from "@/components/modern-crime-stats-dashboard"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-6 px-4 md:p-12">
      <div className="w-full max-w-7xl space-y-8">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
            Demo Application
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Crime Data Classification Tool
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A tool for processing and classifying crime data from the Philippine National Police's CIRAS system, following official PNP guidelines. Automatically adds OFFENSE CATEGORY columns and simplifies the 8 Focus Crimes Classification for streamlined reporting.
          </p>
        </div>
        
        <ModernCrimeStatsDashboard />
        
        <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-3">About This Portfolio Demo</h2>
          <p className="mb-4">
            This tool demonstrates my ability to create practical, user-friendly applications 
            that solve real-world problems. It showcases:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Building responsive, modern UIs with Next.js and Tailwind CSS</li>
            <li>Handling complex file processing with Fast API Python backend services</li>
            <li>Implementing secure API routes with proper error handling</li>
            <li>Creating a seamless user experience with responsive feedback</li>
            <li>Connecting a modern React frontend with a high-performance Python backend</li>
            <li>Data transformation that adds critical classification fields for PNP reporting</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
