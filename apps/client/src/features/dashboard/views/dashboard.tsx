import { BellIcon, UsersIcon } from 'lucide-react'
import { useMemo } from 'react'

import { StageButton } from '@/features/onboarding/components/stage-button'
import { Button } from '@/shared/components/ui/button'
import { useQuery } from '@/shared/hooks/use-query'
import { Layout } from '@/shared/layout'

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
            <Button variant='secondary' size='icon'>
              <BellIcon className="h-4 w-4" />
            </Button>
          </li>
        </ul>
      </nav>
    </header>
    {
      block &&
      <main className='flex gap-4'>
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
                  image: new Blob([stage.map]),
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
  const imageURL = useMemo(() =>
    URL.createObjectURL(new Blob([hall.map])), [hall.map])

  return (
    <div>
      <img src={imageURL} alt={hall.label} />
    </div>
  )
}
