import { Loader2 } from 'lucide-react'

const CircularLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="p-52">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
  )
}

export default CircularLoading
