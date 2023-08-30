import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

const getWorkspace = (folder: vscode.Uri | undefined) => {
  let workspace: string | undefined;

  if (folder && folder.fsPath) {
    workspace = folder.fsPath;
  } else {
    const dir = vscode.workspace.rootPath;
    if (dir === undefined) {
      vscode.window.showErrorMessage("Please open a workspace!");
      return;
    }
    workspace = dir;
  }
  return workspace;
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.openDocumentation",
    async () => {
      // Get root path of workspace
      let packageJson;
      const workspaceRoot = getWorkspace(undefined); // Fetches the current workspace root. If you want a specific folder's path, provide its Uri.
      console.log("workspaceRoot", workspaceRoot);
      // Construct the path to package.json in the root of the workspace
      if (workspaceRoot) {
        const packageJsonPath = path.join(workspaceRoot, "package.json");
        console.log("packageJsonPath", packageJsonPath);
        // Check if the file exists
        if (fs.existsSync(packageJsonPath)) {
          // Read and parse the package.json file
          packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

          console.log("packageJson", packageJson);

          // Now you can process packageJson as before...
        } else {
          // Handle the case where package.json doesn't exist
          vscode.window.showWarningMessage(
            "package.json not found in the workspace root."
          );
        }

        let docUrl: string | undefined;

        if (packageJson.dependencies) {
          console.log("ackageJson.dependencies", packageJson.dependencies);

          if (packageJson.dependencies.react) {
            docUrl = "https://reactjs.org/docs/getting-started.html";
          } else if (packageJson.dependencies.angular) {
            docUrl = "https://angular.io/docs";
          } else if (packageJson.dependencies.vue) {
            docUrl = "https://vuejs.org/v2/guide/";
          } else if (packageJson.dependencies["ember-source"]) {
            docUrl = "https://guides.emberjs.com/release/";
          } else if (packageJson.dependencies.backbone) {
            docUrl = "https://backbonejs.org/";
          } else if (packageJson.dependencies.meteor) {
            docUrl = "https://docs.meteor.com/";
          } else if (packageJson.dependencies.svelte) {
            docUrl = "https://svelte.dev/tutorial/basics";
          } else if (packageJson.dependencies.preact) {
            docUrl = "https://preactjs.com/guide/v10/getting-started";
          } else if (packageJson.dependencies.aurelia) {
            docUrl =
              "https://aurelia.io/docs/tutorials/creating-your-first-aurelia-app";
          } else if (packageJson.dependencies["dojo-core"]) {
            docUrl = "https://dojo.io/tutorials/";
          } else if (packageJson.dependencies.knockout) {
            docUrl = "https://knockoutjs.com/documentation/introduction.html";
          } else if (packageJson.dependencies["mithril/stream"]) {
            docUrl = "https://mithril.js.org/";
          } else if (packageJson.dependencies.nestjs) {
            docUrl = "https://docs.nestjs.com/";
          } else if (packageJson.dependencies["rxjs"]) {
            docUrl = "https://rxjs.dev/guide/overview";
          } else if (packageJson.dependencies["next"]) {
            docUrl = "https://nextjs.org/docs/getting-started";
          } else if (packageJson.dependencies["nuxt"]) {
            docUrl = "https://nuxtjs.org/docs/2.x/get-started/installation";
          } else if (packageJson.dependencies["gatsby"]) {
            docUrl = "https://www.gatsbyjs.com/docs/";
          } else if (packageJson.dependencies["mobx"]) {
            docUrl = "https://mobx.js.org/README.html";
          } else if (packageJson.dependencies["redux"]) {
            docUrl = "https://redux.js.org/introduction/getting-started";
          } else if (packageJson.dependencies["polymer"]) {
            docUrl = "https://www.polymer-project.org/";
          }
        }

        console.log("docUrl", docUrl);
        if (docUrl) {
          // Open documentation panel
          const panel = vscode.window.createWebviewPanel(
            "documentation",
            "Framework Documentation",
            vscode.ViewColumn.One,
            {}
          );

          panel.webview.html = `
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #f5f5f5; /* This is a light grey background, you can change as you see fit */
        overflow: hidden; /* Ensures no scrollbars appear outside the iframe */
      }

      iframe {
        border: none; /* Removes any default borders */
      }
    </style>
  </head>
  <body>
    <iframe src="${docUrl}" width="100%" height="100%"></iframe>
  </body>
  </html>
`;
        } else {
          vscode.window.showInformationMessage(
            "No supported framework detected in package.json."
          );
        }
      } else {
        vscode.window.showErrorMessage(
          "package.json not found in the workspace root."
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
