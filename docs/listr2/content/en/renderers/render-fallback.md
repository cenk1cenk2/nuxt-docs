---
title: Renderer Fallback Condition
description: 'Renderer can fallback to non-tty renderer or silent renderer with passing a simple evaluation function.'
category: Renderers
position: 401
badge: v2.3.0+
---

## Introduction

There are times other than non TTY environments that you want to use a verbose renderer instead of the default renderer.

For these times you needed to create a `getRenderer` kind of method and return the renderer value to the renderer. But with the added complexity of the types, it is a bit more buggy to show it returns `default` for auto-complete purposes.

You can now pass in a function that returns a boolean, or directly a boolean for automatically stepping down to the `nonTTYRenderer` when the condition is met.

## Usage

### Non-TTY Renderer Fallback

```typescript
task = new Listr<Ctx>(
  [
    {
      title: 'This task will execute.',
      task: async (): Promise<void> => {
        await delay(500)
      },
      options: { persistentOutput: true }
    }
  ],
  { concurrent: false, rendererFallback: (): boolean => 3 < 1 }
)
```

### Silent Renderer Fallback

This is also true if you want to get the silent renderer directly. But this time you have to pass in `rendererSilent` variable to the options.

```typescript
task = new Listr<Ctx>(
  [
    {
      title: 'This task will execute.',
      task: async (): Promise<void> => {
        await delay(500)
      },
      options: { persistentOutput: true }
    }
  ],
  { concurrent: false, rendererSilent: (): boolean => 3 < 1 }
)
```

<ExampleAlert :example="{ link: 'https://github.com/cenk1cenk2/listr2/tree/master/examples/renderer-fallback.example.ts', name: 'examples section' }"></ExampleAlert>
