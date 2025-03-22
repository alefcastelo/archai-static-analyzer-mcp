import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { JavaASTParser } from "@/Parser/JavaParser/JavaASTParser";

export class JavaParserStrategy {
    constructor(
        public readonly astParser: JavaASTParser
    ) {}

    parse(filepath: string, content: string): FileInfo {
        const ast = this.astParser.parse(content);

        return new JavaFileInfo(
            filepath,
            ast,
        );
    }
}
