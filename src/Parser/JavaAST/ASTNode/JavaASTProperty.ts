import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";

export class JavaASTProperty extends JavaASTNode {
    constructor(
        public readonly codeContent: string
    ) {
        super('property');
    }

    private removeSemicolon(property: string): string {
        return property.replace(';', '').trim();
    }
    
    getPropertyName(): string {
        const parts = this.codeContent.split(' ');
        const lastPart = parts.pop();
        return this.removeSemicolon(lastPart!);
    }
}