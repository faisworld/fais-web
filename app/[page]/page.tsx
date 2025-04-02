import { readFile } from "fs/promises";
import path from "path";
import HeroSection from "@/components/pages/HeroSection";
import SolutionsSection from "@/components/pages/SolutionsSection";
import QuoteSection from "@/components/pages/QuoteSection";

interface Component {
    name: string;
    config: any;
}

interface PageData {
    title: string;
    slug: string;
    components: Component[];
}

export default async function Page({ params }: { params: { page: string } }) {
    const { page } = params || {};
    const dataDir = path.join(process.cwd(), "app", "admin");
    const filePath = path.join(dataDir, "pagesData.json");

    const fileContent = await readFile(filePath, "utf8");
    const pages: PageData[] = JSON.parse(fileContent);
    const pageData = pages.find((p) => p.slug === page);

    if (!pageData) {
        return <div>Page not found</div>;
    }

    return (
        <div>
            <h1>{pageData.title}</h1>
            {pageData.components.map((component, index) => (
                <div key={index}>
                    {component.name === "HeroSection" && (
                        <HeroSection {...component.config} />
                    )}
                    {component.name === "SolutionsSection" && (
                        <SolutionsSection {...component.config} />
                    )}
                    {component.name === "QuoteSection" && (
                        <QuoteSection {...component.config} />
                    )}
                </div>
            ))}
        </div>
    );
}