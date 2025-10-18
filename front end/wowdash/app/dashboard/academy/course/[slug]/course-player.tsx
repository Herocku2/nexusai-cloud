'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, CheckCircle2, Clock } from "lucide-react"
import { updateCourseProgress } from "@/app/actions/academy"

interface CoursePlayerProps {
  course: any
  progress: any
}

export default function CoursePlayer({ course, progress }: CoursePlayerProps) {
  const [currentProgress, setCurrentProgress] = useState(progress?.progress_percentage || 0)
  const [isCompleted, setIsCompleted] = useState(progress?.status === 'completed')

  const handleMarkAsComplete = async () => {
    const result = await updateCourseProgress(course.id.toString(), 100, true)
    
    if (result.success) {
      setCurrentProgress(100)
      setIsCompleted(true)
    }
  }

  const handleUpdateProgress = async (percentage: number) => {
    setCurrentProgress(percentage)
    await updateCourseProgress(course.id.toString(), percentage, false)
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="card">
        <CardContent className="p-0">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {course.url ? (
              <iframe
                src={course.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-4" />
                  <p>Contenido de video próximamente</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Info */}
      <Card className="card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            {!isCompleted && (
              <Button onClick={handleMarkAsComplete} className="ml-4">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Marcar como Completado
              </Button>
            )}
            {isCompleted && (
              <div className="ml-4 flex items-center gap-2 text-green-600 bg-green-500/10 px-4 py-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Completado</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Tu progreso</span>
              <span className="font-medium">{currentProgress}%</span>
            </div>
            <div className="w-full bg-muted h-3 rounded-full">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>

          {/* Course Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Duración</p>
              <p className="font-medium flex items-center gap-1 mt-1">
                <Clock className="h-4 w-4" />
                {course.duration} min
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categoría</p>
              <p className="font-medium mt-1">{course.category || 'General'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="font-medium mt-1">{course.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Acceso</p>
              <p className="font-medium mt-1">
                {course.is_free ? 'Gratis' : 'Premium'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Progress Buttons */}
      {!isCompleted && (
        <Card className="card">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Actualizar Progreso</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateProgress(25)}
              >
                25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateProgress(50)}
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateProgress(75)}
              >
                75%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateProgress(100)}
              >
                100%
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
