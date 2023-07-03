import { Button } from '@/components/ui/button'

export function OnboardingStep3() {
  return (
    <div className="container mt-20 mx-10 flex-initial">
      <div className="flex justify-between ">
        <h1 className="font-extrabold text-5xl mb-40">
            Configuration de Sensoria
        </h1>
        <h6 className="ml-auto">3 sur 3</h6>
      </div>
      <div className="my-8">
        <h2 className="font-semibold text-3xl">Pour finir...</h2>
        <h4 className='mt-10'>
              Etablissez le plan de votre batiment
        </h4>
      </div>
      <div className='w-80'>

      </div>
      <Button className="mt-4">Valider</Button>
    </div>
  )
}
