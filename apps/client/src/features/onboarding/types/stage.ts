import type { useQuery } from '@/shared/hooks/use-query'

export type Stage = {
  name: string,
  image: Blob | undefined,
  objects: ReturnType<ReturnType<typeof useQuery>['objects']>
}
