import type { Resolvers } from '../..'

export const greetQueryResolver: NonNullable<Resolvers['Query']['greet']> = (
  (_parent, args, _context, _info) => {
    if (args.name === null || args.name === undefined) {
      throw new Error('Missing required argument "name"')
    }

    return greet(args.name)
  }
)

function greet(name: string) {
  return `Hello, ${name}`
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should greet', () => {
    expect(greet('Martin')).toBe('Hello, Martin')
  })
}
