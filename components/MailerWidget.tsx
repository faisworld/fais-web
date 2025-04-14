import { FC, useState, useEffect } from "react";

function RecaptchaComponent() {
    useEffect(() => {
        const loadRecaptcha = () => {
            grecaptcha.enterprise.ready(() => {
                grecaptcha.enterprise.execute('6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z', { action: 'LOGIN' })
                    .then((token) => {
                        console.log('Token:', token);
                        // Send the token to the backend
                    })
                    .catch((error) => {
                        console.error('Error executing reCAPTCHA:', error);
                    });
            });
        };

        if (typeof grecaptcha !== 'undefined') {
            loadRecaptcha();
        } else {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/enterprise.js';
            script.async = true;
            script.defer = true;
            script.onload = loadRecaptcha;
            document.body.appendChild(script);
        }
    }, []);

    return null;
}

const MailerWidget: FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setStatus("loading");
        setErrorMessage("");

        // Check if grecaptcha is loaded
        if (typeof grecaptcha === "undefined" || !grecaptcha.enterprise) {
            setStatus("error");
            setErrorMessage("reCAPTCHA is not ready. Please refresh the page and try again.");
            return;
        }

        try {
            // Generate reCAPTCHA token
            const token = await new Promise<string>((resolve, reject) => {
                grecaptcha.enterprise.ready(async () => {
                    try {
                        const token = await grecaptcha.enterprise.execute(
                            '6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z', 
                            { action: 'submit' }
                        );
                        resolve(token);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            console.log("Generated reCAPTCHA token:", token.substring(0, 20) + "...");

            // Send form data and token to API
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    message, 
                    token, // Using the correct parameter name expected by the backend
                    recaptchaAction: 'submit' 
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus("success");
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setStatus("error");
                setErrorMessage(result.message || "Failed to send message. Please try again.");
                console.error("API Error:", result);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setStatus("error");
            setErrorMessage("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="mb-16">
            <form onSubmit={handleSubmit} className="mailer-widget max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                {status === "success" && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                        Your message has been sent successfully! We&apos;ll get back to you soon.
                    </div>
                )}
                
                {status === "error" && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {errorMessage}
                    </div>
                )}
                
                <div className="mb-4">
                    <input
                        type="text"
                        id="contact-name"
                        name="contact-name"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={status === "loading"}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="name"
                    />
                </div>
                
                <div className="mb-4">
                    <input
                        type="email"
                        id="contact-email"
                        name="contact-email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === "loading"}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="email"
                    />
                </div>
                
                <div className="mb-4">
                    <textarea
                        id="contact-message"
                        name="contact-message"
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={status === "loading"}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                    />
                </div>
                
                <button
                    type="submit"
                    id="contact-submit"
                    name="contact-submit"
                    disabled={status === "loading"}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {status === "loading" ? "Sending..." : "Send Message"}
                </button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                    This form is protected by reCAPTCHA Enterprise to ensure you&apos;re not a bot.
                </div>
            </form>
        </div>
    );
};

export default MailerWidget;
export { RecaptchaComponent };