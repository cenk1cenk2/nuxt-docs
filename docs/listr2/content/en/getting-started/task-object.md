---
title: Task and Options
description: 'Listr can be further customized per task and execution options.'
category: Getting Started
position: 5
---

## Task

A single task is an object with the following properties, where the `task` is the main attraction that the desired function gets executed.

The task can be further customized depending on the context and properties.

`task` can be one of the following:

- Function/Promise
- Listr
- Stream
- Observable

<ExternalTsDoc src="https://raw.githubusercontent.com/cenk1cenk2/listr2/master/docs/interfaces/index.ListrTask.md" behead="1"></ExternalTsDoc>

## Options

Options is an object with the following properties, can customize the execution, rendering and behavior of the given task list.

This is a global set of defaults and most of them can be overwritten through defining subtasks and defining per-subtask options.

<ExternalTsDoc src="https://raw.githubusercontent.com/cenk1cenk2/listr2/master/docs/interfaces/index.ListrOptions.md" behead="1"></ExternalTsDoc>
