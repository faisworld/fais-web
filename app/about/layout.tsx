export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="about-layout">
            <header></header>
            <main>{children}</main>
            <footer>About Footer</footer>
        </div>
    );
}
