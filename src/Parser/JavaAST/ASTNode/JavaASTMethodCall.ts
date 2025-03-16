import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";
import type { Token } from "@/Parser/JavaAST/JavaLexer";

export class JavaASTMethodCall extends JavaASTNode {
    public readonly methodName: string;
    public readonly methodArguments: string[];

    constructor(
        public readonly codeContent: string,
        public readonly methodArgumentsToken: Token,
    ) {
        super('methodCall');
        this.methodName = this.codeContent;
        this.methodArguments = this.getMethodArguments()
    }

    private getMethodArguments(): string[] {
        return this.removeBreakLines(this.methodArgumentsToken.codeContent).slice(1, -1).split(",").map((argument) => argument.trim());
    }

    private removeBreakLines(codeContent: string): string {
        return codeContent.replace(/\n/g, '');
    }
}