// filepath: app/api/save-page/route.ts
import { writeFile, readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const dataDir = path.join(process.cwd());
        const filePath = path.join(dataDir, 'pagesData.json');

        const reqData = await req.json();
        const { title, components } = reqData;

        const fileContent = await readFile(filePath, 'utf8');
        const existingData = JSON.parse(fileContent);

        existingData.push({ title, components });

        await writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8');

        return NextResponse.json({ message: 'Page saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving page:', error);
        return NextResponse.json({ message: 'Error saving page' }, { status: 500 });
    }
}