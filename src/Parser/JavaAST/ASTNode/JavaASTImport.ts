import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTImport extends JavaASTNode {
    public readonly moduleName: string;

    constructor(
        public readonly codeContent: string
    ) {
        super('import');
        this.moduleName = this.getModuleName();
    }

    private getModuleName(): string {
        return this.codeContent.replace('import', '').trim();
    }
}