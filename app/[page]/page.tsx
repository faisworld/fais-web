import path from "path";
import fs from "fs/promises";

export default async function Page({ params }: { params: { page: string } }) {
    // Properly await params before destructuring
    const resolvedParams = await Promise.resolve(params);
    const page = resolvedParams.page;
    
    const dataDir = path.join(process.cwd(), "app", "admin");
    const filePath = path.join(dataDir, "pagesData.json");

    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        const pageData = data[page] || { content: "Page not found" };

        return (
            <div>
                <h1>{pageData.title || page}</h1>
                <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </div>
        );
    } catch (error) {
        console.error("Error reading or parsing data:", error);
        return <div>Error loading page</div>;
    }
}