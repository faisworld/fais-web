import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects | Fantastic AI Studio",
  description: "Explore our portfolio of AI and blockchain projects.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
