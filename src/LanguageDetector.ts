import { Language } from "@/Language";

export class LanguageDetector {
    detect(filename: string): Language {
        const extensionMap = new Map([
            [".ts", "typescript"],
            [".go", "go"], 
            [".php", "php"],
            [".java", "java"]
        ]);

        for (const [ext, lang] of extensionMap) {
            if (filename.endsWith(ext)) {
                return new Language(lang);
            }
        }

        throw new Error(`Unsupported file extension: ${filename}`);
    }
}