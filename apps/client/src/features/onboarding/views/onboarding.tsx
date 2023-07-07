import { Label } from '@radix-ui/react-label'

import { OnboardingStep1 } from './steps/onboarding-step-1'
import { OnboardingStep2 } from './steps/onboarding-step-2'
import { OnboardingStep3 } from './steps/onboarding-step-3'
import { OnboardingLayout } from '../layout'

import { useRoute } from '@/shared/hooks/use-route'

function OnboardingStep() {
  const route = useRoute(['Onboarding'])

  switch (route?.params?.step) {
    case '1': {
      return <OnboardingStep1 />
    }
    case '2': {
      return <OnboardingStep2 />
    }
    case '3': {
      return <OnboardingStep3 />
    }
    default: {
      return <Label>Not found</Label>
    }
  }
}

export function Onboarding() {
  return <OnboardingLayout>
    <OnboardingStep />
  </OnboardingLayout>
}
