"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Play, Pause, RotateCcw } from "lucide-react"
import { quickSortRecursiveAnimated, quickSortIterativeAnimated, type SortStep } from "@/lib/quick-sort"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AnimationMode() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90])
  const [inputValue, setInputValue] = useState("64, 34, 25, 12, 22, 11, 90")
  const [sortMode, setSortMode] = useState<"recursive" | "iterative">("recursive")
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [displayArray, setDisplayArray] = useState<number[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [stackInfo, setStackInfo] = useState<string[]>([])
  const [activeRecursion, setActiveRecursion] = useState<{ left: number; right: number; depth: number; side: string }[]>([])
  const [history, setHistory] = useState<{ n: number; ops: number; type: string }[]>([])
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setDisplayArray([...array])
    setColors(new Array(array.length).fill("bg-blue-500"))
  }, [array])

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      animationRef.current = setTimeout(() => {
        const step = steps[currentStep]
        setDisplayArray([...step.array])
        setColors([...step.colors])
        setStackInfo([...step.stackInfo])
        setActiveRecursion(step.activeRecursion || [])
        setCurrentStep(currentStep + 1)
      }, 1000 - speed)
    } else if (currentStep >= steps.length && isPlaying) {
      setIsPlaying(false)
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isPlaying, currentStep, steps, speed])

  const handleGenerateRandom = () => {
    const size = Math.floor(Math.random() * 15) + 5
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
    setArray(randomArray)
    setInputValue(randomArray.join(", "))
    handleReset()
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    const parsed = value
      .split(",")
      .map((s) => Number.parseInt(s.trim()))
      .filter((n) => !isNaN(n))
    if (parsed.length > 0) {
      setArray(parsed)
      handleReset() // Reset steps ketika input manual diubah agar bisa mulai sorting baru
    }
  }

  const handleStart = () => {
    if (steps.length === 0) {
      const sortSteps =
        sortMode === "recursive" ? quickSortRecursiveAnimated([...array]) : quickSortIterativeAnimated([...array])
      setSteps(sortSteps)
      setCurrentStep(0)

      // Add to history
      setHistory(prev => [...prev, { n: array.length, ops: sortSteps.length, type: sortMode }].sort((a, b) => a.n - b.n))
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setDisplayArray([...array])
    setColors(new Array(array.length).fill("bg-blue-500"))
    setStackInfo([])
    setActiveRecursion([])
  }

  const maxValue = Math.max(...displayArray, 1)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kontrol & Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Mode Algoritma</Label>
            <RadioGroup
              value={sortMode}
              onValueChange={(v) => {
                setSortMode(v as any)
                handleReset()
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recursive" id="recursive" />
                <Label htmlFor="recursive" className="font-normal cursor-pointer">
                  Rekursif (Stack Sistem)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="iterative" id="iterative" />
                <Label htmlFor="iterative" className="font-normal cursor-pointer">
                  Iteratif (Stack Tambahan)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="array-input">Input Array (dipisahkan koma)</Label>
            <Input
              id="array-input"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="contoh: 64, 34, 25, 12, 22, 11, 90"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerateRandom} variant="outline" className="flex-1 bg-transparent">
              Acak
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Kecepatan Animasi: {speed}ms</Label>
            <Slider
              value={[speed]}
              onValueChange={(v) => setSpeed(v[0])}
              min={100}
              max={900}
              step={100}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            {!isPlaying ? (
              <Button onClick={handleStart} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Mulai
              </Button>
            ) : (
              <Button onClick={handlePause} variant="secondary" className="flex-1">
                <Pause className="mr-2 h-4 w-4" />
                Jeda
              </Button>
            )}
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="pt-4 border-t space-y-2">
            <h4 className="font-semibold text-sm">Legenda Warna:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Pivot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Terurut</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span>Membandingkan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Belum Terurut</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualisasi Utama</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-center gap-1 h-64 bg-muted/20 rounded-lg p-4">
            {displayArray.map((value, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end gap-1 min-w-[20px] max-w-[60px]"
              >
                <span className="text-xs font-mono">{value}</span>
                <div
                  className={`w-full ${colors[index]} transition-all duration-300 rounded-t`}
                  style={{ height: `${(value / maxValue) * 200}px` }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {activeRecursion.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Visualisasi Sub-Rekursi (Max 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRecursion.slice(0, 5).map((rec, idx) => (
                <div key={idx} className="border p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">Depth {rec.depth}</span>
                      <span className={`text-xs font-bold ${rec.side === 'Left' ? 'text-blue-600' : rec.side === 'Right' ? 'text-orange-600' : 'text-gray-600'}`}>
                        {rec.side === 'Root' ? 'Root' : `${rec.side} Partition`}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Range: [{rec.left}, {rec.right}]</span>
                  </div>
                  <div className="flex items-end justify-center gap-0.5 h-32 bg-muted/20 rounded p-2">
                    {displayArray.slice(rec.left, rec.right + 1).map((value, subIdx) => {
                      const originalIndex = rec.left + subIdx;
                      return (
                        <div
                          key={subIdx}
                          className="flex-1 flex flex-col items-center justify-end gap-0.5"
                        >
                          <span className="text-[10px] font-mono">{value}</span>
                          <div
                            className={`w-full ${colors[originalIndex]} transition-all duration-300 rounded-t`}
                            style={{ height: `${(value / maxValue) * 100}px` }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stackInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{sortMode === "recursive" ? "Stack Pemanggilan" : "Stack Tambahan"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {stackInfo.map((info, index) => (
                <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                  {info}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grafik Operasi per Ukuran Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="n" label={{ value: 'Ukuran Input (N)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Langkah Operasi', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="ops" stroke="#8884d8" strokeWidth={2} name="Operasi" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
