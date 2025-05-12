// filepath: c:\\Users\\solar\\Projects\\fais-web\\components\\ui\\MediaGenerationWidget.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Button from "./Button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2, AlertCircle } from 'lucide-react';

const imageModels = [
  { id: "minimax/image-01:w4agaakfhnrme0cnbhgtyfmstc", name: "Minimax Image 01" },
  { id: "google/imagen-3-fast:swntzryxznrm80cmvc1aqbnqgg", name: "Google Imagen 3 Fast" },
  { id: "nvidia/sana:c6b5d2b7459910fec94432e9e1203c3cdce92d6db20f714f1355747990b52fa6", name: "Nvidia Sana" },
];

const videoModels = [
  { id: "google/veo-2:tjqhsk4eddrma0cn7w38c91tq8", name: "Google Veo 2" },
  { id: "minimax/video-01-director:654gq25cfxrmc0cmyjev7cz4rg", name: "Minimax Video 01 Director" },
  { id: "minimax/video-01:15eyanar9xrg80ckd3ytdz0hhr", name: "Minimax Video 01" },
];

const MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR = "minimax/video-01-director:654gq25cfxrmc0cmyjev7cz4rg";
const MODEL_ID_MINIMAX_VIDEO_01 = "minimax/video-01:15eyanar9xrg80ckd3ytdz0hhr";

type MediaType = "image" | "video";

interface ApiPayload {
  mediaType: MediaType;
  modelIdentifier: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  duration?: number;
  cameraMovements?: string[];
  imageUrl?: string;
  [key: string]: unknown;
}

export default function MediaGenerationWidget() {
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [selectedImageModel, setSelectedImageModel] = useState<string>('');
  const [selectedVideoModel, setSelectedVideoModel] = useState<string>('');
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [cameraMovementsInput, setCameraMovementsInput] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const aspectRatios = ["16:9", "1:1", "4:3", "3:2", "9:16"];

  useEffect(() => {
    setSelectedImageModel(process.env.NEXT_PUBLIC_DEFAULT_IMAGE_MODEL || imageModels[0].id);
    setSelectedVideoModel(process.env.NEXT_PUBLIC_DEFAULT_VIDEO_MODEL || videoModels[0].id);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResultUrl(null);
    setError(null);

    const modelIdentifier = mediaType === "image" ? selectedImageModel : selectedVideoModel;

    const payload: ApiPayload = {
      mediaType,
      modelIdentifier,
      prompt,
      negativePrompt: negativePrompt || undefined,
    };

    if (mediaType === "image") {
      payload.aspectRatio = aspectRatio;
    } else {
      payload.duration = duration;
      if (selectedVideoModel === MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR && cameraMovementsInput) {
        payload.cameraMovements = cameraMovementsInput.split(',').map(s => s.trim()).filter(s => s);
      }
      if (selectedVideoModel === MODEL_ID_MINIMAX_VIDEO_01 && imageUrlInput) {
        payload.imageUrl = imageUrlInput;
      }
    }

    try {
      const response = await fetch('/api/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to generate ${mediaType}`);
      }

      const data = await response.json();
      setResultUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Generate Media with Replicate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mediaType">Media Type</Label>
          <Select value={mediaType} onValueChange={(value: string) => setMediaType(value as MediaType)}>
            <SelectTrigger id="mediaType">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mediaType === "image" ? (
          <div>
            <Label htmlFor="imageModel">Image Model</Label>
            <Select value={selectedImageModel} onValueChange={setSelectedImageModel}>
              <SelectTrigger id="imageModel">
                <SelectValue placeholder="Select image model" />
              </SelectTrigger>
              <SelectContent>
                {imageModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label htmlFor="videoModel">Video Model</Label>
            <Select value={selectedVideoModel} onValueChange={setSelectedVideoModel}>
              <SelectTrigger id="videoModel">
                <SelectValue placeholder="Select video model" />
              </SelectTrigger>
              <SelectContent>
                {videoModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            placeholder={`Describe the ${mediaType} you want to generate...`}
            required
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="negativePrompt">Negative Prompt (Optional)</Label>
          <Textarea
            id="negativePrompt"
            value={negativePrompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNegativePrompt(e.target.value)}
            placeholder="E.g., blurry, low quality, text, watermark..."
            rows={2}
          />
        </div>

        {mediaType === "image" && (
          <div>
            <Label htmlFor="aspectRatio">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger id="aspectRatio">
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map(ratio => (
                  <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {mediaType === "video" && (
          <>
            <div>
              <Label htmlFor="duration">Duration (seconds, optional)</Label>
              <Input
                type="number"
                id="duration"
                value={duration === undefined ? '' : duration}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDuration(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="E.g., 6"
              />
            </div>

            {selectedVideoModel === MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR && (
              <div>
                <Label htmlFor="cameraMovements">Camera Movements (comma-separated, max 3)</Label>
                <Input
                  id="cameraMovements"
                  value={cameraMovementsInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCameraMovementsInput(e.target.value)}
                  placeholder="E.g., Pan left, Zoom in"
                />
                <p className="text-xs text-gray-500 mt-1">Supported: Truck, Pan, Push, Pull, Pedestal, Tilt, Zoom, Shake, Tracking, Static.</p>
              </div>
            )}

            {selectedVideoModel === MODEL_ID_MINIMAX_VIDEO_01 && (
              <div>
                <Label htmlFor="imageUrl">Image URL (for Image-to-Video)</Label>
                <Input
                  type="url"
                  id="imageUrl"
                  value={imageUrlInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/image.png"
                />
              </div>
            )}
          </>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            `Generate ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      {resultUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated {mediaType}:</h3>
          {mediaType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resultUrl} alt="Generated image" className="rounded-md border shadow-sm max-w-full h-auto" />
          ) : (
            <video src={resultUrl} controls className="rounded-md border shadow-sm max-w-full h-auto">
              Your browser does not support the video tag.
            </video>
          )}
          <p className="text-xs text-gray-500 mt-2 break-all">URL: <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{resultUrl}</a></p>
        </div>
      )}
    </div>
  );
}
