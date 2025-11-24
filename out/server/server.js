"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
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
// Completion items
const keywords = [
    { label: 'api', kind: node_1.CompletionItemKind.Keyword, detail: 'API declaration', documentation: 'Declares the API name and version.\n\nExample:\n```restx\napi MyAPI 1.0.0\n```' },
    { label: 'env', kind: node_1.CompletionItemKind.Keyword, detail: 'Environment configuration', documentation: 'Defines environment variables.\n\nExample:\n```restx\nenv {\n  database_url: str\n  api_key: secret\n}\n```' },
    { label: 'error', kind: node_1.CompletionItemKind.Keyword, detail: 'Error schema', documentation: 'Defines global error response structure.\n\nExample:\n```restx\nerror {\n  code: int\n  message: str\n}\n```' },
    { label: 'type', kind: node_1.CompletionItemKind.Keyword, detail: 'Type definition', documentation: 'Defines a custom type.\n\nExample:\n```restx\ntype User {\n  id: uuid\n  name: str\n}\n```' },
    { label: 'table', kind: node_1.CompletionItemKind.Keyword, detail: 'Database table', documentation: 'Defines a database table.\n\nExample:\n```restx\ntable users {\n  id: uuid pk\n  email: email unique\n}\n```' },
    { label: 'integration', kind: node_1.CompletionItemKind.Keyword, detail: 'External integration', documentation: 'Configures an external API integration.\n\nExample:\n```restx\nintegration stripe {\n  baseUrl: "https://api.stripe.com"\n  auth: bearer($env.stripe_key)\n}\n```' },
    { label: 'webhook', kind: node_1.CompletionItemKind.Keyword, detail: 'Webhook definition', documentation: 'Defines an outbound webhook.\n\nExample:\n```restx\nwebhook user.created {\n  url: "https://hooks.example.com"\n  events: ["user.created"]\n}\n```' },
    { label: 'hook', kind: node_1.CompletionItemKind.Keyword, detail: 'Middleware hook', documentation: 'Defines middleware.\n\nExample:\n```restx\nhook logging {\n  before: { ... }\n  after: { ... }\n}\n```' },
    { label: 'task', kind: node_1.CompletionItemKind.Keyword, detail: 'Scheduled task', documentation: 'Defines a scheduled task.\n\nExample:\n```restx\ntask cleanup @cron("0 0 * * *") {\n  flow: { ... }\n}\n```' },
    { label: 'flow', kind: node_1.CompletionItemKind.Keyword, detail: 'Flow block', documentation: 'Defines request handling logic.\n\nExample:\n```restx\nflow: {\n  user -> db.users.findById(id)\n  return -> user\n}\n```' },
    { label: 'auth', kind: node_1.CompletionItemKind.Keyword, detail: 'Authentication', documentation: 'Specifies authentication method.\n\nOptions: `bearer`, `basic`, `apiKey`, `none`' },
    { label: 'authorize', kind: node_1.CompletionItemKind.Keyword, detail: 'Authorisation', documentation: 'Specifies authorisation expression.\n\nExample:\n```restx\nauthorize: $auth.role == "admin"\n```' },
    { label: 'return', kind: node_1.CompletionItemKind.Keyword, detail: 'Return statement', documentation: 'Returns a value from a flow.\n\nExample:\n```restx\nreturn -> user\n```' },
    { label: 'throw', kind: node_1.CompletionItemKind.Keyword, detail: 'Throw error', documentation: 'Throws an HTTP error.\n\nExample:\n```restx\nthrow 404\nthrow 400 "Invalid input"\n```' },
    { label: 'for', kind: node_1.CompletionItemKind.Keyword, detail: 'For loop', documentation: 'Iterates over a collection.\n\nExample:\n```restx\nfor item in items { ... }\n```' },
    { label: 'match', kind: node_1.CompletionItemKind.Keyword, detail: 'Pattern matching', documentation: 'Pattern matching expression.\n\nExample:\n```restx\nmatch result {\n  Success: { ... }\n  Error: { ... }\n}\n```' },
];
const httpMethods = [
    { label: 'GET', kind: node_1.CompletionItemKind.Method, detail: 'HTTP GET', documentation: 'Defines a GET endpoint.\n\nExample:\n```restx\nGET /users/:id -> User\n```' },
    { label: 'POST', kind: node_1.CompletionItemKind.Method, detail: 'HTTP POST', documentation: 'Defines a POST endpoint.\n\nExample:\n```restx\nPOST /users { body: CreateUser } -> User\n```' },
    { label: 'PUT', kind: node_1.CompletionItemKind.Method, detail: 'HTTP PUT', documentation: 'Defines a PUT endpoint.\n\nExample:\n```restx\nPUT /users/:id { body: UpdateUser } -> User\n```' },
    { label: 'PATCH', kind: node_1.CompletionItemKind.Method, detail: 'HTTP PATCH', documentation: 'Defines a PATCH endpoint.\n\nExample:\n```restx\nPATCH /users/:id { body: PatchUser } -> User\n```' },
    { label: 'DELETE', kind: node_1.CompletionItemKind.Method, detail: 'HTTP DELETE', documentation: 'Defines a DELETE endpoint.\n\nExample:\n```restx\nDELETE /users/:id -> void\n```' },
];
const types = [
    { label: 'str', kind: node_1.CompletionItemKind.TypeParameter, detail: 'String type', documentation: 'Unicode string' },
    { label: 'int', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Integer type', documentation: '32-bit signed integer' },
    { label: 'long', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Long type', documentation: '64-bit signed integer' },
    { label: 'float', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Float type', documentation: '32-bit floating point' },
    { label: 'double', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Double type', documentation: '64-bit floating point' },
    { label: 'bool', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Boolean type', documentation: 'true or false' },
    { label: 'date', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Date type', documentation: 'Calendar date (ISO 8601)' },
    { label: 'datetime', kind: node_1.CompletionItemKind.TypeParameter, detail: 'DateTime type', documentation: 'Date and time (ISO 8601)' },
    { label: 'time', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Time type', documentation: 'Time of day (ISO 8601)' },
    { label: 'timestamp', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Timestamp type', documentation: 'Database timestamp' },
    { label: 'email', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Email type', documentation: 'Email address (RFC 5322)' },
    { label: 'uri', kind: node_1.CompletionItemKind.TypeParameter, detail: 'URI type', documentation: 'URI reference (RFC 3986)' },
    { label: 'url', kind: node_1.CompletionItemKind.TypeParameter, detail: 'URL type', documentation: 'URL (RFC 3986)' },
    { label: 'uuid', kind: node_1.CompletionItemKind.TypeParameter, detail: 'UUID type', documentation: 'UUID (RFC 4122)' },
    { label: 'binary', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Binary type', documentation: 'Binary data (Base64)' },
    { label: 'secret', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Secret type', documentation: 'Sensitive data (auto-stripped from responses)' },
    { label: 'any', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Any type', documentation: 'Any JSON value' },
    { label: 'void', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Void type', documentation: 'No return value' },
    { label: 'text', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Text type', documentation: 'Long text (database)' },
    { label: 'json', kind: node_1.CompletionItemKind.TypeParameter, detail: 'JSON type', documentation: 'JSON column (database)' },
    { label: 'jsonb', kind: node_1.CompletionItemKind.TypeParameter, detail: 'JSONB type', documentation: 'Binary JSON column (database)' },
    { label: 'decimal', kind: node_1.CompletionItemKind.TypeParameter, detail: 'Decimal type', documentation: 'Decimal with precision. Usage: decimal(10,2)' },
    { label: 'bigint', kind: node_1.CompletionItemKind.TypeParameter, detail: 'BigInt type', documentation: 'Large integer (database)' },
];
const modifiers = [
    { label: 'pk', kind: node_1.CompletionItemKind.Keyword, detail: 'Primary key', documentation: 'Marks column as primary key' },
    { label: 'unique', kind: node_1.CompletionItemKind.Keyword, detail: 'Unique constraint', documentation: 'Marks column as unique' },
    { label: 'default', kind: node_1.CompletionItemKind.Keyword, detail: 'Default value', documentation: 'Sets default value. Usage: `= value`' },
];
const annotations = [
    { label: '@min', kind: node_1.CompletionItemKind.Function, detail: 'Minimum constraint', documentation: 'Minimum value/length.\n\nExample: `@min(0)`, `@min(3)`', insertText: '@min(${1:value})' },
    { label: '@max', kind: node_1.CompletionItemKind.Function, detail: 'Maximum constraint', documentation: 'Maximum value/length.\n\nExample: `@max(100)`, `@max(255)`', insertText: '@max(${1:value})' },
    { label: '@pattern', kind: node_1.CompletionItemKind.Function, detail: 'Regex pattern', documentation: 'Regex pattern constraint.\n\nExample: `@pattern("^[a-z]+$")`', insertText: '@pattern("${1:regex}")' },
    { label: '@unique', kind: node_1.CompletionItemKind.Function, detail: 'Unique constraint', documentation: 'Marks field as unique' },
    { label: '@index', kind: node_1.CompletionItemKind.Function, detail: 'Database index', documentation: 'Creates database index.\n\nExample: `@index(column1, column2)`', insertText: '@index(${1:columns})' },
    { label: '@cache', kind: node_1.CompletionItemKind.Function, detail: 'Cache annotation', documentation: 'Enables caching.\n\nExample: `@cache(ttl: 5m)`', insertText: '@cache(ttl: ${1:5m})' },
    { label: '@cron', kind: node_1.CompletionItemKind.Function, detail: 'Cron schedule', documentation: 'Cron expression for scheduled tasks.\n\nExample: `@cron("0 0 * * *")`', insertText: '@cron("${1:0 0 * * *}")' },
    { label: '@transaction', kind: node_1.CompletionItemKind.Function, detail: 'Transaction annotation', documentation: 'Wraps flow in a database transaction' },
    { label: '@retry', kind: node_1.CompletionItemKind.Function, detail: 'Retry annotation', documentation: 'Retry on failure.\n\nExample: `@retry(3)`', insertText: '@retry(${1:3})' },
];
const builtinFunctions = [
    { label: 'now()', kind: node_1.CompletionItemKind.Function, detail: 'Current timestamp', documentation: 'Returns current date/time', insertText: 'now()' },
    { label: 'uuid()', kind: node_1.CompletionItemKind.Function, detail: 'Generate UUID', documentation: 'Generates a new UUID', insertText: 'uuid()' },
    { label: 'hash', kind: node_1.CompletionItemKind.Function, detail: 'Hash function', documentation: 'Hashes a value (for passwords).\n\nExample: `hash(password)`', insertText: 'hash(${1:value})' },
    { label: 'verify', kind: node_1.CompletionItemKind.Function, detail: 'Verify hash', documentation: 'Verifies a value against a hash.\n\nExample: `verify(password, hash)`', insertText: 'verify(${1:value}, ${2:hash})' },
    { label: 'jwt.sign', kind: node_1.CompletionItemKind.Function, detail: 'Sign JWT', documentation: 'Signs a JWT token.\n\nExample: `jwt.sign(payload, secret)`', insertText: 'jwt.sign(${1:payload}, ${2:secret})' },
    { label: 'jwt.verify', kind: node_1.CompletionItemKind.Function, detail: 'Verify JWT', documentation: 'Verifies a JWT token.\n\nExample: `jwt.verify(token, secret)`', insertText: 'jwt.verify(${1:token}, ${2:secret})' },
    { label: 'random.token', kind: node_1.CompletionItemKind.Function, detail: 'Random token', documentation: 'Generates a random token.\n\nExample: `random.token(32)`', insertText: 'random.token(${1:32})' },
    { label: 'random.string', kind: node_1.CompletionItemKind.Function, detail: 'Random string', documentation: 'Generates a random string.\n\nExample: `random.string(8, "ABC123")`', insertText: 'random.string(${1:length}, ${2:charset})' },
    { label: 'log.info', kind: node_1.CompletionItemKind.Function, detail: 'Log info', documentation: 'Logs an info message', insertText: 'log.info(${1:message})' },
    { label: 'log.error', kind: node_1.CompletionItemKind.Function, detail: 'Log error', documentation: 'Logs an error message', insertText: 'log.error(${1:message})' },
    { label: 'email.send', kind: node_1.CompletionItemKind.Function, detail: 'Send email', documentation: 'Sends an email.\n\nExample: `email.send(to, template, data)`', insertText: 'email.send(${1:to}, ${2:template}, ${3:data})' },
    { label: 'cache.get', kind: node_1.CompletionItemKind.Function, detail: 'Get from cache', documentation: 'Gets a value from cache', insertText: 'cache.get(${1:key})' },
    { label: 'cache.set', kind: node_1.CompletionItemKind.Function, detail: 'Set in cache', documentation: 'Sets a value in cache', insertText: 'cache.set(${1:key}, ${2:value})' },
    { label: 'cache.invalidate', kind: node_1.CompletionItemKind.Function, detail: 'Invalidate cache', documentation: 'Invalidates cache keys', insertText: 'cache.invalidate(${1:pattern})' },
    { label: 'webhook.emit', kind: node_1.CompletionItemKind.Function, detail: 'Emit webhook', documentation: 'Emits a webhook event.\n\nExample: `webhook.emit("user.created", data)`', insertText: 'webhook.emit(${1:event}, ${2:data})' },
];
const dbOperations = [
    { label: 'findById', kind: node_1.CompletionItemKind.Method, detail: 'Find by ID', documentation: 'Finds a record by primary key.\n\nExample: `db.users.findById(id)`', insertText: 'findById(${1:id})' },
    { label: 'where', kind: node_1.CompletionItemKind.Method, detail: 'Where clause', documentation: 'Filters records.\n\nExample: `db.users.where(email == value)`', insertText: 'where(${1:condition})' },
    { label: 'first', kind: node_1.CompletionItemKind.Method, detail: 'First record', documentation: 'Returns first matching record', insertText: 'first()' },
    { label: 'all', kind: node_1.CompletionItemKind.Method, detail: 'All records', documentation: 'Returns all matching records', insertText: 'all()' },
    { label: 'insert', kind: node_1.CompletionItemKind.Method, detail: 'Insert record', documentation: 'Inserts a new record.\n\nExample: `db.users.insert({ email: value })`', insertText: 'insert(${1:data})' },
    { label: 'update', kind: node_1.CompletionItemKind.Method, detail: 'Update record', documentation: 'Updates a record.\n\nExample: `db.users.update(id, { name: value })`', insertText: 'update(${1:id}, ${2:data})' },
    { label: 'delete', kind: node_1.CompletionItemKind.Method, detail: 'Delete record', documentation: 'Deletes a record.\n\nExample: `db.users.delete(id)`', insertText: 'delete(${1:id})' },
    { label: 'upsert', kind: node_1.CompletionItemKind.Method, detail: 'Upsert record', documentation: 'Inserts or updates a record.\n\nExample: `db.users.upsert(data, on: "email")`', insertText: 'upsert(${1:data}, on: ${2:key})' },
    { label: 'count', kind: node_1.CompletionItemKind.Method, detail: 'Count records', documentation: 'Counts matching records', insertText: 'count()' },
    { label: 'sum', kind: node_1.CompletionItemKind.Method, detail: 'Sum values', documentation: 'Sums a column.\n\nExample: `db.orders.sum(total)`', insertText: 'sum(${1:column})' },
    { label: 'avg', kind: node_1.CompletionItemKind.Method, detail: 'Average values', documentation: 'Averages a column', insertText: 'avg(${1:column})' },
    { label: 'paginate', kind: node_1.CompletionItemKind.Method, detail: 'Paginate results', documentation: 'Paginates results.\n\nExample: `db.users.paginate(page, per_page)`', insertText: 'paginate(${1:page}, ${2:per_page})' },
    { label: 'orderBy', kind: node_1.CompletionItemKind.Method, detail: 'Order by', documentation: 'Orders results.\n\nExample: `db.users.orderBy(created_at, desc)`', insertText: 'orderBy(${1:column}, ${2:asc})' },
    { label: 'limit', kind: node_1.CompletionItemKind.Method, detail: 'Limit results', documentation: 'Limits number of results', insertText: 'limit(${1:count})' },
    { label: 'include', kind: node_1.CompletionItemKind.Method, detail: 'Include relations', documentation: 'Includes related records.\n\nExample: `db.users.findById(id).include(orders)`', insertText: 'include(${1:relation})' },
    { label: 'query', kind: node_1.CompletionItemKind.Method, detail: 'Raw SQL query', documentation: 'Executes raw SQL.\n\nExample: `db.query(\\`SELECT * FROM users\\`)`', insertText: 'query(`${1:sql}`)' },
];
const magicVariables = [
    { label: '$auth', kind: node_1.CompletionItemKind.Variable, detail: 'Auth context', documentation: 'Authenticated user context.\n\nProperties: `id`, `role`, `email`, etc.' },
    { label: '$auth.id', kind: node_1.CompletionItemKind.Variable, detail: 'Auth user ID', documentation: 'Authenticated user ID' },
    { label: '$auth.role', kind: node_1.CompletionItemKind.Variable, detail: 'Auth user role', documentation: 'Authenticated user role' },
    { label: '$request', kind: node_1.CompletionItemKind.Variable, detail: 'Request context', documentation: 'HTTP request context.\n\nProperties: `method`, `path`, `headers`, `ip`' },
    { label: '$request.headers', kind: node_1.CompletionItemKind.Variable, detail: 'Request headers', documentation: 'HTTP request headers' },
    { label: '$request.ip', kind: node_1.CompletionItemKind.Variable, detail: 'Request IP', documentation: 'Client IP address' },
    { label: '$response', kind: node_1.CompletionItemKind.Variable, detail: 'Response context', documentation: 'HTTP response context.\n\nProperties: `status`, `headers`' },
    { label: '$query', kind: node_1.CompletionItemKind.Variable, detail: 'Query parameters', documentation: 'URL query parameters' },
    { label: '$env', kind: node_1.CompletionItemKind.Variable, detail: 'Environment', documentation: 'Environment variables.\n\nUsage: `$env.variable_name`' },
];
const authTypes = [
    { label: 'bearer', kind: node_1.CompletionItemKind.EnumMember, detail: 'Bearer token', documentation: 'JWT Bearer token authentication' },
    { label: 'basic', kind: node_1.CompletionItemKind.EnumMember, detail: 'Basic auth', documentation: 'HTTP Basic authentication' },
    { label: 'apiKey', kind: node_1.CompletionItemKind.EnumMember, detail: 'API Key', documentation: 'API Key authentication' },
    { label: 'none', kind: node_1.CompletionItemKind.EnumMember, detail: 'No auth', documentation: 'No authentication required' },
];
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