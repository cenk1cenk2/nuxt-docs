---
title: Creating a New Instance
description: 'Creating a new listr instance will generate a class.'
category: Getting Started
position: 4
---

## Generate New Class

Create a new task list from the constructor. It will return a Listr class.

```typescript
import { Listr } from 'listr2'

interface Ctx {
  /* some variables for internal use */
}

const tasks = new Listr<Ctx>(
  [
    /* tasks */
  ],
  {
    /* options */
  }
)
```

## Run the Generated Task List

Then you can run this task list as an async function and it will return the context that is used.

```typescript
try {
  await tasks.run()
} catch (e) {
  console.error(e)
}
```
