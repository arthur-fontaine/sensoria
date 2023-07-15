import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type OnboardingStore = {
  steps: [
    {
      values: Partial<{
        blockName: string,
      }>,
    },
    {
      values: Partial<{
        location: string,
      }>,
    },
    {
      values: Partial<Record<string, never>>,
    },
  ],
  setStep: <
    T extends keyof OnboardingStore['steps'],
    _Step = OnboardingStore['steps'][T]
  >(
    step: T extends number ? T : never,
    values: _Step extends { values: infer V } ? V : never,
  ) => void,
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      steps: [
        {
          values: {},
        },
        {
          values: {},
        },
        {
          values: {},
        },
      ],
      setStep: (step: number, values) => set((state) => {
        if (step !== 0 && step !== 1 && step !== 2) {
          throw new Error('Invalid step')
        }
    
        const newSteps = structuredClone(state.steps)
        newSteps[step].values = values as any
        return { steps: newSteps }
      }),
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
