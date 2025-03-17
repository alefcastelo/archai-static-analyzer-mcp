import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTImport extends JavaASTNode {
    public readonly filepath: string;
    public readonly className: string;
    public readonly packageName: string;

    constructor(
        public readonly codeContent: string
    ) {
        super('import');
        this.className = this.getClassName();
        this.filepath = this.getFilePath();
        this.packageName = this.getPackageName();
    }

    private getPackageName(): string {
        return this.className.split('.').slice(0, -1).join('.');
    }

    private getClassName(): string {
        return this.codeContent.replace('import', '').trim();
    }

    private getFilePath(): string {
        return this.codeContent.replace('import', '').trim().split('.').join('/') + '.java';
    }
}