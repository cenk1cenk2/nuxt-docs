---
title: Create Your Own Renderer
description: 'The renderer that comes bundled with listr can be further customized.'
category: Renderers
position: 406
---

## Introduction

Creating a custom renderer with a beautiful interface can be done in one of two ways.

- First create a Listr renderer class.

```typescript
import { ListrRenderer, ListrTaskObject } from 'listr2'

export class MyAmazingRenderer implements ListrRenderer {
  // Designate this renderer as tty or nonTTY
  public static nonTTY = true
  // designate your renderer options that will be showed inside the `ListrOptions` as rendererOptions
  public static rendererOptions: never
  // designate your custom internal task-based options that will show as `options` in the task itself
  public static rendererTaskOptions: never

  // get tasks to be rendered and options of the renderer from the parent
  constructor(public tasks: ListrTaskObject<any, typeof MyAmazingRenderer>[], public options: typeof MyAmazingRenderer['rendererOptions']) {}

  // implement custom logic for render functionality
  render(): void {}

  // implement custom logic for end functionality
  end(err): void {}
}
```

## Utilizing the Task functions themselves

Take a look at [default renderer](https://github.com/cenk1cenk2/listr2/tree/master/src/renderer/default.renderer.ts) since it is implemented this way.

```typescript
/** Unique id per task, randomly generated in the uuid v4 format */
id: string
/** Title of the task */
title?: string
/** Output data from the task. */
output?: string
/** The current state of the task. */
state: string
/**
 * A channel for messages.
 *
 * This requires a separate channel for messages like error, skip or runtime messages to further utilize in the renderers.
 */
message: {
  /** Run time of the task, if it has been successfully resolved. */
  duration?: number
  /** Error message of the task, if it has been failed. */
  error?: string
  /** Skip message of the task, if it has been skipped. */
  skip?: string
  /** Rollback message of the task, if the rollback finishes */
  rollback?: string
}
/** A hook to refresh render if desired. */
renderHook$: Subject<void>
/** Returns whether this task has subtasks. */
hasSubtasks: () => boolean
/** Returns whether this task is in progress. */
isPending: () => boolean
/** Returns whether this task is skipped. */
isSkipped: () => boolean
/** Returns whether this task has been completed. */
isCompleted: () => boolean
/** Returns whether this task has an active rollback task going on. */
isRollingBack: () => boolean
/** Returns whether the rollback action was successful. */
hasRolledBack: () => boolean
/** Returns whether enabled function resolves to true. */
isEnabled: () => boolean
/** Returns whether this task has a prompt inside. */
isPrompt: () => boolean
/** Returns whether this task has been failed. */
hasFailed: () => boolean
/** Returns whether this task actually has a title. */
hasTitle: () => boolean
```

## Observables, where `event` will have a `type` and `data` to push channel through the pipe

Take a look at [verbose renderer](https://github.com/cenk1cenk2/listr2/tree/master/src/renderer/verbose.renderer.ts) since it is implemented this way.

```typescript
/** Type of listr internal events. Not using enum for easy of use in custom JavaScript renderers. */
export type ListrEventTypes = 'TITLE' | 'STATE' | 'ENABLED' | 'SUBTASK' | 'DATA' | 'MESSAGE'

/** The internal communication event. */
export type ListrEvent =
  | {
      type: Exclude<ListrEventTypes, 'MESSAGE'>
      data?: string | boolean
    }
  | {
      type: 'MESSAGE'
      data: ListrTaskObject<any, any>['message']
    }
```

```typescript
tasks?.forEach((task) => {
    task.subscribe((event: ListrEvent) => {
      ...
```

## Using Render Hooks <badge>v2.1.0+</badge>

Additional to rendering through `task.subscribe` or with a given interval, a renderer can also render on demand via a observable passed through the renderer.

Render hook can be the third optional variable of a given renderer, while using it is always optional.

```typescript
constructor (
    public tasks: ListrTaskObject<any, typeof DefaultRenderer>[],
    public options: typeof DefaultRenderer['rendererOptions'],
    public renderHook$?: ListrTaskObject<any, any>['renderHook$']
  )
```

Render hook is a void subject, which can be used to trigger re-render dynamically when any changes occur in the underneath.

```typescript
this.renderHook$.subscribe(() => {
  /* DO SOME RENDER MAGIC like render() */
})
```

## Set Listr to use a Custom Renderer

You can tell Listr to use your custom renderer by setting `renderer` option in `new Listr()` to your custom renderer.

```typescript
import { MyAmazingRenderer } from './myAmazingRenderer'

const tasks: ListrTaskObject<any, typeof MyAmazingRenderer>[] = [
  /* Array of task objects */
]

new Listr(tasks, { renderer: MyAmazingRenderer })
```
