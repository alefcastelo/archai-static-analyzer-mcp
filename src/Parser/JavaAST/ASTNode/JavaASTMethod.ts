import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTMethod extends JavaASTNode {
    constructor(
        public readonly methodName: string,
        public readonly codeContent: string,
        public readonly methodArguments: string[]
    ) {
        super('method');
    }
}