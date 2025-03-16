import { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";
import type { Token } from "../JavaLexer";

export class JavaASTClass extends JavaASTNode {
    public readonly className: string;
    public readonly annotations: string[];

    constructor(
        public readonly codeContent: string,
        public readonly isFinal: boolean,
        public readonly classAccessModifier: string,
        public readonly annotationTokens: Token[],
    ) {
        super('class');
        this.className = this.getClassName();
        this.annotations = this.getAnnotations();
    }

    private getClassName(): string {
        return this.codeContent.replace('class', '').trim();
    }

    private getAnnotations(): string[] {
        return this.annotationTokens.map((annotation) => annotation.codeContent);
    }
}