
import Image from "next/image";
import { SITE } from "@/lib/config";
import BackButton from "@/components/BackButton";

export const metadata = {
    title: "Hakkımızda | Külekçiler Hediyelik",
    description: "Gaziantep merkezli toptan hediyelik ve züccaciye mağazamız hakkında bilgi edinin.",
};

export default function AboutPage() {
    // Placeholder images for the gallery - reusing existing ones for now
    const galleryImages = [
        "/hero-bg-v2.jpg",
        "/hero-bg-v2.jpg",
        "/hero-bg-v2.jpg",
        "/hero-bg-v2.jpg",
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container-custom py-10">
                <BackButton />

                {/* Header / Intro Section */}
                <div className="mx-auto max-w-3xl text-center mt-8 mb-16">
                    <h1 className="text-4xl font-bold text-navy mb-6">Hakkımızda</h1>
                    <p className="text-lg text-slate-700 leading-relaxed">
                        Külekçiler Hediyelik olarak 1992 yılından bu yana Gaziantep'te hizmet vermekteyiz.
                        Züccaciye, mutfak ürünleri, hediyelik eşya ve hırdavat kategorilerinde geniş ürün çeşitliliğimizle
                        bölgenin önde gelen toptan tedarikçilerinden biriyiz. Müşteri memnuniyetini esas alan
                        hizmet anlayışımız ve kaliteli ürün portföyümüzle iş ortaklarımıza değer katmaya devam ediyoruz.
                    </p>
                </div>

                {/* Photo Gallery Section */}
                <div className="mb-20">
                    <h2 className="text-2xl font-semibold text-center mb-8">Mağazamızdan Kareler</h2>
                    {/* Scrollable Container */}
                    <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide">
                        {galleryImages.map((src, index) => (
                            <div
                                key={index}
                                className="relative flex-none w-[80vw] md:w-[600px] h-[400px] rounded-2xl overflow-hidden snap-center shadow-md"
                            >
                                <Image
                                    src={src}
                                    alt={`Mağaza Görseli ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-2">

                    </p>
                </div>

                {/* Map Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-center mb-8">Konumumuz</h2>
                    <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                        <iframe
                            src="https://maps.google.com/maps?width=100%25&height=600&hl=tr&q=Tekstilkent%2C%20%C4%B0brahim%20Tevfik%20Kutlar%20Cd%20NO%3A163D%2C%2027100%20%C5%9Eahinbey%2FGaziantep+(K%C3%BClek%C3%A7iler%20Hediyelik)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="text-center mt-4 text-slate-600">
                        <p>{SITE.address}</p>
                        <p>Tekstilkent, İbrahim Tevfik Kutlar Cd NO:163D, 27100 Şahinbey/Gaziantep</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
