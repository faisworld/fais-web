import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

interface PageData {
    title: string;
    slug: string;
    description?: string;
}

const dataFilePath = path.join(process.cwd(), "app", "admin", "pagesData.json");

function isValidSlug(slug: string): boolean {
    return /^[a-zA-Z0-9-_]+$/.test(slug);
}

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


export async function POST(req: NextRequest) {
    try {
        const reqData = await req.json();
        const { title, slug } = reqData;

        if (!title || !slug || !isValidSlug(slug)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const fileContent = await readFile(dataFilePath, 'utf8');
        const data: PageData[] = JSON.parse(fileContent);

        // Check for duplicate slug
        if (data.some((page) => page.slug === slug)) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }

        // Add new page data
        data.push({ title, slug });

        await writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

        return NextResponse.json({ message: "Page created successfully" });
    } catch (error) {
        console.error("Error creating page:", error);
        return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
    }
}
