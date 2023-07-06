import { create } from 'zustand'

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
      values: Partial<{
        blockMap: any[],
      }>,
    },
  ],
}

export const useOnboardingStore = create<OnboardingStore>()((set) => ({
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
}))
