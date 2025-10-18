'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLoading } from '@/contexts/LoadingContext'
import { forgotPasswordSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRef, useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { resetPassword } from '@/app/actions/auth'

const ForgotPasswordComponent = () => {
  const { loading, setLoading } = useLoading()
  const [isPending, startTransition] = useTransition()
  const [emailSent, setEmailSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true)

    startTransition(async () => {
      try {
        if (!formRef.current) return

        const formData = new FormData(formRef.current)
        const result = await resetPassword(formData)

        if (result?.success) {
          toast.success(result.message || 'Check your email for the reset link!')
          setEmailSent(true)
        } else if (result?.error) {
          toast.error(result.error)
        }
      } catch (error) {
        console.error('Forgot password error:', error)
        toast.error('Something went wrong. Please try again.')
      } finally {
        setTimeout(() => setLoading(false), 1000)
      }
    })
  }


  return (
    <>
      {emailSent ? (
        <div className="text-center py-8">
          <div className="mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Check your email</h3>
          <p className="text-secondary-light mb-6">
            We've sent a password reset link to your email address.
          </p>
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute start-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          name="email"
                          className="ps-13 pe-12 h-14 rounded-xl bg-neutral-100 dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 focus:border-primary dark:focus:border-primary focus-visible:border-primary !shadow-none !ring-0"
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-lg h-[52px] text-sm mt-2"
                disabled={loading || isPending}
              >
                {loading || isPending ? (
                  <>
                    <Loader2 className="animate-spin h-4.5 w-4.5 mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Recovery Email'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm">
            <p>
              Forget it. Send me back to{' '}
              <Link
                href="/auth/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </>
      )}
    </>
  )
}

export default ForgotPasswordComponent
