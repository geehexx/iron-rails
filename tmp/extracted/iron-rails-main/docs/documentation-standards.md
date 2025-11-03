# Documentation Standards

This document outlines the standards for writing and maintaining documentation in the Iron Rails project.

## Markdown Linting

We use `markdownlint-cli2` to enforce a consistent style across all of our Markdown files. The linter is configured to run automatically as a pre-commit hook, so you don't have to worry about running it manually.

### Configuration

The linter is configured using the `.markdownlint.json` file in the project root. This file defines the rules that are enforced and allows us to customize the linter to our specific needs.

## Pre-commit Hooks

We use `husky` and `lint-staged` to run the linter on all staged Markdown files before each commit. This ensures that all documentation is properly formatted and that no linting errors are introduced into the codebase.
