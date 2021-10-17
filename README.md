# VS Code Circular Dependencies Finder
Find circular dependencies in your project. Supports the following filetypes:
- .js
- .jsx
- .ts
- .tsx
- .css
- .scss
- .less

## How to use
1. Open the command palette (View -> Command Palette, or `cmd` + `shift` + `p` on macOS, `ctrl` + `shift` + `p` on Windows).
2. Type `circular dependencies` and select the command you wish to run.

\!\[Demonstrating how to use the plugin\]\(images/demo.gif\)

## Known Issues
- Doesn't support [tsconfig.paths](https://www.typescriptlang.org/tsconfig). 
- Doesn't detect `.ts` imports from `.js` files.

## Release Notes
### 1.0.0
Initial release.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Developing the plugin
### Get intellisense for CSS modules
https://www.npmjs.com/package/typescript-plugin-css-modules#visual-studio-code

### Helpful links
* [Learn D3](https://observablehq.com/@d3/learn-d3?collection=@d3/learn-d3)
* [VS Code color reference](https://code.visualstudio.com/api/references/theme-color)

## TODO:
- Add tests.
- Update readme with animation on how to use the plugin.
- Publish.

**Enjoy!**
