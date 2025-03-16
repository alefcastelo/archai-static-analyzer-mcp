import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTPackage extends JavaASTNode {
    constructor(
        public readonly codeContent: string
    ) {
        super('package');
    }

    getPackageName(): string {
        return this.codeContent.replace('package', '').trim();
    }
}
