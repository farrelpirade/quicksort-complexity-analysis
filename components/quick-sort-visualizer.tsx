"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnimationMode from "./animation-mode"
import BenchmarkMode from "./benchmark-mode"
import EducationalPanel from "./educational-panel"

export default function QuickSortVisualizer() {
  const [activeTab, setActiveTab] = useState("animation")

  return (
    <div className="container mx-auto p-4 max-w-[1800px]">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Visualisasi & Analisis Quick Sort</h1>
        <p className="text-muted-foreground">
          Visualisasikan dan analisis performa algoritma Quick Sort dengan implementasi rekursif dan iteratif
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="animation">Mode Animasi</TabsTrigger>
          <TabsTrigger value="benchmark">Mode Benchmark</TabsTrigger>
        </TabsList>

        <TabsContent value="animation" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <AnimationMode />
            </div>
            <div>
              <EducationalPanel />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="benchmark" className="mt-6">
          <BenchmarkMode />
        </TabsContent>
      </Tabs>
    </div>
  )
}
