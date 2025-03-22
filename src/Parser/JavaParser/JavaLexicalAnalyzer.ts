export type Token = {
    type: string;
    value: string;
}

export class JavaLexicalAnalyzer {
    public tokens: Token[] = [];
    public readonly regex: RegExp;

    public static readonly PACKAGE = 'PACKAGE_KEYWORD';
    public static readonly IMPORT = 'IMPORT_KEYWORD';
    public static readonly EXTENDS = 'EXTENDS_KEYWORD';
    public static readonly IMPLEMENTS = 'IMPLEMENTS_KEYWORD';
    public static readonly PUBLIC = 'PUBLIC_KEYWORD';
    public static readonly PRIVATE = 'PRIVATE_KEYWORD';
    public static readonly PROTECTED = 'PROTECTED_KEYWORD';
    public static readonly FINAL = 'FINAL_KEYWORD';
    public static readonly STATIC = 'STATIC'
    public static readonly CLASS = 'CLASS_KEYWORD';
    public static readonly CURLY_BRACE_OPEN = 'CURLY_BRACE_OPEN';
    public static readonly CURLY_BRACE_CLOSE = 'CURLY_BRACE_CLOSE';
    public static readonly PARENTHESIS_OPEN = 'PARENTHESIS_OPEN';
    public static readonly COMMA = 'COMMA';
    public static readonly PARENTHESIS_CLOSE = 'PARENTHESIS_CLOSE';
    public static readonly SEMICOLON = 'SEMICOLON';
    public static readonly SIMPLE_ASIGN = 'SIMPLE_ASIGN';
    public static readonly IDENTIFIER = 'IDENTIFIER';
    public static readonly RETURN = 'RETURN';
    public static readonly NUMBER = 'NUMBER';
    public static readonly STRING = 'STRING';

    public readonly spec: [string, string][] = [
        [JavaLexicalAnalyzer.CLASS, 'class'],
        [JavaLexicalAnalyzer.PACKAGE, 'package'],
        [JavaLexicalAnalyzer.IMPORT, 'import'],
        [JavaLexicalAnalyzer.PUBLIC, 'public'],
        [JavaLexicalAnalyzer.PRIVATE, 'private'],
        [JavaLexicalAnalyzer.STATIC, 'static'],
        [JavaLexicalAnalyzer.PROTECTED, 'protected'],
        [JavaLexicalAnalyzer.EXTENDS, 'extends'],
        [JavaLexicalAnalyzer.FINAL, 'final'],
        [JavaLexicalAnalyzer.IMPLEMENTS, 'implements'],
        [JavaLexicalAnalyzer.CURLY_BRACE_OPEN, '{'],
        [JavaLexicalAnalyzer.CURLY_BRACE_CLOSE, '}'],
        [JavaLexicalAnalyzer.PARENTHESIS_OPEN, '\\('],
        [JavaLexicalAnalyzer.PARENTHESIS_CLOSE, '\\)'],
        [JavaLexicalAnalyzer.COMMA, ','],
        [JavaLexicalAnalyzer.SEMICOLON, ';'],
        [JavaLexicalAnalyzer.SIMPLE_ASIGN, '='],
        [JavaLexicalAnalyzer.RETURN, 'return'],
        [JavaLexicalAnalyzer.IDENTIFIER, '\\w+'],
        [JavaLexicalAnalyzer.NUMBER, '\\d+'],
        [JavaLexicalAnalyzer.STRING, '"([^"]*)"'],
    ];

    constructor() {
        this.regex = new RegExp(this.spec.map(([groupName, regexPart]) => `(?<${groupName}>${regexPart})`).join('|'), 'g');
    }

    public analyze(content: string) {
        const tokens: Token[] = [];

        for (const match of content.matchAll(this.regex)) {
            for (const [groupName] of this.spec) {
                if (!match.groups) {
                    continue
                }

                if (!match.groups[groupName]) {
                    continue
                }

                tokens.push({ type: groupName, value: match.groups[groupName]});
            }
        }

        this.tokens = tokens;
    }

    public getNextToken(): Token | null {
        const token = this.tokens.shift();

        if (!token) {
            return null;
        }

        return token;
    }
}