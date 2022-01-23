---
title: Support
description: 'List2 currently supports ESM and CommonJs.'
category: Getting Started
position: 3
---

`listr2` currently supports both `esm` and `cjs` modules.

This comes with its own disadvantages.

## Disadvantages

- We have to bundle two instances, which doubles our distribution size.
- Community is moving to pure `esm` modules. [sindresorhus](https://github.com/sindresorhus) who is the maintainer of many-core `npm` packages (cheers!) has to lead the movement with the deprecated `node.js 10` support. You can read more about [here](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) in his post.
- Due to this compatibility issue we can not update the dependencies that are pure `esm`.

## What is next?

At some point, the support for `cjs` will be dropped in favor of keeping the dependencies up-to-date. This will of course be done through a major release. But currently also taking in hand my situation, I do want to keep `cjs` for the time being since I do also use this utility in the packages that will not have the `esm` capability soon.
