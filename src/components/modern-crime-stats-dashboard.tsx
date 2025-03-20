"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FileSpreadsheet, Moon, Sun, Upload, X, Trash2, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { API_ROUTES } from "@/lib/constants"

export default function ModernCrimeStatsDashboard() {
  const [files, setFiles] = React.useState<File[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const { toast } = useToast()
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
    )
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
      )
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
    }
  }

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove))
  }

  const clearAllFiles = () => {
    setFiles([])
    setDownloadUrl(null)
    toast({
      title: "Files Cleared",
      description: "All files have been removed from the queue.",
    })
  }

  const processFiles = async () => {
    setIsProcessing(true)
    setProgress(0)
    
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })
      formData.append("merge_type", "vertical")

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90))
      }, 500)

      const response = await fetch(API_ROUTES.PROCESS_FILES, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to process files")
      }

      const data = await response.json()
      setDownloadUrl(data.download_url)
      
      toast({
        title: "Success",
        description: "Files processed successfully! Click 'Download Result' to get your file.",
      })
    } catch (error) {
      console.error("Error processing files:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (!downloadUrl) return

    try {
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error("Failed to download file")

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/)
      const timestamp = new Date().toLocaleString('en-US', { 
        timeZone: 'America/New_York'
      }).replace(/[/:]/g, '')
      const date = new Date()
      const formattedTimestamp = date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0') +
        "-" +
        String(date.getHours()).padStart(2, '0') +
        String(date.getMinutes()).padStart(2, '0') +
        String(date.getSeconds()).padStart(2, '0')
      const filename = filenameMatch?.[1]?.replace('.xlsx', '') || 'processed_crime_stats'
      const finalFilename = `${filename}_${formattedTimestamp}.xlsx`

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = finalFilename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "File downloaded successfully!",
      })
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSampleDownload = () => {
    const sampleFileUrl = '/sample-data.xlsx';
    const a = document.createElement('a');
    a.href = sampleFileUrl;
    a.download = 'pnp-ciras-sample-data.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(sampleFileUrl);
    document.body.removeChild(a);
    
    toast({
      title: "Sample PNP CIRAS File Downloaded",
      description: "Use this sample file to test the 8 Focus Crimes classification and OFFENSE CATEGORY features.",
    });
  };

  return (
    <div className={cn("min-h-screen bg-background text-foreground")}>
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CIRAS-Link: Crime Data Classification Tool</h1>
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
          <Moon className="h-4 w-4" />
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transform Crime Statistics Data</CardTitle>
            <CardDescription>
              Process CIRAS v2 crime data files to add OFFENSE CATEGORY classifications and standardize the 8 Focus Crimes for PNP reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button 
                onClick={handleSampleDownload} 
                variant="outline" 
                className="w-full border-dashed border-blue-400 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample PNP CIRAS Data with Focus Crimes
              </Button>
            </div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-primary"
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".xls,.xlsx"
                onChange={handleFileSelect}
              />
              <Label
                htmlFor="file-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Drag and drop files here or click to select
                </span>
                <span className="text-sm text-muted-foreground">
                  Limit 200MB per file • XLS, XLSX
                </span>
              </Label>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 space-y-2"
                >
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-2 rounded bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="space-x-2">
              {files.length > 0 && (
                <Button
                  onClick={clearAllFiles}
                  variant="outline"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="space-x-2">
              {downloadUrl && (
                <Button onClick={handleDownload} variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">
                  Download Result
                </Button>
              )}
              {files.length > 0 && (
                <Button onClick={processFiles} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Process Files"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Files</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How to Use This Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
              <li>Upload one or more Detailed Crime Analysis Excel files (.xls, .xlsx) from CIRAS v2</li>
              <li>Click <strong>"Process Files"</strong> to automatically:
                <ul className="ml-6 mt-2 list-disc space-y-2">
                  <li>Merge multiple data files into a unified dataset</li>
                  <li><strong>Add OFFENSE CATEGORY</strong> column based on crime descriptions</li>
                  <li><strong>Simplify the 8 Focus Crimes</strong> into standardized classifications</li>
                  <li>Format data for compatibility with PNP reporting systems</li>
                </ul>
              </li>
              <li>When processing completes, download your formatted file for immediate use in reports</li>
              <li>Save hours of manual data formatting and classification work with a single click</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-blue-700 dark:text-blue-300">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                Data processing is performed by a high-performance Fast API Python backend, enabling efficient handling of large datasets.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 CIRAS-Link Data Processing Tool. All rights reserved.</p>
      </footer>
    </div>
  )
}
