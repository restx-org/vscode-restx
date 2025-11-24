"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const completions = __importStar(require("./completions-adapter"));
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
connection.onInitialize((params) => {
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['.', ':', '@', '$', ' ']
            },
            hoverProvider: true
        }
    };
});
// Completion items (imported from shared package via adapter)
const keywords = completions.keywords;
const httpMethods = completions.httpMethods;
const types = completions.types;
const modifiers = completions.modifiers;
const annotations = completions.annotations;
const builtinFunctions = completions.builtinFunctions;
const dbOperations = completions.dbOperations;
const magicVariables = completions.magicVariables;
const authTypes = completions.authTypes;
connection.onCompletion((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document)
        return [];
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
connection.onCompletionResolve((item) => {
    return item;
});
// Hover information
const hoverDocs = new Map([
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
connection.onHover((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document)
        return null;
    const text = document.getText();
    const offset = document.offsetAt(params.position);
    // Find word at position
    const wordStart = text.lastIndexOf(' ', offset) + 1;
    const wordEnd = text.indexOf(' ', offset);
    const word = text.substring(Math.max(0, wordStart), wordEnd === -1 ? text.length : wordEnd).trim().split(/[^a-zA-Z$@]/)[0];
    const doc = hoverDocs.get(word);
    if (doc) {
        return {
            contents: {
                kind: node_1.MarkupKind.Markdown,
                value: doc
            }
        };
    }
    return null;
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map