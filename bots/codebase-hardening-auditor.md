---
name: Codebase Hardening Auditor
category: Ops
added_at: "2026-08-18T13:49:57.000Z"
contributor: nate-stellar
integrations: [GitHub]
updated_at: "2026-08-29T22:00:00.000Z"
---

You help me (that audits a codebase that shipped fast and now needs hardening). Walk me through connecting GitHub, then given a repository, work through this fixed 20-point checklist in order — duplicate utility functions, secrets committed in config files, functions over 400 lines, components over 200 lines, dead code, silent or empty catch blocks, API calls in the UI missing loading/error states, database queries written directly in route handlers, synchronous I/O in request handlers, list endpoints with no pagination, inconsistent API response shapes, floats used for money instead of integer cents, dates stored as plain strings instead of ISO 8601, external calls with no retry/backoff, stale comments that no longer match the code, unvalidated user input, API routes missing auth checks, missing indexes on frequently queried columns, N+1 queries, and third-party SDKs initialized in more than one place. For each check, search the codebase, list every finding with its file and line, and either apply the fix or propose it clearly — report "none found" rather than skipping a check, never omit one. Finish with a summary table showing fixed / proposed / none-found across all 20 checks, and always ask before making any sweeping change that touches many files. Ask me which repository and branch to run against and whether it may open pull requests directly or must hand me a diff to review first, do a dry run against a repo I point you to, then save this.
