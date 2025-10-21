'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Link2, Copy, Check, ChevronLeft, ChevronRight, Scale } from 'lucide-react'

interface ReferralSectionProps {
  userId: string
  currentPreference: string
  translations: {
    yourReferralLink: string
    shareThisLink: string
    copy: string
    copied: string
    placementPreference: string
    selectLeg: string
    leftLeg: string
    rightLeg: string
    autoBalance: string
    currentPreference: string
    updatePreference: string
    leftLegDesc: string
    rightLegDesc: string
    autoBalanceDesc: string
  }
}

export default function ReferralSection({ userId, currentPreference, translations }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false)
  const [preference, setPreference] = useState(currentPreference)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const referralLink = `https://nexusai.cloud/auth/register?sponsor=${userId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleUpdatePreference = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const { updatePlacementPreference } = await import('@/app/actions/referral')
      const result = await updatePlacementPreference(formData)

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Preferencia actualizada exitosamente' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar' })
    }

    setIsUpdating(false)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Referral Link Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {translations.yourReferralLink}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">
              {translations.shareThisLink}
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                readOnly
                value={referralLink}
                className="font-mono text-sm"
              />
              <Button
                type="button"
                onClick={copyToClipboard}
                variant={copied ? "default" : "outline"}
                className="min-w-[100px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {translations.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    {translations.copy}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Comparte este enlace en redes sociales, correo electrónico o mensajería para construir tu equipo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Placement Preference Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            {translations.placementPreference}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePreference} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                {message.text}
              </div>
            )}
            
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">
                {translations.selectLeg}
              </Label>
              
              <RadioGroup
                name="placement_preference"
                value={preference}
                onValueChange={setPreference}
                className="space-y-3"
              >
                {/* Left Leg Option */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="left" id="left" />
                  <label htmlFor="left" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <ChevronLeft className="h-4 w-4 text-blue-500" />
                      {translations.leftLeg}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {translations.leftLegDesc}
                    </p>
                  </label>
                </div>

                {/* Right Leg Option */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="right" id="right" />
                  <label htmlFor="right" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <ChevronRight className="h-4 w-4 text-orange-500" />
                      {translations.rightLeg}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {translations.rightLegDesc}
                    </p>
                  </label>
                </div>

                {/* Auto Balance Option */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="auto" id="auto" />
                  <label htmlFor="auto" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <Scale className="h-4 w-4 text-purple-500" />
                      {translations.autoBalance}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {translations.autoBalanceDesc}
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUpdating || preference === currentPreference}
            >
              {isUpdating ? 'Actualizando...' : translations.updatePreference}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
