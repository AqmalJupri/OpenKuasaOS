# Contributing to OpenKuasa OS

OpenKuasa OS is a crowd-sourced, open-source project — it exists because people
contribute. Thank you for being one of them.

The maintainers plan to offer a paid hosted version alongside the free
self-hosted one. It is built on the code in this repository, and everything you
contribute here stays open source under AGPL-3.0. See the
[Contributor License Agreement](#contributor-license-agreement) below for what
that means for your contributions.

## Ground rules

### Original work only

OpenKuasa is an independent project, not affiliated with or representing any
other company or product. To keep it that way:

- **Do not copy from any proprietary product.** That means no source code,
  marketing or interface text, pricing, designs, screenshots, logos, icons,
  images or data.
- **Do not use another company's names or branding** in the product. The
  interface, sample data and marketing pages must never present OpenKuasa as
  another product or suggest a connection to one.
- **Do not contribute anything you obtained under an agreement** with another
  company (as a customer, employee, contractor or partner) that restricts its
  use.
- **Do not make claims that aren't true** — no invented customer numbers,
  testimonials, certifications or company details.

Solve problems your own way. Building the same kind of feature is fine;
reproducing someone else's implementation of it is not.

### Licensing

OpenKuasa OS is licensed under [AGPL-3.0](LICENSE). Contributions are accepted
under the Contributor License Agreement below. Please read it before opening a
pull request.

## Contributor License Agreement

OpenKuasa is free to self-host, and the maintainers also plan to run a paid
hosted version to fund the project. The hosted version may include code that is
not part of this repository, such as billing and infrastructure. For that to be
possible alongside outside contributions, the maintainers need rights beyond
those the AGPL-3.0 gives everyone. This agreement grants them.

By submitting a contribution (a pull request, patch or any other material) to
this repository, you agree to the following:

1. **You keep your copyright.** You are not assigning ownership of your
   contribution to anyone.
2. **Copyright license.** You grant the OpenKuasa maintainers a perpetual,
   worldwide, non-exclusive, royalty-free, irrevocable license to use,
   reproduce, modify, distribute, publicly perform and display, and sublicense
   your contribution, and to license it to others under any terms, including
   terms other than AGPL-3.0.
3. **Patent license.** You grant the OpenKuasa maintainers and everyone who
   receives the software a perpetual, worldwide, non-exclusive, royalty-free,
   irrevocable license under any patent claims you own that are necessarily
   infringed by your contribution, to make, use, sell and otherwise transfer
   it.
4. **Your work, your right to share it.** You confirm the contribution is your
   original work, or that you have the right to submit it under these terms.
   If your employer has rights to work you create, you confirm you have their
   permission. You confirm it contains nothing copied from any proprietary
   product.
5. **No warranty.** Your contribution is provided as is. You are not required
   to support it.

In return, the maintainers commit that **every contribution accepted into this
repository will remain available to everyone under AGPL-3.0** (or a later
version of it). Code that has been published here as open source will not be
taken closed.

If you do not agree to these terms, please do not submit a contribution.

### How to agree

Every pull request must include this line in its description, which the pull
request template adds for you:

> I have read the OpenKuasa Contributor License Agreement in CONTRIBUTING.md
> and I agree to it for this and my future contributions.

## How to contribute

1. Fork the repository and clone your fork.
2. Install and run:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Create a branch from `main` named `type-###-description`, where the type is
   `feat`, `bug` or `exp` and `###` is the next number in sequence — for
   example `feat-018-invoice-api`.
4. Make your change in small, focused commits.
5. Run `pnpm lint` and `pnpm build` before pushing.
6. Open a pull request against `main`, titled with your branch name, and
   describe what changed and why.

Always use pnpm, not npm or yarn.

## Code style

- TypeScript, 2-space indentation, single quotes, semicolons.
- Functional React components with hooks; named exports.
- Server Components by default; add `'use client'` only when needed.
- Read `AGENTS.md` before touching Next.js APIs — this project is on Next.js 16,
  which differs from earlier versions.

## Where help is needed most

The interface is built; the backend is not. See the Status section of the
[README](README.md). Wiring screens to Supabase, real authentication and the AI
assistants are the most valuable places to start.

## Reporting a concern

If you believe something in this repository copies or misrepresents another
product, open an issue so it can be removed.
