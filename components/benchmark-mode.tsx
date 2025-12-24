"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { quickSortRecursiveBenchmark, quickSortIterativeBenchmark } from "@/lib/quick-sort"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

type BenchmarkResult = {
  n: number
  recursiveTime: number
  iterativeTime: number
  recursiveOps: number
  iterativeOps: number
}

type DataScenario = "random" | "ascending" | "descending"

export default function BenchmarkMode() {
  const [results, setResults] = useState<BenchmarkResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [scenario, setScenario] = useState<DataScenario>("random")
  const [metric, setMetric] = useState<"time" | "operations">("time")
  const [testSizesInput, setTestSizesInput] = useState("1, 10, 20, 50, 100, 500, 1000, 5000, 10000")
  const [testSizes, setTestSizes] = useState<number[]>([1, 10, 20, 50, 100, 500, 1000, 5000, 10000])

  const parseTestSizes = (input: string): number[] => {
    const sizes = input
      .split(",")
      .map((s) => Number.parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0)
      .sort((a, b) => a - b)

    return sizes.length > 0 ? sizes : [1]
  }

  const handleTestSizesChange = (value: string) => {
    setTestSizesInput(value)
    const parsed = parseTestSizes(value)
    setTestSizes(parsed)
  }

  const generateTestData = (size: number, type: DataScenario): number[] => {
    switch (type) {
      case "random":
        return Array.from({ length: size }, () => Math.floor(Math.random() * 10000))
      case "ascending":
        return Array.from({ length: size }, (_, i) => i)
      case "descending":
        return Array.from({ length: size }, (_, i) => size - i)
    }
  }

  const runBenchmark = async () => {
    setIsRunning(true)
    setResults([])

    const newResults: BenchmarkResult[] = []

    for (const size of testSizes) {
      // Give UI time to update
      await new Promise((resolve) => setTimeout(resolve, 0))

      const testData = generateTestData(size, scenario)

      // Benchmark recursive
      const recursiveResult = quickSortRecursiveBenchmark([...testData])

      // Benchmark iterative
      const iterativeResult = quickSortIterativeBenchmark([...testData])

      newResults.push({
        n: size,
        recursiveTime: recursiveResult.time,
        iterativeTime: iterativeResult.time,
        recursiveOps: recursiveResult.operations,
        iterativeOps: iterativeResult.operations,
      })

      setResults([...newResults])
    }

    setIsRunning(false)
  }

  const chartData = results.map((r) => ({
    n: r.n,
    Recursive: metric === "time" ? r.recursiveTime : r.recursiveOps,
    Iterative: metric === "time" ? r.iterativeTime : r.iterativeOps,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Benchmark</CardTitle>
          <CardDescription>Bandingkan performa implementasi Quick Sort Rekursif vs Iteratif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="test-sizes">Ukuran Tes (angka dipisahkan koma)</Label>
            <Input
              id="test-sizes"
              value={testSizesInput}
              onChange={(e) => handleTestSizesChange(e.target.value)}
              placeholder="contoh: 1, 10, 50, 100, 1000"
              disabled={isRunning}
            />
            <p className="text-xs text-muted-foreground">Ukuran saat ini: {testSizes.join(", ")}</p>
          </div>

          <div className="space-y-2">
            <Label>Skenario Data</Label>
            <RadioGroup value={scenario} onValueChange={(v) => setScenario(v as DataScenario)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random" className="font-normal cursor-pointer">
                  Acak (Average Case)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ascending" id="ascending" />
                <Label htmlFor="ascending" className="font-normal cursor-pointer">
                  Terurut Naik (Worst Case O(n²))
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="descending" id="descending" />
                <Label htmlFor="descending" className="font-normal cursor-pointer">
                  Terurut Turun
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Metrik yang Ditampilkan</Label>
            <RadioGroup value={metric} onValueChange={(v) => setMetric(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time" id="time" />
                <Label htmlFor="time" className="font-normal cursor-pointer">
                  Waktu Eksekusi (ms)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="operations" id="operations" />
                <Label htmlFor="operations" className="font-normal cursor-pointer">
                  Jumlah Operasi (perbandingan + pertukaran)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={runBenchmark} disabled={isRunning} className="w-full">
            {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRunning ? "Menjalankan Benchmark..." : "Jalankan Benchmark"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Grafik Performa</CardTitle>
              <CardDescription>
                {metric === "time" ? "Waktu Eksekusi (ms)" : "Jumlah Operasi"} vs Ukuran Input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="n" label={{ value: "Ukuran Input (N)", position: "insideBottom", offset: -5 }} />
                    <YAxis
                      label={{
                        value: metric === "time" ? "Waktu (ms)" : "Operasi",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Recursive"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Rekursif"
                    />
                    <Line
                      type="monotone"
                      dataKey="Iterative"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Iteratif"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabel Data Mentah</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">N</th>
                      <th className="p-2 text-right">Waktu Rekursif (ms)</th>
                      <th className="p-2 text-right">Waktu Iteratif (ms)</th>
                      <th className="p-2 text-right">Operasi Rekursif</th>
                      <th className="p-2 text-right">Operasi Iteratif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.n} className="border-b">
                        <td className="p-2 font-mono">{result.n}</td>
                        <td className="p-2 text-right font-mono">{result.recursiveTime.toFixed(6)}</td>
                        <td className="p-2 text-right font-mono">{result.iterativeTime.toFixed(6)}</td>
                        <td className="p-2 text-right font-mono">{result.recursiveOps}</td>
                        <td className="p-2 text-right font-mono">{result.iterativeOps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
