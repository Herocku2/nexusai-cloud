# 📚 Ejemplos de Uso - Autenticación con Supabase

## 1. Server Components

### Proteger una Página con Server Component

```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>User ID: {user.id}</p>
    </div>
  )
}
```

### Obtener Datos del Usuario en Server Component

```typescript
// app/profile/page.tsx
import { getCurrentUser } from '@/app/actions/auth'
import { createClient } from '@/utils/supabase/server'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Usar Supabase para obtener datos adicionales
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div>
      <h1>{user.email}</h1>
      <p>Username: {profile?.username}</p>
    </div>
  )
}
```

## 2. Client Components

### Usar el Hook useAuth

```typescript
'use client'

import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function UserDashboard() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <Loader2 className="animate-spin" />
  }

  if (!isAuthenticated) {
    return <p>Please log in</p>
  }

  return (
    <div>
      <h2>Welcome back!</h2>
      <p>Email: {user?.email}</p>
    </div>
  )
}
```

### Acceder a Supabase en Client Component

```typescript
'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function RealtimeData() {
  const [data, setData] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Obtener datos iniciales
    const fetchData = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      
      setData(data || [])
    }

    fetchData()

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Change received!', payload)
          fetchData()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  )
}
```

## 3. Server Actions

### Crear un Server Action Personalizado

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Obtener usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  // Actualizar perfil
  const { error } = await supabase
    .from('profiles')
    .update({
      username: formData.get('username'),
      bio: formData.get('bio'),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}
```

### Usar el Server Action en un Form

```typescript
'use client'

import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function ProfileForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await updateProfile(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Profile updated!')
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="username" placeholder="Username" />
      <textarea name="bio" placeholder="Bio" />
      <Button type="submit">Update Profile</Button>
    </form>
  )
}
```

## 4. Route Handlers (API Routes)

### Crear un API Route Protegido

```typescript
// app/api/user/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
    }
  })
}
```

### Consumir el API Route

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function UserData() {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUserData(data.user))
  }, [])

  if (!userData) return <p>Loading...</p>

  return (
    <div>
      <p>Email: {userData.email}</p>
    </div>
  )
}
```

## 5. Logout

### Botón de Logout Simple

```typescript
'use client'

import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline">
        Cerrar Sesión
      </Button>
    </form>
  )
}
```

### Logout con Confirmación

```typescript
'use client'

import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function LogoutWithConfirm() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <>
      <Button onClick={() => setShowConfirm(true)}>
        Cerrar Sesión
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3>¿Estás seguro?</h3>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleLogout} variant="destructive">
                Sí, cerrar sesión
              </Button>
              <Button onClick={() => setShowConfirm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

## 6. Manejo de Sesión

### Verificar si el Usuario está Autenticado

```typescript
'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export function useSession() {
  const [session, setSession] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Escuchar cambios
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return session
}
```

## 7. Redirección Condicional

### Redirigir según Estado de Autenticación

```typescript
// app/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  // Si está autenticado, ir al dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Si no está autenticado, mostrar landing page
  return <LandingPage />
}
```

## 8. Actualizar Metadata del Usuario

### Server Action para Actualizar Metadata

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'

export async function updateUserMetadata(data: { username?: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    data: {
      username: data.username,
    }
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
```

## 9. Password Reset Flow Completo

### Página de Reset Password

```typescript
'use client'

import { updatePassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('password', password)
    
    const result = await updatePassword(formData)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Password updated successfully!')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
      />
      <Button type="submit">Actualizar Contraseña</Button>
    </form>
  )
}
```

## 10. Middleware Personalizado

### Agregar Lógica Custom al Middleware

```typescript
// middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Actualizar sesión de Supabase
  const response = await updateSession(request)

  // Agregar lógica personalizada
  const user = request.cookies.get('sb-access-token')
  
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    // Si está autenticado y trata de acceder a /auth, redirigir
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}
```

## 11. Proteger Rutas Específicas

### Crear un Componente de Protección

```typescript
// components/auth/protected-route.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'

export async function ProtectedRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <>{children}</>
}

// Uso:
// app/dashboard/page.tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard Content</div>
    </ProtectedRoute>
  )
}
```

## 12. Manejo de Errores

### Error Boundary para Autenticación

```typescript
'use client'

import { useEffect } from 'react'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Auth Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Try again
      </button>
    </div>
  )
}
```

## Recursos Adicionales

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
