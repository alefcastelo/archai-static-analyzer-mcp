import type { JavaASTNode } from "@/Parser/JavaAST/ASTNode/JavaASTNode";
import { JavaLexer, type Token } from "@/Parser/JavaAST/JavaLexer";
import { JavaASTPackage } from "@/Parser/JavaAST/ASTNode/JavaASTPackage";
import { JavaASTImport } from "@/Parser/JavaAST/ASTNode/JavaASTImport";
import { JavaASTClass } from "@/Parser/JavaAST/ASTNode/JavaASTClass";
import { JavaASTProperty } from "@/Parser/JavaAST/ASTNode/JavaASTProperty";
import { JavaASTMethodDeclaration } from "@/Parser/JavaAST/ASTNode/JavaASTMethodDeclaration";
import { JavaASTMethodCall } from "@/Parser/JavaAST/ASTNode/JavaASTMethodCall";

export class JavaAST {
    constructor(public readonly lexer: JavaLexer) {}

    public ast: JavaASTNode[] = [];


    public parse(fileContent: string): JavaASTNode[] {
        const tokens = this.lexer.analyze(fileContent);

        let metadata = [];

        while (tokens.length > 0) {
            const token = tokens.shift();

            if (!token) {
                throw new Error("Token not found");
            }

            switch (token.type) {
                case JavaLexer.packageName:
                    this.ast.push(new JavaASTPackage(token.codeContent));
                    metadata = [];
                    break;
                case JavaLexer.import:
                    this.ast.push(new JavaASTImport(token.codeContent));
                    metadata = [];
                    break;
                case JavaLexer.className:
                    let classAccessModifier = '';
                    let classIsFinal = false;
                    let classAnnotations: Token[] = [];

                    for (const item of metadata) {
                        if (item.type === JavaLexer.publicKeyword) {
                            classAccessModifier = 'public';
                        }

                        if (item.type === JavaLexer.privateKeyword) {
                            classAccessModifier = 'private';
                        }

                        if (item.type === JavaLexer.protectedKeyword) {
                            classAccessModifier = 'protected';
                        }

                        if (item.type === JavaLexer.finalKeyword) {
                            classIsFinal = true;
                        }

                        if (item.type === JavaLexer.annotation) {
                            classAnnotations.push(item)
                        }
                    }

                    this.ast.push(new JavaASTClass(token.codeContent, classIsFinal, classAccessModifier, classAnnotations));
                    metadata = [];
                    break;
                case JavaLexer.property:
                    // If there is no metadata, it is a variable declaration
                    if (metadata.length == 0) {
                        continue;
                    }

                    let propertyAccessModifier = '';
                    let propertyIsFinal = false;

                    for (const item of metadata) {
                        if (item.type === JavaLexer.publicKeyword) {
                            propertyAccessModifier = 'public';
                        }
                        
                        if (item.type === JavaLexer.privateKeyword) {
                            propertyAccessModifier = 'private';
                        }

                        if (item.type === JavaLexer.protectedKeyword) {
                            propertyAccessModifier = 'protected';
                        }

                        if (item.type === JavaLexer.finalKeyword) {
                            propertyIsFinal = true;
                        }
                    }

                    this.ast.push(new JavaASTProperty(token.codeContent, propertyIsFinal, propertyAccessModifier));
                    metadata = [];
                    break;
                case JavaLexer.method:
                    // If there is no metadata, it is a method call 
                    if (metadata.length == 0) {
                        const methodArgumentsToken = tokens.shift();

                        if (!methodArgumentsToken) {
                            throw new Error("Method arguments token not found");
                        }

                        this.ast.push(new JavaASTMethodCall(token.codeContent, methodArgumentsToken));
                        metadata = [];
                        continue
                    }

                    // If there is metadata, it is a method declaration
                    let methodAccessModifier = '';
                    let methodIsFinal = false;
                    let methodAnnotations: Token[] = [];

                    for (const item of metadata) {
                        if (item.type === JavaLexer.publicKeyword) {
                            methodAccessModifier = 'public';
                        }
                        
                        if (item.type === JavaLexer.privateKeyword) {
                            methodAccessModifier = 'private';
                        }

                        if (item.type === JavaLexer.protectedKeyword) {
                            methodAccessModifier = 'protected';
                        }

                        if (item.type === JavaLexer.finalKeyword) {
                            methodIsFinal = true;
                        }

                        if (item.type === JavaLexer.annotation) {
                            methodAnnotations.push(item)
                        }
                    }

                    const methodArgumentsToken = tokens.shift();

                    if (!methodArgumentsToken) {
                        throw new Error("Method arguments token not found");
                    }

                    this.ast.push(new JavaASTMethodDeclaration(token.codeContent, methodArgumentsToken, methodIsFinal, methodAccessModifier, methodAnnotations));
                    metadata = [];
                    break;
                case JavaLexer.publicKeyword:
                    metadata.push(token);
                    break;
                case JavaLexer.privateKeyword:
                    metadata.push(token);
                    break;
                case JavaLexer.protectedKeyword:
                    metadata.push(token);
                    break;
                case JavaLexer.finalKeyword:
                    metadata.push(token);
                    break;
                case JavaLexer.annotation:
                    metadata.push(token);
                    break;
                default:
                    throw new Error(`Unknown token: ${token.type}`);
            }
        }

        return this.ast;
    }
}