import * as path from 'path';
import { ExtensionContext, window } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join('out', 'server', 'server.js'));

  const outputChannel = window.createOutputChannel('RESTx Language Server');
  outputChannel.appendLine(`Starting RESTx Language Server...`);
  outputChannel.appendLine(`Server module: ${serverModule}`);

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ['--nolazy', '--inspect=6009'] }
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'restx' }],
    outputChannel: outputChannel
  };

  client = new LanguageClient(
    'restxLanguageServer',
    'RESTx Language Server',
    serverOptions,
    clientOptions
  );

  client.start().then(() => {
    outputChannel.appendLine('RESTx Language Server started successfully');
  }).catch((error) => {
    outputChannel.appendLine(`Failed to start server: ${error}`);
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
