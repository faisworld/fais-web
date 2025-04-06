import { writeFile, readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

interface PageData {
    title: string;
    slug: string;
    description?: string;
}

const dataFilePath = path.join(process.cwd(), "app", "admin", "pagesData.json");

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;

    try {
        const fileContent = await readFile(dataFilePath, "utf8");
        const data: PageData[] = JSON.parse(fileContent);

        const page = data.find((page) => page.slug === slug);
        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error("Error reading page data:", error);
        return NextResponse.json({ error: "Failed to load page data" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;

    try {
        const reqData = await req.json();
        const fileContent = await readFile(dataFilePath, "utf8");
        const data: PageData[] = JSON.parse(fileContent);

        const pageIndex = data.findIndex((page) => page.slug === slug);
        if (pageIndex === -1) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        // Update the page data
        data[pageIndex] = { ...data[pageIndex], ...reqData };

        await writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");

        return NextResponse.json({ message: "Page updated successfully" });
    } catch (error) {
        console.error("Error updating page:", error);
        return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
    }
}