# Contributing to RecallOps AI

First off, thank you for considering contributing to RecallOps AI! It's people like you that make open source such a fantastic community.

## 1. Code of Conduct
By participating in this project, you are expected to uphold our Code of Conduct. Please be respectful, constructive, and inclusive to all contributors.

## 2. How Can I Contribute?

### Reporting Bugs
If you find a bug, please create an issue on GitHub. Include:
* A clear and descriptive title.
* Steps to reproduce the issue.
* Expected vs. Actual behavior.
* Environment details (OS, Python version, Node version).

### Suggesting Enhancements
We love new ideas! If you have a feature request:
* Check if a similar issue already exists.
* Open a new issue outlining the feature, the problem it solves, and how you envision it working.

### Pull Requests
1. **Fork the repo** and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (`pytest tests/`).
5. Ensure the frontend builds (`npm run build`).
6. Issue a Pull Request with a clear description of the changes.

## 3. Development Setup
Please refer to the [README.md](README.md) for instructions on setting up your local environment. 

### Coding Standards
* **Python:** Follow PEP-8. Use type hints (`typing`) aggressively.
* **TypeScript:** Avoid `any`. Use strict typing for all API contracts.
* **Commits:** Write clear, concise commit messages. (e.g., `feat(parser): add support for JSON log structures`).

## 4. Architecture Overview
Before contributing heavy backend logic, please review [Architecture.md](docs/Architecture.md) to understand how the components (Orchestrator, Hindsight, CascadeAgent, Reflection) interact.
