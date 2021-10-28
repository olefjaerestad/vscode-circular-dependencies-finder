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
1. Open the command palette (View -> Command Palette, or <kbd>cmd</kbd> + <kbd>shift</kbd> + <kbd>p</kbd> on macOS, <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>p</kbd> on Windows).
2. Type `circular dependencies` and select the command you wish to run.

\!\[Demonstrating how to use the plugin\]\(images/demo.gif\)

## Known Issues
- Doesn't support [tsconfig.paths](https://www.typescriptlang.org/tsconfig). 
- Doesn't detect `.ts` imports from `.js` files.

## Release Notes
### 1.0.0
Initial release.

## Developing the plugin
1. `npm i`.
2. Open the repo in VS Code. 
3. Open `Run and Debug` in the sidebar and select `Run Extension`. Alternatively, press <kbd>f5</kbd>.
   This starts watching for file changes and opens the `Extension Development Host` window, 
   where the extension is available for use. If you get a `Cannot find module` error,
   just reload the `Extension Development Host`; this happens when trying to activate the 
   extension before the source files are built.
4. Make changes to the plugin code.
5. Reload the `Extension Development Host` (<kbd>cmd</kbd> + <kbd>r</kbd> on macOS, 
   <kbd>ctrl</kbd> + <kbd>r</kbd> on Windows) for the changes to take effect.

### Testing
1. `npm i`.
2. Open the repo in VS Code. 
3. Open `Run and Debug` in the sidebar and select `Extension Tests`. Alternatively, press <kbd>f5</kbd>.
   This starts watching for file changes and opens the `Extension Development Host` window, 
   where the tests will be run.
4. Make changes to the test code.
5. Repeat step 3 to rerun tests.

### Get intellisense for CSS modules
https://www.npmjs.com/package/typescript-plugin-css-modules#visual-studio-code

### Helpful links
* [Learn D3](https://observablehq.com/@d3/learn-d3?collection=@d3/learn-d3)
* [VS Code color reference](https://code.visualstudio.com/api/references/theme-color)

## TODO:
- Update readme with animation on how to use the plugin.
- Publish.

**Enjoy!**
