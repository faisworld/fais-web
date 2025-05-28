import Image from 'next/image';
import { getBlobImage } from "@/utils/media-utils";

export default function MeetOurTeam() {
    const teamMembers = [
        {
            name: "yevhen lukyanov",
            role: "ceo, phd in medical informatics",
            image: getBlobImage("about-team-member-yevhen-lukyanov-image")
        },
        {
            name: "arik vigas",
            role: "CTO, expert developer",
            image: getBlobImage("about-team-member-arik-vigas-image")
        },
        {
            name: "andrii stehno",
            role: "blockchain developer expert",
            image: getBlobImage("about-team-member-andrii-stehno-image")
        },

        {
            name: "vitalii melnyk",
            role: "chief project manager",
            image: getBlobImage("about-team-member-vitalii-melnyk-image")
        }
    ];

    return (
        <div className="mt-24 mb-24">
            <h2 className="text-3xl font-semibold text-center mb-16 lowercase relative after:content-[''] after:absolute after:w-16 after:h-[3px] after:bg-gradient-to-r after:from-neutral-300 after:to-neutral-500 after:bottom-[-12px] after:left-1/2 after:transform after:-translate-x-1/2">
                meet our team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {teamMembers.map((member) => (
                    <div 
                        className="group relative transition-all duration-300 rounded-md bg-white"
                        key={member.name}
                        style={{ boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-md -z-10 transform group-hover:scale-[1.02] transition-transform duration-300 ease-out" 
                        style={{ boxShadow: "0 15px 35px -10px rgba(0,0,0,0.1)" }}></div>
                        
                        <div className="aspect-square overflow-hidden relative border-b border-neutral-100">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                priority
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold lowercase">{member.name}</h3>
                            <p className="text-neutral-500 text-sm lowercase mt-1">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}