# @sensoria/api

## Contributing guidelines

- **Do** create a file following this model at `src/resolvers/<operation-type>/<entity-name>.ts` for each new resolver:
  ```ts
  import type { Resolvers } from '../..'

  export const entitynameOperationtypeResolver /* TODO: rename this */: NonNullable<Resolvers['operationtype']['entityname']/* TODO: rename this */> = (
    (parent, args, context, info) => {
      // Treat args

      return entityname(args)
    }
  )

  function entityname/* TODO: rename this */(args: any/* TODO: type this */) {
    // Do something and return
  }

  if (import.meta.vitest) {
    const { it, expect } = import.meta.vitest

    // Write tests
  }
  ```
