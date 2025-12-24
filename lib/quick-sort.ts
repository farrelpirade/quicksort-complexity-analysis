export type SortStep = {
  array: number[]
  colors: string[]
  stackInfo: string[]
  pivotIndex?: number
}

type BenchmarkResult = {
  time: number
  operations: number
}

// Recursive Quick Sort with Animation Steps
export function quickSortRecursiveAnimated(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  const colors = new Array(n).fill("bg-blue-500")

  function quickSortHelper(array: number[], low: number, high: number, depth: number): void {
    if (low < high) {
      const stackInfo = [`Level ${depth}: Sorting [${low}...${high}]`]

      // Choose pivot (last element)
      const pivotIndex = high
      colors[pivotIndex] = "bg-red-500"
      steps.push({
        array: [...array],
        colors: [...colors],
        stackInfo: [...stackInfo],
        pivotIndex,
      })

      // Partition
      let i = low - 1
      const pivot = array[pivotIndex]

      for (let j = low; j < high; j++) {
        colors[j] = "bg-yellow-500"
        steps.push({
          array: [...array],
          colors: [...colors],
          stackInfo: [...stackInfo, `Comparing: ${array[j]} with pivot ${pivot}`],
        })

        if (array[j] < pivot) {
          i++
          // Swap
          ;[array[i], array[j]] = [array[j], array[i]]
          steps.push({
            array: [...array],
            colors: [...colors],
            stackInfo: [...stackInfo, `Swapped: ${array[i]} <-> ${array[j]}`],
          })
        }
        colors[j] = "bg-blue-500"
      }

      // Place pivot in correct position
      i++
      ;[array[i], array[pivotIndex]] = [array[pivotIndex], array[i]]
      colors[pivotIndex] = "bg-blue-500"
      colors[i] = "bg-green-500"

      steps.push({
        array: [...array],
        colors: [...colors],
        stackInfo: [...stackInfo, `Pivot ${pivot} placed at position ${i}`],
      })

      const pi = i

      // Recursive calls
      quickSortHelper(array, low, pi - 1, depth + 1)
      quickSortHelper(array, pi + 1, high, depth + 1)

      // Mark sorted section
      for (let k = low; k <= high; k++) {
        colors[k] = "bg-green-500"
      }
    } else if (low === high) {
      colors[low] = "bg-green-500"
      steps.push({
        array: [...arr],
        colors: [...colors],
        stackInfo: [`Single element at ${low} is sorted`],
      })
    }
  }

  quickSortHelper(arr, 0, n - 1, 0)

  // Final step
  steps.push({
    array: [...arr],
    colors: new Array(n).fill("bg-green-500"),
    stackInfo: ["Sorting Complete!"],
  })

  return steps
}

// Iterative Quick Sort with Animation Steps
export function quickSortIterativeAnimated(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  const colors = new Array(n).fill("bg-blue-500")

  const stack: [number, number][] = []
  stack.push([0, n - 1])

  while (stack.length > 0) {
    const stackInfo = stack.map(([l, h]) => `Stack: [${l}...${h}]`).reverse()

    const [low, high] = stack.pop()!

    if (low < high) {
      stackInfo.unshift(`Processing: [${low}...${high}]`)

      // Choose pivot (last element)
      const pivotIndex = high
      colors[pivotIndex] = "bg-red-500"
      steps.push({
        array: [...arr],
        colors: [...colors],
        stackInfo: [...stackInfo],
      })

      // Partition
      let i = low - 1
      const pivot = arr[pivotIndex]

      for (let j = low; j < high; j++) {
        colors[j] = "bg-yellow-500"
        steps.push({
          array: [...arr],
          colors: [...colors],
          stackInfo: [...stackInfo, `Comparing: ${arr[j]} with pivot ${pivot}`],
        })

        if (arr[j] < pivot) {
          i++
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push({
            array: [...arr],
            colors: [...colors],
            stackInfo: [...stackInfo, `Swapped: ${arr[i]} <-> ${arr[j]}`],
          })
        }
        colors[j] = "bg-blue-500"
      }

      i++
      ;[arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]]
      colors[pivotIndex] = "bg-blue-500"
      colors[i] = "bg-green-500"

      const pi = i

      steps.push({
        array: [...arr],
        colors: [...colors],
        stackInfo: [...stackInfo, `Pivot ${pivot} placed at position ${pi}`],
      })

      // Push sub-arrays to stack
      if (pi + 1 < high) {
        stack.push([pi + 1, high])
      }
      if (low < pi - 1) {
        stack.push([low, pi - 1])
      }
    } else if (low === high) {
      colors[low] = "bg-green-500"
    }
  }

  // Final step
  steps.push({
    array: [...arr],
    colors: new Array(n).fill("bg-green-500"),
    stackInfo: ["Sorting Complete!"],
  })

  return steps
}

// Benchmark Recursive Quick Sort
export function quickSortRecursiveBenchmark(arr: number[]): BenchmarkResult {
  let operations = 0

  function partition(array: number[], low: number, high: number): number {
    const pivot = array[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      operations++ // comparison
      if (array[j] < pivot) {
        i++
        ;[array[i], array[j]] = [array[j], array[i]]
        operations++ // swap
      }
    }

    i++
    ;[array[i], array[high]] = [array[high], array[i]]
    operations++ // swap
    return i
  }

  function quickSort(array: number[], low: number, high: number): void {
    if (low < high) {
      const pi = partition(array, low, high)
      quickSort(array, low, pi - 1)
      quickSort(array, pi + 1, high)
    }
  }

  const startTime = performance.now()
  quickSort(arr, 0, arr.length - 1)
  const endTime = performance.now()

  return {
    time: endTime - startTime,
    operations,
  }
}

// Benchmark Iterative Quick Sort
export function quickSortIterativeBenchmark(arr: number[]): BenchmarkResult {
  let operations = 0
  const stack: [number, number][] = []
  stack.push([0, arr.length - 1])

  const startTime = performance.now()

  while (stack.length > 0) {
    const [low, high] = stack.pop()!

    if (low < high) {
      // Partition
      const pivot = arr[high]
      let i = low - 1

      for (let j = low; j < high; j++) {
        operations++ // comparison
        if (arr[j] < pivot) {
          i++
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          operations++ // swap
        }
      }

      i++
      ;[arr[i], arr[high]] = [arr[high], arr[i]]
      operations++ // swap

      const pi = i

      if (pi + 1 < high) {
        stack.push([pi + 1, high])
      }
      if (low < pi - 1) {
        stack.push([low, pi - 1])
      }
    }
  }

  const endTime = performance.now()

  return {
    time: endTime - startTime,
    operations,
  }
}
