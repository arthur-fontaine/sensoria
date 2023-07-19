export type Stage = {
  name: string,
  image: Blob | undefined,
  objects: {
    objectId: number,
    name: string,
    emplacement?: [number, number] | null | undefined,
    iconName?: string | null | undefined,
  }[],
}
