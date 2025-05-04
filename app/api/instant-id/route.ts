import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { image, prompt } = await req.json();
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
  });

  try {
    const output = await replicate.run(
      "zsxkib/instant-id:2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
      {
        input: {
          image,
          width: 640,
          height: 640,
          prompt,
          sdxl_weights: "protovision-xl-high-fidel",
          guidance_scale: 5,
          negative_prompt: "(lowres, low quality, worst quality:1.2), (text:1.2), watermark, painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured",
          ip_adapter_scale: 0.8,
          num_inference_steps: 30,
          disable_safety_checker: false,
          controlnet_conditioning_scale: 0.8,
        }
      }
    );

    // output is usually an array of URLs
    const imageUrl = Array.isArray(output) ? output[0] : output;
    const res = await fetch(imageUrl);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to /tmp or /public (for dev, /tmp is safer)
    const filename = `instantid_${Date.now()}.webp`;
    const filePath = path.join(process.cwd(), "public", filename);
    await writeFile(filePath, buffer);

    // Return the local path (for serving via /public)
    return NextResponse.json({ output: `/` + filename, remote: imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
