import { z } from "zod";
import { Analyzer } from "@/Analyzer";
import { LanguageDetector } from "@/LanguageDetector";
import { LanguageContentParser } from "@/LanguageContentParser";
import { McpServer, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CircularDependencyAnalyzer } from "@/Analyzers/CircularDependency/CircularDependencyAnalyzer";
import { HexagonalArchitectureAnalyzer } from "@/Analyzers/HexagonalArchitecture/HexagonalArchitectureAnalyzer";
import { JavaModulesCannotHaveCircularDependency } from "@/Analyzers/CircularDependency/Rules/Java/JavaModulesCannotHaveCircularDependency";
import { JavaDomainUseCaseMustHaveSuffixUseCase } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainUseCaseMustHaveSuffixUseCase";
import { JavaDomainUseCaseMustHaveOnePublicMethod } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainUseCaseMustHaveOnePublicMethod";
import { JavaClassCannotHaveMoreThanThreeDependencies } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaClassCannotHaveMoreThanThreeDependencies";
import { JavaDomainPackageCannotDependsFromInfrastructurePackages } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainPackageCannotDependsFromInfrastructurePackages";
import { JavaParserStrategy } from "@/Parser/JavaParser/JavaParserStrategy";
import { JavaASTParser } from "@/Parser/JavaParser/JavaASTParser";
import { JavaLexicalAnalyzer } from "@/Parser/JavaParser/JavaLexicalAnalyzer";

const server = new McpServer({
        name: "archai-static-analyzer",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {
                hexagonalArchitectureAnalyzer: {
                    description: "Analyze the hexagonal architecture of the code",
                    parameters: {
                        filepath: z.string(),
                    },
                },
                circularDependencyAnalyzer: {
                    description: "Analyze the circular dependency of the code",
                    parameters: {
                        filepath: z.string(),
                    },
                }
            }
        }
    }
);

const analyzerSchema = { 
    projectRoot: z.string(),
    filepath: z.string(), 
}

const javaParserStrategy = new JavaParserStrategy(new JavaASTParser(new JavaLexicalAnalyzer()));

const languageContentParser = new LanguageContentParser(new LanguageDetector());
languageContentParser.addParserStrategy("java", javaParserStrategy);

const hexagonalArchitectureAnalyzer = new HexagonalArchitectureAnalyzer([
    new JavaDomainUseCaseMustHaveOnePublicMethod(),
    new JavaClassCannotHaveMoreThanThreeDependencies(),
    new JavaDomainUseCaseMustHaveSuffixUseCase(),
    new JavaDomainPackageCannotDependsFromInfrastructurePackages(),
]);

const circularDependencyAnalyzer = new CircularDependencyAnalyzer([
    new JavaModulesCannotHaveCircularDependency(languageContentParser, 10),
]);

const analyzer = new Analyzer(languageContentParser);
analyzer.addRuleGroup("hexagonal-architecture", hexagonalArchitectureAnalyzer);
analyzer.addRuleGroup("circular-dependency", circularDependencyAnalyzer);

server.tool("hexagonal-architecture-analyzer", analyzerSchema, async ({ projectRoot, filepath }) => {
    const result = await analyzer.analyze(projectRoot, filepath, "hexagonal-architecture");

    if (result.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: "No issues found",
                },
            ],
        };
    }

    return {
        content: [
            {
                type: "text",
                text: result.join("\n"),
            },
        ],
    };
});

server.tool("circular-dependency-analyzer", analyzerSchema, async ({ projectRoot, filepath }) => {
    const result = await analyzer.analyze(projectRoot, filepath, "circular-dependency");

    if (result.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: "No issues found",
                },
            ],
        };
    }

    return {
        content: [
            {
                type: "text",
                text: result.join("\n"),
            },
        ],
    };
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Archai Static Analyzer MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});