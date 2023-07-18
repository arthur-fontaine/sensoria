import { g } from 'garph'

export const tagType = g.type('Tag', {
  tagId: g.int().description('Tag ID'),
  name: g.string().description('Tag name'),
})
