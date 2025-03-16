import { HexagonalArchitectureAnalyzer } from "@/Analyzers/HexagonalArchitecture/HexagonalArchitectureAnalyzer";
import { JavaClassCannotHaveMoreThanThreeDependencies } from "@/Analyzers/HexagonalArchitecture/Rules/Java/ClassCannotHaveMoreThanThreeDependencies";
import { JavaDomainPackageCannotDependsFromInfrastructurePackages } from "@/Analyzers/HexagonalArchitecture/Rules/Java/DomainPackageCannotDependsFromInfrastructurePackages";
import { JavaDomainUseCaseMustHaveOnePublicMethod } from "@/Analyzers/HexagonalArchitecture/Rules/Java/DomainUseCaseMustHaveOnePublicMethod";
import { JavaDomainUseCaseMustHaveSuffixUseCase } from "@/Analyzers/HexagonalArchitecture/Rules/Java/DomainUseCaseMustHaveSuffixUseCase";
import { JavaModelHasEmailAsPrimitiveType } from "@/Analyzers/HexagonalArchitecture/Rules/Java/ModelHasEmailAsPrimitiveType";
import { JavaNonUserModelHasEmail } from "@/Analyzers/HexagonalArchitecture/Rules/Java/NonUserModelHasEmail";
import { Analyzer } from "@/Analyzer";
import { LanguageDetector } from "@/LanguageDetector";
import { CodeContentParser } from "@/CodeContentParser";
import { McpServer, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "archai-static-analyzer",
    version: "1.0.0",
});

server.tool("hexagonal-architectural-analyzer", { filename: z.string(), content: z.string() }, async ({ filename, content}) => {
    const parser = new CodeContentParser(new LanguageDetector());
    const fileInfo = parser.parse(filename, content);

    const hexagonalArchitectureStyle = new HexagonalArchitectureAnalyzer([
        new JavaDomainUseCaseMustHaveOnePublicMethod(),
        new JavaClassCannotHaveMoreThanThreeDependencies(),
        new JavaDomainUseCaseMustHaveSuffixUseCase(),
        new JavaDomainPackageCannotDependsFromInfrastructurePackages(),
        new JavaModelHasEmailAsPrimitiveType(),
        new JavaNonUserModelHasEmail(),
    ]);

    const architecturalStyleCheck = new Analyzer(hexagonalArchitectureStyle);

    return {
        content: [
            {
                type: "text",
                text: architecturalStyleCheck.check(fileInfo).join(","),
            },
        ],
    };
});

const transport = new StdioServerTransport();
server.connect(transport);