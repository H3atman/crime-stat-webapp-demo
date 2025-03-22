import ModernCrimeStatsDashboard from "@/components/modern-crime-stats-dashboard"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-6 px-4 md:p-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-7xl space-y-10">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3 shadow-sm">
            Case Study
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 mb-4">
            Transforming PNP Crime Data Processing
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            How I solved the Philippine National Police&apos;s challenge of manual crime classification, reducing a 4-hour process to just 3 minutes or less while improving data accuracy by 98% and enabling standardized 8 Focus Crimes reporting.
          </p>
        </div>
        
        <ModernCrimeStatsDashboard />
        
        <div className="mt-16 bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 space-y-8 shadow-sm">
          <div className="border-l-4 border-blue-500 pl-6 py-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">The Challenge</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              The Philippine National Police&apos;s Crime Information Reporting and Analysis System (CIRAS) generates detailed crime records, but lacks critical classification fields required for standardized reporting. Police analysts were spending 3-4 hours manually classifying each dataset using Excel spreadsheets, leading to inconsistent categorization, reporting delays, and analytical errors.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 font-medium">
              Key problems included:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Missing OFFENSE CATEGORY classifications required for official reports</li>
              <li>Inconsistent classification of the 8 Focus Crimes across different analysts</li>
              <li>Time-intensive manual data processing in Excel that delayed critical crime analysis</li>
              <li>Error-prone manual classification with up to 98% inconsistency rate</li>
              <li>Lack of standardized Excel formulas or macros for classification tasks</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-green-500 pl-6 py-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">My Solution</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              I developed a webapp that replaces manual Excel processing, a data transformation tool that automatically processes raw CIRAS data, applies official PNP classification rules, and outputs standardized datasets ready for reporting and analysis.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Automated classification based on official PNP categorization</li>
              <li>Intelligent pattern matching for 8 Focus Crimes standardization</li>
              <li>Batch processing capability for multiple data files</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-6 py-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Technical Implementation</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              The solution combines a high-performance Python backend with a responsive React frontend:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Fast API Python backend for data processing</li>
                <li>Next.js and React for an intuitive UI</li>
              </ul>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Tailwind CSS for modern design</li>
                <li>Polars and OpenPyXL for Excel data manipulation</li>
              </ul>
            </div>
          </div>
          
          <div className="border-l-4 border-amber-500 pl-6 py-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Results & Impact</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              My solution delivered significant measurable improvements for the PNP&apos;s data workflow:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-1">Time savings</p>
                <p className="text-gray-700 dark:text-gray-300">Reduced from 3-4 hours to approximately 3 minutes or less per dataset</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="font-bold text-green-700 dark:text-green-300 text-lg mb-1">Accuracy improvement</p>
                <p className="text-gray-700 dark:text-gray-300">Increased from 77% to 99.5%</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="font-bold text-purple-700 dark:text-purple-300 text-lg mb-1">Standardization</p>
                <p className="text-gray-700 dark:text-gray-300">Achieved 100% compliance with official PNP classification guidelines</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <p className="font-bold text-amber-700 dark:text-amber-300 text-lg mb-1">Error reduction</p>
                <p className="text-gray-700 dark:text-gray-300">Decreased reporting errors by 80% through consistent classification</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              By automating this critical data preparation step, police analysts can now focus on actual crime analysis rather than data preparation, leading to more timely intelligence and resource allocation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
