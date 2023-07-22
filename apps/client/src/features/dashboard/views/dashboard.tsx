import { BellIcon, UsersIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { PanelAlert } from '../components/panel-alert'

import { StageButton } from '@/features/onboarding/components/stage-button'
import { ObjectsMap } from '@/shared/components/objects-map'
import { Button } from '@/shared/components/ui/button'
import { useQuery } from '@/shared/hooks/use-query'
import { Layout } from '@/shared/layout'
import { Router } from '@/shared/router'

export function Dashboard() {
  const block = useQuery().blocks()[0]

  return <Layout>
    <header className='flex justify-between space-x-4 mb-12'>
      <div className="space-y-3">
        <h1 className="font-extrabold text-5xl
                       balance-text whitespace-pre-line">
          Tableau de bord
        </h1>
        <h4 className="font-normal text-xl">
          Visualisez l’ensemble de vos capteurs et dispositifs.
        </h4>
      </div>
      <nav>
        <ul className="flex gap-4 flex-row-reverse">
          <li>
            <Button>Graphiques</Button>
          </li>
          <li>
            <Button variant='secondary'>Éditer</Button>
          </li>
          <li>
            <Button variant='secondary' size='icon'>
              <UsersIcon className="h-4 w-4" />
            </Button>
          </li>
          <li>
            <PanelAlert>
              <Button variant='secondary' size='icon'>
                <BellIcon className="h-4 w-4" />
              </Button>
            </PanelAlert>
          </li>
        </ul>
      </nav>
    </header>
    {
      block &&
      <main className='flex gap-4 flex-1'>
        <nav>
          <div
            className='flex flex-col space-y-4 mr-4 flex-shrink-0
                       h-full overflow-y-auto no-scrollbar'
          >
            {block.halls.map((stage, index) => (
              <StageButton
                key={index}
                stage={{
                  ...stage,
                  image: new Blob(),
                  name: stage.label ?? '',
                }}
                onClick={() => {
                  // TODO
                }}
              />
            ))}
          </div>
        </nav>
        {block.halls.map((hall, index) => (
          <Hall key={index} hall={hall} />
        ))}
      </main>
    }
  </Layout>
}

function Hall({ hall }: {
  hall: ReturnType<
    ReturnType<typeof useQuery>['blocks']
  >[number]['halls'][number],
}) {
  const [imageBlob, setImageBlob] = useState<Blob>()

  useEffect(() => {
    if (hall.map === null || hall.map === undefined) {
      return
    }

    if (imageBlob !== undefined) {
      return
    }

    fetch(hall.map.base64)
      .then((response) => response.blob())
      .then((blob) => {
        setImageBlob(blob)
      })
  }, [hall.map, imageBlob])

  if (imageBlob === undefined) {
    return
  }

  return (
    <ObjectsMap
      mapImage={imageBlob}
      objects={hall.objects}
      editable={false}
      colorizeObjects={true}
      openModalOnObjectClick={true}
    />
  )
}
