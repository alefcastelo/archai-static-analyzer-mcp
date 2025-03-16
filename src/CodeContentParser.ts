import type { FileInfo } from "@/FileInfo";
import { LanguageDetector } from "@/LanguageDetector";
import { JavaParser } from "@/Parser/JavaParser";
import { JavaAST } from "@/Parser/JavaAST/JavaAST";
import { JavaLexer } from "@/Parser/JavaAST/JavaLexer";

export class CodeContentParser {
    protected readonly javaParser: JavaParser;

    constructor(
        protected readonly languageDetector: LanguageDetector,
    ) {
        this.javaParser = new JavaParser(new JavaAST(new JavaLexer()));
    }

    parse(filename: string, content: string): FileInfo {
        const language = this.languageDetector.detect(filename);

        if (language.isJava()) {
            return this.javaParser.parse(content);
        }

        throw new Error(`Unsupported language: ${language}`);
    }
}
