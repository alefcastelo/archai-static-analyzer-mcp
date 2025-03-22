import { Analyzer } from "@/Analyzer";
import { LanguageDetector } from "@/LanguageDetector";
import { LanguageContentParser } from "@/LanguageContentParser";
import { HexagonalArchitectureAnalyzer } from "@/Analyzers/HexagonalArchitecture/HexagonalArchitectureAnalyzer";
import { JavaClassCannotHaveMoreThanThreeDependencies } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaClassCannotHaveMoreThanThreeDependencies";
import { JavaDomainPackageCannotDependsFromInfrastructurePackages } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainPackageCannotDependsFromInfrastructurePackages";
import { JavaDomainUseCaseMustHaveOnePublicMethod } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainUseCaseMustHaveOnePublicMethod";
import { JavaDomainUseCaseMustHaveSuffixUseCase } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainUseCaseMustHaveSuffixUseCase";
import { CircularDependencyAnalyzer } from "@/Analyzers/CircularDependency/CircularDependencyAnalyzer";
import { JavaModulesCannotHaveCircularDependency } from "@/Analyzers/CircularDependency/Rules/Java/JavaModulesCannotHaveCircularDependency";
import { JavaParserStrategy } from "@/Parser/JavaParser/JavaParserStrategy";
import { JavaASTParser } from "@/Parser/JavaParser/JavaASTParser";
import { JavaLexicalAnalyzer } from "@/Parser/JavaParser/JavaLexicalAnalyzer";

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

const directory = "/Users/alefcastelo/workspace/mcp/archai/examples/circular-dependency";
const filepath = "src/com/alefcastelo/account/model/Account.java";

console.log((await analyzer.analyze(directory, filepath, "circular-dependency")).join("\n"));