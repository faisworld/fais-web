import { FC, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import CallButton from "@/components/ui/CallButton";

const VapiWidget: FC = () => {
    const vapiRef = useRef<Vapi | null>(null);
    const [callActive, setCallActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // Placeholder for speaking state

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

                    if (e?.error?.msg === "Exiting meeting because room was deleted") {
                        alert("The meeting has ended.");
                    }
                });

            } catch (error) {
                console.error("Error initializing Vapi SDK:", error);
            }
        } else {
            console.error("VAPI API key is missing. Check environment variables.");
        }

        return () => {
            vapiRef.current?.off("error", (e) => {
                console.error("Vapi SDK Error:", e);
                if (!e || Object.keys(e).length === 0) {
                    console.error("The error object is empty. Please check the SDK configuration or network connectivity.");
                } else {
                    console.error("Detailed Error:", JSON.stringify(e));
                }
                setCallActive(false);
                setLoading(false);

                if (e?.error?.msg === "Exiting meeting because room was deleted") {
                    alert("The meeting has ended.");
                }
            });
        };
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
        <div className="flex flex-col items-center">
            <CallButton
                isCalling={callActive}
                isSpeaking={isSpeaking}
                onClick={handleButtonClick}
                disabled={loading}
            >
                {loading
                    ? "Connecting..."
                    : callActive
                        ? "Stop Call"
                        : undefined}
            </CallButton>
        </div>
    );
};

export default VapiWidget;
