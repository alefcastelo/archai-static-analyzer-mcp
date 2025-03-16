import type { FileInfo } from "@/FileInfo";
import type { JavaASTImport } from "@/Parser/JavaAST/ASTNode/JavaASTImport";
import type { JavaASTMethodDeclaration } from "@/Parser/JavaAST/ASTNode/JavaASTMethodDeclaration";
import type { JavaASTPackage } from "@/Parser/JavaAST/ASTNode/JavaASTPackage";
import type { JavaASTProperty } from "@/Parser/JavaAST/ASTNode/JavaASTProperty";
import type { JavaASTClass } from "@/Parser/JavaAST/ASTNode/JavaASTClass";
import type { JavaASTMethodCall } from "@/Parser/JavaAST/ASTNode/JavaASTMethodCall";

export class JavaFileInfo implements FileInfo {
    constructor(
        public readonly className: JavaASTClass,
        public readonly packageName: JavaASTPackage,
        public readonly dependencies: JavaASTImport[],
        public readonly methodDeclarations: JavaASTMethodDeclaration[],
        public readonly properties: JavaASTProperty[],
        public readonly methodCalls: JavaASTMethodCall[]
    ) {
    }

    isJava(): boolean {
        return true;
    }

    isPhp(): boolean {
        return false;
    }

    isGo(): boolean {
        return false;
    }

    isTypescript(): boolean {
        return false;
    }
}