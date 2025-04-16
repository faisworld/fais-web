import Image from "next/image";

export default function SolutionCard({ title, description, image }: { title: string; description: string; image: string }) {
    return (
        <div className="solution-card w-1/2 p-4">
            <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
            <Image src={image} alt={title} width={600} height={400} className="mx-auto object-contain" />
            <p className="mt-4 text-center">{description}</p>
        </div>
    );
}
