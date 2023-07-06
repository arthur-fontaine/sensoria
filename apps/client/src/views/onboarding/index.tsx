import { Label } from '@radix-ui/react-label'

import { Onboarding1 } from './onboarding-1'
import { Onboarding2 } from './onboarding-2'
import { Onboarding3 } from './onboarding-3'
import { OnboardingLayout } from './onboarding-layout'

import { useRoute } from '@/hooks/use-route'

function OnboardingStep() {
  const route = useRoute(['Onboarding'])

  switch (route?.params?.step) {
    case '1': {
      return <Onboarding1 />
    }
    case '2': {
      return <Onboarding2 />
    }
    case '3': {
      return <Onboarding3 />
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
