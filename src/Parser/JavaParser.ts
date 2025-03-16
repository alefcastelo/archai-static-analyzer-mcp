import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { JavaAST } from "@/Parser/JavaAST/JavaAST";
import type { JavaASTClass } from "@/Parser/JavaAST/ASTNode/JavaASTClass";
import type { JavaASTPackage } from "@/Parser/JavaAST/ASTNode/JavaASTPackage";
import type { JavaASTImport } from "@/Parser/JavaAST/ASTNode/JavaASTImport";
import type { JavaASTProperty } from "@/Parser/JavaAST/ASTNode/JavaASTProperty";
import type { JavaASTMethodDeclaration } from "@/Parser/JavaAST/ASTNode/JavaASTMethodDeclaration";
import type { JavaASTMethodCall } from "./JavaAST/ASTNode/JavaASTMethodCall";

export class JavaParser {
    constructor(
        public readonly astParser: JavaAST
    ) {}

    parse(content: string): FileInfo {
        const ast = this.astParser.parse(content);

        let className: JavaASTClass;
        let packageName: JavaASTPackage;
        const dependencies: JavaASTImport[] = [];
        const properties: JavaASTProperty[] = [];
        const methods: JavaASTMethodDeclaration[] = [];
        const methodCalls: JavaASTMethodCall[] = [];
        for (const node of ast) {
            if (node.type === 'class') {
                const classNode = node as JavaASTClass;
                className = classNode
            }

            if (node.type === 'package') {
                const packageNode = node as JavaASTPackage;
                packageName = packageNode
            }

            if (node.type === 'import') {
                const importNode = node as JavaASTImport;
                dependencies.push(importNode);
            }

            if (node.type === 'property') {
                const propertyNode = node as JavaASTProperty;
                properties.push(propertyNode);
            }

            if (node.type === 'methodDeclaration') {
                const methodNode = node as JavaASTMethodDeclaration;
                methods.push(methodNode);
            }

            if (node.type === 'methodCall') {
                const methodCallNode = node as JavaASTMethodCall;
                methodCalls.push(methodCallNode);
            }
        }

        return new JavaFileInfo(
            className!,
            packageName!,
            dependencies!,
            methods!,
            properties!,
            methodCalls!,
        );
    }
}
