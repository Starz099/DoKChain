import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";
// Wallet adapter UI default styles
import "@solana/wallet-adapter-react-ui/styles.css";

createRoot(document.getElementById("root")!).render(<App />);
