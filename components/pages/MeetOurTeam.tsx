import Image from 'next/image';

export default function MeetOurTeam() {
    const teamMembers = [
        {
            name: "eugene lukyanov",
            role: "ceo, phd in medical informatics",
            image: "/images/team-member-1.webp"
        },
        {
            name: "andrii stehno",
            role: "cto",
            image: "/images/team-member-2.webp"
        },
        {
            name: "julia mazura",
            role: "web3.0 expert",
            image: "/images/team-member-3.webp"
        },
        {
            name: "vitalii melnyk",
            role: "chief project manager",
            image: "/images/team-member-4.webp"
        }
    ];

    return (
        <div className="mt-16">
            <h2 className="text-3xl font-semibold text-center mb-8 lowercase">meet our team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                    <div className="text-center" key={member.name}>
                        <Image
                            src={member.image}
                            alt={member.name}
                            width={200}
                            height={200}
                            className="rounded-full mx-auto mb-4"
                            style={{ objectFit: "cover" }}
                            priority
                        />
                        <h3 className="text-xl font-bold lowercase">{member.name}</h3>
                        <p className="text-gray-600 lowercase">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}