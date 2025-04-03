import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

interface PageData {
    title: string;
    slug: string;
    description?: string;
}

const dataFilePath = path.join(process.cwd(), "app", "admin", "pagesData.json");

export async function GET(req: NextRequest) {
    try {
        const fileContent = await readFile(dataFilePath, 'utf8');
        const data: PageData[] = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading pages data:", error);
        return NextResponse.json({ error: "Failed to load pages data" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const slug = req.nextUrl.pathname.split('/').pop();

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    try {
        const fileContent = await readFile(dataFilePath, 'utf8');
        let existingData: PageData[] = JSON.parse(fileContent);

        existingData = existingData.filter((page) => page.slug !== slug);

        await writeFile(dataFilePath, JSON.stringify(existingData, null, 2), 'utf8');

        return NextResponse.json({ message: "Page deleted successfully" });
    } catch (error) {
        console.error("Error deleting page:", error);
        return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
    }
}
