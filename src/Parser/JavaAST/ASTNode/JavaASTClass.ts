import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTClass extends JavaASTNode {
    constructor(
        public readonly codeContent: string
    ) {
        super('class');
    }

    getClassName(): string {
        return this.codeContent.replace('class', '').trim();
    }
}