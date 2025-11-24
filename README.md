# RESTx for Visual Studio Code

Syntax highlighting for RESTx API specification files (`.restx`).

## Features

- Syntax highlighting for all RESTx constructs
- HTTP method highlighting (GET, POST, PUT, PATCH, DELETE)
- Type highlighting (primitives, custom types, generics)
- Annotation support (@cache, @cron, @min, @max, etc.)
- Variable highlighting ($auth, $env, $request, db.*)
- Comment support (#)
- Auto-closing brackets and quotes

## Installation

### Option 1: Download VSIX (Recommended)

1. Download the latest `.vsix` file from [Releases](https://github.com/restx-org/vscode-restx/releases)
2. Open VS Code
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
4. Type **"Install from VSIX"** and select it
5. Navigate to the downloaded `.vsix` file and select it
6. Restart VS Code

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/restx-org/vscode-restx.git
cd vscode-restx

# Package the extension
npx @vscode/vsce package --allow-missing-repository

# Install the extension
code --install-extension restx-0.1.0.vsix
```

If `code` command is not available, install manually via VS Code:
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type **"Install from VSIX"**
3. Select the generated `restx-0.1.0.vsix` file

## Supported Syntax

```restx
# Metadata
api MyAPI 1.0.0
server: "https://api.example.com"

# Types
type User {
  id: uuid
  email: email @unique
  name: str
}

# Database
table users {
  id: uuid pk
  email: email unique
  created_at: timestamp = now()
}

# Routes
GET /users/:id -> User
  auth: bearer
  flow: {
    user -> db.users.findById(id)
    ? user == null : throw 404
    return -> user
  }
```

## Development

### Setup

```bash
git clone https://github.com/restx-org/vscode-restx.git
cd vscode-restx
npm install
npm run compile
```

### Testing

```bash
npm test
```

### Debugging

1. Open the project in VS Code
2. Press F5 to launch Extension Development Host
3. Open a `.restx` file in the new window
4. Check Output panel > "RESTx Language Server" for logs

## Links

- [RESTx Specification](https://github.com/restx-org/spec)
- [Report Issues](https://github.com/restx-org/vscode-restx/issues)

## License

MIT
