import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { GlobalStateProvider } from "./providers/GlobalStateProvider.jsx";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <NextUIProvider>
                <QueryClientProvider client={queryClient}>
                    <RecoilRoot>
                        <GlobalStateProvider>
                            <App />
                        </GlobalStateProvider>
                    </RecoilRoot>
                </QueryClientProvider>
            </NextUIProvider>
        </BrowserRouter>
    </StrictMode>
);
