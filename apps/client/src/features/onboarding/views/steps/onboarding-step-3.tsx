import { PlusIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { DropMap } from '../../components/drop-map'
import { ObjectList } from '../../components/object-list'
import { ObjectsMap } from '../../components/objects-map'
import { StageButton } from '../../components/stage-button'
import { useStagesStore } from '../../hooks/stores/use-stages-store'
import { useImageZone } from '../../hooks/use-image-zone'

import { Button } from '@/shared/components/ui/button'
import { Router } from '@/shared/router'

export function OnboardingStep3() {
  useStagesStore((state) => {
    if (state.stages.length === 0) {
      state.createStage()
    }
  })

  const submit = useCallback(() => {
    Router.replace('Onboarding', { step: '4' })
  }, [])

  return (
    <div className='space-y-12 flex-1 flex flex-col'>
      <div>
        <h2 className="font-semibold text-3xl mb-3">Pour finir...</h2>
        <h4 className="font-normal text-xl">
          Établissez le plan de votre bâtiment.
        </h4>
      </div>
      <div className='flex-1 flex flex-col'>
        <div className='flex gap-4 overflow-y-auto flex-grow basis-0'>
          <StageList />
          <HallCreateMap />
        </div>
        <div className='w-full flex justify-end'>
          <Button
            type='submit'
            className="mt-4"
            onClick={submit}
          >
            Valider
          </Button>
        </div>
      </div>
    </div>
  )
}

function StageList() {
  const stages = useStagesStore((state) => state.stages)
  const reverseStages = useMemo(() => [...stages].reverse(), [stages])
  const createStage = useStagesStore((state) => state.createStage)

  return (
    <div
      className='flex flex-col space-y-4 mr-4 flex-shrink-0
                 h-full overflow-y-auto no-scrollbar'
    >
      <StageButton onClick={() => createStage()}>
        <PlusIcon />
      </StageButton>
      {reverseStages.map((stage, index) => (
        <StageButton key={index} stage={stage} />
      ))}
    </div>
  )
}

function HallCreateMap() {
  const mapImage = useStagesStore((state) =>
    state.stages[state.currentStageIndex]?.image)

  return mapImage
    ? <HallCreateMapConfigureDevices />
    : <DropMap />
}

function HallCreateMapConfigureDevices() {
  const mapImage = useStagesStore((state) =>
    state.stages[state.currentStageIndex]?.image)
  const objects = useStagesStore((state) =>
    state.stages[state.currentStageIndex]?.objects ?? [])

  if (mapImage === undefined) {
    throw new Error('No map image')
  }

  const mapImageUrl = useMemo(() => {
    return URL.createObjectURL(mapImage)
  }, [mapImage])

  const [mapImageAspectRatio, setMapImageAspectRatio] = useState<number>()
  useEffect(() => {
    createImageBitmap(mapImage).then((bitmap) => {
      setMapImageAspectRatio(bitmap.width / bitmap.height)
    })
  }, [mapImage])

  const [
    imageZone,
    { referenceFullWidthImageZone, referenceFullHeightImageZone },
  ] = useImageZone()

  return <div className='flex flex-1 space-x-6'>
    <div className='flex flex-col flex-1 space-y-4'>
      <p>
        <span className='font-semibold'>Astuce :</span>
        &nbsp;Sélectionnez un capteur dans la liste de droite, puis déposez-le
        à l’endroit où il se situe. Cliquez sur un capteur déjà placé
        pour le configurer.
      </p>
      <div className='flex justify-center items-center flex-1 overflow-hidden'>
        <div
          style={{ backgroundImage: `url(${mapImageUrl})` }}
          className='bg-center bg-no-repeat bg-contain overflow-hidden
                     w-full h-full flex relative'
        >
          {/* The following divs are used to get the real image zone */}
          <div
            className='absolute w-full top-1/2 left-1/2
            transform -translate-y-1/2 -translate-x-1/2'
            style={{ aspectRatio: mapImageAspectRatio }}
            ref={referenceFullWidthImageZone}
          />
          <div
            className='absolute h-full top-1/2 left-1/2
            transform -translate-y-1/2 -translate-x-1/2'
            style={{ aspectRatio: mapImageAspectRatio }}
            ref={referenceFullHeightImageZone}
          />
          <ObjectsMap imageZone={imageZone} objects={objects} />
        </div>
      </div>
    </div>
    <ObjectList imageZone={imageZone} />
  </div>
}
