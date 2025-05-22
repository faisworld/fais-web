import Link from "next/link";
import { PhotoIcon, FilmIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

interface MediaToolButtonsProps {
  activeType?: "all" | "image" | "video" | "text";
}

export default function MediaToolButtons({ activeType = "all" }: MediaToolButtonsProps) {
  return (
    <div className="media-tool-filters flex flex-wrap gap-3 my-4">
      <Link href="/admin/tools" 
            className={`media-filter-btn ${activeType === "all" ? "active" : ""}`}>
        <span>All Tools</span>
      </Link>
      
      <Link href="/admin/tools/image" 
            className={`media-filter-btn ${activeType === "image" ? "active" : ""}`}>
        <PhotoIcon className="w-5 h-5 mr-2" />
        <span>Image Tools</span>
      </Link>
      
      <Link href="/admin/tools/video" 
            className={`media-filter-btn ${activeType === "video" ? "active" : ""}`}>
        <FilmIcon className="w-5 h-5 mr-2" />
        <span>Video Tools</span>
      </Link>
      
      <Link href="/admin/tools/text" 
            className={`media-filter-btn ${activeType === "text" ? "active" : ""}`}>
        <DocumentTextIcon className="w-5 h-5 mr-2" />
        <span>Text Tools</span>
      </Link>
    </div>
  );
}
