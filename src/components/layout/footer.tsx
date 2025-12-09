
export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-indigo text-indigo-foreground p-4 text-center mt-auto">
            <div className="container mx-auto">
                <p>&copy; {currentYear} SafeHaven. All rights reserved.</p>
            </div>
        </footer>
    );
}
