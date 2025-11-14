import Navbar from '../components/Navbar'

export default function MainLayout({ children, wide = false }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className={wide ? "w-full px-4 py-6" : "max-w-6xl mx-auto px-4 py-6"}>
                {children}
            </main>
        </div>
    )
}

