import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTImport extends JavaASTNode {
    constructor(
        public readonly codeContent: string
    ) {
        super('import');
    }

    getModuleName(): string {
        return this.codeContent.replace('import', '').trim();
    }
}