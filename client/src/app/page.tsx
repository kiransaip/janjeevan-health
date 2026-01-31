import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <div className="py-20 text-center text-4xl font-bold bg-blue-50 text-blue-900">
                Features Section Coming Soon...
            </div>
            <Footer />
        </main>
    );
}
