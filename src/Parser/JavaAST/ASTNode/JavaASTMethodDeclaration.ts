import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";
import type { Token } from "@/Parser/JavaAST/JavaLexer";

export class JavaASTMethodDeclaration extends JavaASTNode {
    public readonly methodArguments: string[];
    public readonly methodName: string;
    public readonly methodAnnotations: string[];

    constructor(
        public readonly codeContent: string,
        public readonly methodArgumentsToken: Token,
        public readonly isFinal: boolean,
        public readonly methodAccessModifier: string,
        public readonly methodAnnotationsTokens: Token[],
    ) {
        super('methodDeclaration');
        this.methodName = this.getMethodName();
        this.methodArguments = this.getMethodArguments();
        this.methodAnnotations = this.getMethodAnnotations();
    }

    private getMethodName(): string {
        return this.codeContent;
    }

    private getMethodArguments(): string[] {
        return this.removeBreakLines(this.methodArgumentsToken.codeContent).slice(1, -1).split(",").map((argument) => argument.trim());
    }

    private removeBreakLines(codeContent: string): string {
        return codeContent.replace(/\n/g, '');
    }

    private getMethodAnnotations(): string[] {
        return this.methodAnnotationsTokens.map((annotation) => annotation.codeContent);
    }
}