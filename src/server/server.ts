import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  Hover,
  MarkupKind
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import * as completions from './completions-adapter';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', ':', '@', '$', ' ']
      },
      hoverProvider: true
    }
  };
});

// Completion items (imported from shared package via adapter)
const keywords: CompletionItem[] = completions.keywords;
const httpMethods: CompletionItem[] = completions.httpMethods;
const types: CompletionItem[] = completions.types;
const modifiers: CompletionItem[] = completions.modifiers;
const annotations: CompletionItem[] = completions.annotations;
const builtinFunctions: CompletionItem[] = completions.builtinFunctions;
const dbOperations: CompletionItem[] = completions.dbOperations;
const magicVariables: CompletionItem[] = completions.magicVariables;
const authTypes: CompletionItem[] = completions.authTypes;


connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  const lineStart = text.lastIndexOf('\n', offset - 1) + 1;
  const lineText = text.substring(lineStart, offset);

  // After @ trigger annotation completions
  if (lineText.endsWith('@')) {
    return annotations;
  }

  // After $ trigger magic variables
  if (lineText.endsWith('$')) {
    return magicVariables;
  }

  // After db. trigger database operations
  if (lineText.match(/db\.\w*\.$/)) {
    return dbOperations;
  }

  // After auth: trigger auth types
  if (lineText.match(/auth:\s*$/)) {
    return authTypes;
  }

  // After : trigger types (in type/table definitions)
  if (lineText.match(/:\s*$/) && !lineText.includes('auth')) {
    return types;
  }

  // Start of line - keywords and HTTP methods
  if (lineText.trim() === '' || lineText.match(/^\s*$/)) {
    return [...httpMethods, ...keywords];
  }

  // Default: return all completions
  return [
    ...keywords,
    ...httpMethods,
    ...types,
    ...modifiers,
    ...annotations,
    ...builtinFunctions,
    ...dbOperations,
    ...magicVariables,
    ...authTypes,
  ];
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  return item;
});

// Hover information
const hoverDocs: Map<string, string> = new Map([
  ['api', 'Declares the API name and version.\n\n```restx\napi MyAPI 1.0.0\n```'],
  ['env', 'Defines environment variables.\n\n```restx\nenv {\n  database_url: str\n  api_key: secret\n}\n```'],
  ['type', 'Defines a custom type.\n\n```restx\ntype User {\n  id: uuid\n  name: str\n}\n```'],
  ['table', 'Defines a database table.\n\n```restx\ntable users {\n  id: uuid pk\n  email: email unique\n}\n```'],
  ['flow', 'Defines request handling logic.\n\n```restx\nflow: {\n  user -> db.users.findById(id)\n  return -> user\n}\n```'],
  ['GET', 'HTTP GET method - retrieves a resource'],
  ['POST', 'HTTP POST method - creates a resource'],
  ['PUT', 'HTTP PUT method - replaces a resource'],
  ['PATCH', 'HTTP PATCH method - partially updates a resource'],
  ['DELETE', 'HTTP DELETE method - removes a resource'],
  ['str', 'String type - Unicode text'],
  ['int', 'Integer type - 32-bit signed integer'],
  ['uuid', 'UUID type - Universally unique identifier'],
  ['email', 'Email type - Valid email address'],
  ['secret', 'Secret type - Sensitive data, auto-stripped from responses'],
  ['pk', 'Primary key - Marks column as primary key'],
  ['unique', 'Unique constraint - Ensures column values are unique'],
  ['bearer', 'Bearer token authentication - JWT in Authorization header'],
  ['$auth', 'Authenticated user context - Available in authenticated routes'],
  ['$env', 'Environment variables - Access via $env.variable_name'],
]);

connection.onHover((params: TextDocumentPositionParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const text = document.getText();
  const offset = document.offsetAt(params.position);

  // Find word at position
  const wordStart = text.lastIndexOf(' ', offset) + 1;
  const wordEnd = text.indexOf(' ', offset);
  const word = text.substring(
    Math.max(0, wordStart),
    wordEnd === -1 ? text.length : wordEnd
  ).trim().split(/[^a-zA-Z$@]/)[0];

  const doc = hoverDocs.get(word);
  if (doc) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: doc
      }
    };
  }

  return null;
});

documents.listen(connection);
connection.listen();
