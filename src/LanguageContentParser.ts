import type { FileInfo } from "@/FileInfo";
import type { ParserStrategy } from "@/ParserStrategy";
import { LanguageDetector } from "@/LanguageDetector";

export class LanguageContentParser {
    protected readonly parserStrategies: Record<string, ParserStrategy> = {};

    constructor(
        protected readonly languageDetector: LanguageDetector,
    ) {
    }

    addParserStrategy(language: string, parserStrategy: ParserStrategy) {
        this.parserStrategies[language] = parserStrategy;
    }

    parse(filepath: string, content: string): FileInfo {
        const language = this.languageDetector.detect(filepath);

        const parserStrategy = this.parserStrategies[language.name];
        if (!parserStrategy) {
            throw new Error(`Unsupported language: ${language}`);
        }

        return parserStrategy.parse(filepath, content);
    }
}
