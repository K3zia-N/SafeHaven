
export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-brand-purple text-brand-purple-foreground p-4 text-center mt-auto">
            <div className="container mx-auto">
                <p>&copy; {currentYear} SafeHaven. All rights reserved.</p>
            </div>
        </footer>
    );
}
