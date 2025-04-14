import { FC, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const VapiWidget: FC = () => {
    const vapiRef = useRef<Vapi | null>(null);
    const [callActive, setCallActive] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;

        console.log("VAPI API Key:", apiKey);

        if (apiKey) {
            try {
                vapiRef.current = new Vapi(apiKey);

                vapiRef.current.on('call-start', () => {
                    console.log("Call started successfully.");
                    setCallActive(true);
                    setLoading(false);
                });

                vapiRef.current.on('call-end', () => {
                    console.log("Call ended successfully.");
                    setCallActive(false);
                    setLoading(false);
                });

                vapiRef.current.on('error', (e) => {
                    console.error("Vapi SDK Error:", e);
                    if (!e || Object.keys(e).length === 0) {
                        console.error("The error object is empty. Please check the SDK configuration or network connectivity.");
                    } else {
                        console.error("Detailed Error:", JSON.stringify(e));
                    }
                    setCallActive(false);
                    setLoading(false);
                });

                // Removed the 'volume-level' event listener

            } catch (error) {
                console.error("Error initializing Vapi SDK:", error);
            }
        } else {
            console.error("VAPI API key is missing. Check environment variables.");
        }
    }, []);

    const handleButtonClick = () => {
        if (callActive) {
            try {
                console.log("Stopping call");
                vapiRef.current?.stop();
            } catch (error) {
                console.error("Error stopping the call:", error);
            }
        } else {
            setLoading(true);
            try {
                console.log("Starting call with configured assistant ID from dashboard");
                const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
                if (assistantId) {
                    vapiRef.current?.start(assistantId);
                } else {
                    console.error("Assistant ID is missing.");
                    setLoading(false);
                }

                vapiRef.current?.send({
                    type: "add-message",
                    message: {
                        role: "system",
                        content: "The user has pressed the button, say peanuts",
                    },
                });
            } catch (error) {
                console.error("Error starting the call:", error);
                setLoading(false);
            }
        }
    };

    return (
        <button
            style={{
                backgroundColor: callActive ? "#dc2626" : loading ? "#f59e0b" : "#0078d4",
                color: "white",
                padding: "10px 20px",
                borderRadius: "50px",
                cursor: "pointer",
                marginRight: "10px",
                transition: "all 0.3s ease",
                transform: loading ? "scale(1.1)" : "scale(1)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            onClick={handleButtonClick}
        >
            {callActive ? "End Call" : loading ? "Connecting..." : "Call AI Assistant"}
        </button>
    );
};

export default VapiWidget;
