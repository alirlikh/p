# Implementation Plan: Fix 'any' type usages

## Context
The project currently has over 80 linting errors, primarily caused by excessive use of the `any` type, which bypasses TypeScript's type safety. This plan aims to incrementally refactor these instances to improve maintainability and reliability.

## Phase 1: Authentication Type Safety (NextAuth Module Augmentation)
- Create `types/next-auth.d.ts` for module augmentation.
- Update `lib/auth.ts` to utilize the augmented types instead of casting to `any`.
- Files: `types/next-auth.d.ts` (new), `lib/auth.ts`.

## Phase 2: Refactor Logging and Error Handling
- Update `lib/logger.ts` to use `unknown` and `Record<string, unknown>` instead of `any`.
- Implement a type guard to safely extract error messages in catch blocks.
- Files: `lib/logger.ts`, `app/admin/education/DeleteEducationClient.tsx`.

## Phase 3: Cleanup Type Declarations
- Convert `types/temp-declarations.d.ts` and `types/markdown.d.ts` to proper interfaces where possible, or remove unused declarations if they are just temporary shims.
- Files: `types/temp-declarations.d.ts`, `types/markdown.d.ts`.

## Verification Plan
1. Run `npm run typecheck` after each phase.
2. Run `npm run lint` to verify error count decreases.
3. Ensure the admin panel and blog functionality remain working as expected.
