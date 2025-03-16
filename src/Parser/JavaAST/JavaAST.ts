import type { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";
import type { MethodToken } from "@/Parser/JavaAST/JavaLexer";
import { JavaLexer } from "@/Parser/JavaAST/JavaLexer";
import { JavaASTPackage } from "@/Parser/JavaAST/ASTNode/JavaASTPackage";
import { JavaASTImport } from "@/Parser/JavaAST/ASTNode/JavaASTImport";
import { JavaASTClass } from "@/Parser/JavaAST/ASTNode/JavaASTClass";
import { JavaASTProperty } from "@/Parser/JavaAST/ASTNode/JavaASTProperty";
import { JavaASTMethod } from "@/Parser/JavaAST/ASTNode/JavaASTMethod";

export class JavaAST {
    constructor(public readonly lexer: JavaLexer) {}

    public ast: JavaASTNode[] = [];

    public parse(fileContent: string): JavaASTNode[] {
        const tokens = this.lexer.analyze(fileContent);

        for (const token of tokens) {
            switch (token.type) {
                case JavaLexer.packageName:
                    this.ast.push(new JavaASTPackage(token.codeContent));
                    break;
                case JavaLexer.import:
                    this.ast.push(new JavaASTImport(token.codeContent));
                    break;
                case JavaLexer.className:
                    this.ast.push(new JavaASTClass(token.codeContent));
                    break;
                case JavaLexer.property:
                    this.ast.push(new JavaASTProperty(token.codeContent));
                    break;
                case JavaLexer.method:
                    const methodToken = token as MethodToken;
                    this.ast.push(new JavaASTMethod(methodToken.methodName, methodToken.codeContent, methodToken.arguments));
                    break;
                default:
                    throw new Error(`Unknown token: ${token.type}`);
            }
        }

        return this.ast;
    }
}