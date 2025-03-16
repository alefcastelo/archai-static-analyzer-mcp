export type Token = {
    type: string;
    codeContent: string;
}
export type Tokens = Token[];

export class JavaLexer {
    public readonly tokens: RegExp;

    public static readonly packageName = 'PACKAGE';
    public static readonly packageNameRegex = 'package\\s+(\\w+).+(\\w+)';

    public static readonly import = 'IMPORT';
    public static readonly importRegex = 'import\\s+(\\w+).+(\\w+)';

    public static readonly className = 'CLASS_NAME';
    public static readonly classNameRegex = 'class\\s+(\\w+)';

    public static readonly property = 'PROPERTY';
    public static readonly propertyRegex = '(\\w+)\\s+(\\w+)\\s*(?:\s*=\s*[^;]*)?\s*;';

    public static readonly finalKeyword = 'FINAL';
    public static readonly finalKeywordRegex = 'final';

    public static readonly publicKeyword = 'PUBLIC';
    public static readonly publicKeywordRegex = 'public';

    public static readonly privateKeyword = 'PRIVATE';
    public static readonly privateKeywordRegex = 'private';

    public static readonly protectedKeyword = 'PROTECTED';
    public static readonly protectedKeywordRegex = 'protected';

    public static readonly method = 'METHOD';
    public static readonly methodRegex = '\b\w+\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}';
    public static readonly methodNameRegex = '\\b\\w+\\b(?=\\()';

    public static readonly methodArguments = 'METHOD_ARGUMENTS';
    public static readonly methodArgumentsRegex = '\\(([^)]*)\\)';

    public static readonly annotation = 'ANNOTATION';
    public static readonly annotationRegex = '@\\w+(?:\s*\\([^)]*\\))?';

    public readonly groupSpecification: [string, string][] = [
        [JavaLexer.packageName, JavaLexer.packageNameRegex],
        [JavaLexer.import, JavaLexer.importRegex],
        [JavaLexer.className, JavaLexer.classNameRegex],
        [JavaLexer.property, JavaLexer.propertyRegex],
        [JavaLexer.method, JavaLexer.methodNameRegex],
        [JavaLexer.methodArguments, JavaLexer.methodArgumentsRegex],
        [JavaLexer.finalKeyword, JavaLexer.finalKeywordRegex],
        [JavaLexer.publicKeyword, JavaLexer.publicKeywordRegex],
        [JavaLexer.privateKeyword, JavaLexer.privateKeywordRegex],
        [JavaLexer.protectedKeyword, JavaLexer.protectedKeywordRegex],
        [JavaLexer.annotation, JavaLexer.annotationRegex],
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

                tokens.push({ type: groupName, codeContent });
            }
        }

        return tokens;
    }
}