Releases follow [Semantic Versioning](https://semver.org/)

# Unreleased

- No upcoming plans. Feel free to submit issues to 
  https://github.com/olefjaerestad/vscode-circular-dependencies-finder/issues.

# 1.2.0 - 2024-07-25

- Add setting ('circularDependenciesFinder.excludeTypeImports') for excluding 
  'import type' statements when calculating circular dependencies.
- Add 'Find circular dependencies in current file' option to 'Find circular 
  dependencies' command.

# 1.1.1 - 2024-03-14

- Add support for special characters in filepaths.

# 1.1.0 - 2022-03-20

- Add "search in circular dependencies" with `cmd/ctrl+f`.
- Hide filepaths from graph view.

# 1.0.0 - 2021-10-30

- Initial release.
- Add `Find Circular Dependencies` command, which will display a graph and JSON 
  view of your circular dependencies based on a selected root file.
