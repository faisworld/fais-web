import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: NextRequest) {
  const { image, prompt } = await req.json();
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
  });

  try {
    const output = await replicate.run(
      "zsxkib/instant-id:latest",
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
    return NextResponse.json({ output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
