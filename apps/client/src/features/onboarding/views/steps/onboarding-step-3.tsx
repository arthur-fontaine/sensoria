import { Button } from '@/shared/components/ui/button'

export function OnboardingStep3() {
  return (
    <>
      <div className="my-8">
        <h2 className="font-semibold text-3xl mb-3">Pour finir...</h2>
        <h4 className='font-normal text-xl'>
          Etablissez le plan de votre batiment
        </h4>
      </div>
      <div className='w-80'>
        <Button className="mt-4">Valider</Button>
      </div>
    </>
  )
}
