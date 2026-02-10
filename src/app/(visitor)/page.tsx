
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Visitor Home</h1>
      <p className="text-xl mb-8">Welcome to AutoFolio - The Personal RAG Portfolio</p>
      <div className="flex gap-4">
        <Button asChild>
          <a href="/dashboard">Go to Admin Dashboard</a>
        </Button>
      </div>
    </div>
  )
}
