import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTPackage extends JavaASTNode {
    public readonly packageName: string;

    constructor(
        public readonly codeContent: string
    ) {
        super('package');
        this.packageName = this.getPackageName();
    }

    private getPackageName(): string {
        return this.codeContent.replace('package', '').trim();
    }
}
