import VAPIWidget from "@/components/VapiWidget";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <VAPIWidget />
        </>
    );
}

export default MyApp;