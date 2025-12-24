import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function EducationalPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kompleksitas Algoritma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Time Complexity</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Best Case:</span>
                <span className="font-mono">O(n log n)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Average Case:</span>
                <span className="font-mono">O(n log n)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Worst Case:</span>
                <span className="font-mono">O(n²)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Space Complexity</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Rekursif:</span>
                <span className="font-mono">O(log n)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Iteratif:</span>
                <span className="font-mono">O(log n)</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Rekursif vs Iteratif</AlertTitle>
        <AlertDescription className="text-sm space-y-2 mt-2">
          <p>
            <strong>Rekursif:</strong> Menggunakan call stack sistem untuk melacak sub-masalah. Setiap pemanggilan
            rekursif menambahkan frame ke stack.
          </p>
          <p>
            <strong>Iteratif:</strong> Menggunakan struktur data stack tambahan eksplisit untuk mensimulasikan perilaku
            rekursif, memberikan kontrol lebih terhadap stack.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
