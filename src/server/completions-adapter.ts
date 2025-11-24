/**
 * Adapter to convert shared @restx/completions to VS Code LSP format
 */
import {
  CompletionItem as LSPCompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver/node';
import * as completions from '@restx/completions';

// Map completion item kinds from shared format to VS Code LSP format
function mapCompletionKind(kind: string): CompletionItemKind {
  switch (kind) {
    case 'keyword': return CompletionItemKind.Keyword;
    case 'method': return CompletionItemKind.Method;
    case 'type': return CompletionItemKind.TypeParameter;
    case 'modifier': return CompletionItemKind.Keyword;
    case 'function': return CompletionItemKind.Function;
    case 'variable': return CompletionItemKind.Variable;
    case 'enum': return CompletionItemKind.EnumMember;
    default: return CompletionItemKind.Text;
  }
}

// Convert shared completion item to VS Code LSP format
function toVSCodeCompletion(item: completions.CompletionItem): LSPCompletionItem {
  return {
    label: item.label,
    kind: mapCompletionKind(item.kind),
    detail: item.detail,
    documentation: item.documentation,
    insertText: item.insertText,
  };
}

// Export converted completions
export const keywords = completions.keywords.map(toVSCodeCompletion);
export const httpMethods = completions.httpMethods.map(toVSCodeCompletion);
export const types = completions.types.map(toVSCodeCompletion);
export const modifiers = completions.modifiers.map(toVSCodeCompletion);
export const annotations = completions.annotations.map(toVSCodeCompletion);
export const builtinFunctions = completions.builtinFunctions.map(toVSCodeCompletion);
export const dbOperations = completions.dbOperations.map(toVSCodeCompletion);
export const magicVariables = completions.magicVariables.map(toVSCodeCompletion);
export const authTypes = completions.authTypes.map(toVSCodeCompletion);
