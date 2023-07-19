import type React from 'react'

import {
  useOnboardingStore,
} from '@/features/onboarding/hooks/stores/use-onboarding-store'
import { Label } from '@/shared/components/ui/label'
import { useRoute } from '@/shared/hooks/use-route'
import { Layout } from '@/shared/layout'

export function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const route = useRoute(['Onboarding'])

  const currentStep = route?.params.step
  const totalSteps = useOnboardingStore(state => state.steps.length + 1)

  return <Layout>
    <div className='flex-1 flex flex-col'>
      <div className="flex justify-between items-center mb-8">
        <div className="h-[3rem]">
          <h1 className="font-extrabold text-5xl
                         balance-text whitespace-pre-line">
            {
              currentStep === '1'
                ? ('Bienvenue sur l\'outil d\'assistance '
                  + 'à la configuration de Sensoria')
                : (currentStep === totalSteps.toString()
                  ? 'Félicitations !\nSensoria est configuré !'
                  : 'Configuration de Sensoria')
            }
          </h1>
        </div>
        <Label className="flex-shrink-0 ml-4">
          {currentStep} sur {totalSteps}
        </Label>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  </Layout>
}
