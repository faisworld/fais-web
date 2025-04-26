"use client";

export default function ContactUs() {
    return (
        <section
            className="contact-section flex flex-col items-center text-center py-16 px-6 bg-cover bg-center"
        >
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg mb-6">
                Office: Ukraine, 132 Velyka Vasylkivska Str. Off. 13, Kyiv, 03150
            </p>
            <button className="custom-button">
                Contact Us Now
            </button>
        </section>
    );
}