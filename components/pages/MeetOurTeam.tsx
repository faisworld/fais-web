import Image from "next/image";

export default function MeetOurTeam() {
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-semibold text-center mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                    <Image
                        src="/images/team-member-1.webp"
                        alt="Eugene Lukyanov"
                        width={128}
                        height={128}
                        className="rounded-full w-32 h-32 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold">Eugene Lukyanov</h3>
                    <p className="text-gray-600">CEO, PhD in Medical Informatics</p>
                </div>
                <div className="text-center">
                    <Image
                        src="/images/team-member-2.webp"
                        alt="Andrii Stehno"
                        width={128}
                        height={128}
                        className="rounded-full w-32 h-32 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold">Andrii Stehno</h3>
                    <p className="text-gray-600">CTO</p>
                </div>
                <div className="text-center">
                    <Image
                        src="/images/team-member-3.webp"
                        alt="Julia Mazura"
                        width={128}
                        height={128}
                        className="rounded-full w-32 h-32 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold">Julia Mazura</h3>
                    <p className="text-gray-600">Web3.0 Expert</p>
                </div>
                <div className="text-center">
                    <Image
                        src="/images/team-member-4.webp"
                        alt="Vitalii Melnyk"
                        width={128}
                        height={128}
                        className="rounded-full w-32 h-32 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold">Vitalii Melnyk</h3>
                    <p className="text-gray-600">Chief Project Manager</p>
                </div>
            </div>
        </div>
    );
}