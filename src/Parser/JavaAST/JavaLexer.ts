export type Token = {
    type: string;
    codeContent: string;
}

export type MethodToken = Token & {
    methodName: string;
    arguments: string[];
}

export type Tokens = (Token | MethodToken)[];

export class JavaLexer {
    public readonly tokens: RegExp;

    public static readonly packageName = 'PACKAGE';
    public static readonly packageNameRegex = 'package\\s+(\\w+).+(\\w+)';

    public static readonly import = 'IMPORT';
    public static readonly importRegex = 'import\\s+(\\w+).+(\\w+)';

    public static readonly className = 'CLASS_NAME';
    public static readonly classNameRegex = 'class\\s+(\\w+)';

    public static readonly property = 'PROPERTY';
    public static readonly propertyRegex = '(?:public|private|protected)\\s+(?:final\\s+)?(\\w+)\\s+(\\w+)\\s*(?:\s*=\s*[^;]*)?\s*;';

    public static readonly method = 'METHOD';
    public static readonly methodRegex = '(?:public|private|protected)?\\s*(?:final\\s+)?(\\w+)\\s+(\\w+)\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*?)\\}';
    public static readonly methodNameRegex = '\\b\\w+\\b(?=\\()';
    public static readonly methodArgumentsRegex = '\\(([^)]*)\\)';


    public readonly groupSpecification: [string, string][] = [
        [JavaLexer.packageName, JavaLexer.packageNameRegex],
        [JavaLexer.import, JavaLexer.importRegex],
        [JavaLexer.className, JavaLexer.classNameRegex],
        [JavaLexer.property, JavaLexer.propertyRegex],
        [JavaLexer.method, JavaLexer.methodRegex],
    ];

    constructor() {
        const groupSpecification = this.groupSpecification.map(([name, regex]) => `(?<${name}>${regex})`).join('|')
        this.tokens = new RegExp(groupSpecification, 'g');
    }

    public analyze(content: string): Tokens {
        const tokens: Tokens = [];

        for (const match of content.matchAll(this.tokens)) {
            for (const [groupName] of this.groupSpecification) {
                if (!match.groups) {
                    continue
                }

                if (!match.groups[groupName]) {
                    continue
                }

                const codeContent = match.groups[groupName];

                if (groupName === JavaLexer.method) {
                    tokens.push(this.analyzeMethodCode(codeContent));
                } else {
                    tokens.push({ type: groupName, codeContent });
                }
            }
        }

        return tokens;
    }

    private analyzeMethodCode(methodCodeContent: string): MethodToken {
        const methodNameMatch = methodCodeContent.match(JavaLexer.methodNameRegex);

        if (!methodNameMatch) {
            throw new Error(`Method name not found in method code content: ${methodCodeContent}`);
        }

        const [methodName] = methodNameMatch;

        const argumentsWithParentesisMatch = methodCodeContent.match(JavaLexer.methodArgumentsRegex);

        if (!argumentsWithParentesisMatch) {
            return { type: JavaLexer.method, methodName, codeContent: methodCodeContent, arguments: [] };
        }

        const [_methodArgumentsWithParentesis, methodArgumentsWithoutParentesis] = argumentsWithParentesisMatch;

        if (!methodArgumentsWithoutParentesis) {
            return { type: JavaLexer.method, methodName, codeContent: methodCodeContent, arguments: [] };
        }

        const methodArguments = methodArgumentsWithoutParentesis.split(',')

        return { type: JavaLexer.method, methodName, codeContent: methodCodeContent, arguments: methodArguments };
    }
}