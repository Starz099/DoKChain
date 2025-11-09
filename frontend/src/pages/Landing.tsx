import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Share2,
  Upload,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
// WalletModal removed; using wallet-adapter UI
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-documents.jpg";
import DecryptedText from "@/components/DecryptedText";
import {
  WalletConnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import RoleSelectModal from "@/components/RoleSelectModal";
import Prism from '@/components/Prism';
const Landing = () => {
  // wallet modal removed; using wallet-adapter UI buttons
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Lock,
      title: "Secure Storage",
      description:
        "Files encrypted & stored on IPFS/Arweave for permanent, tamper-proof security.",
    },
    {
      icon: CheckCircle,
      title: "Verifiable Credentials",
      description:
        "Authenticity checked on Solana blockchain — trust built into every document.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description:
        "Link your Solana wallet to verify identity and get started.",
    },
    {
      number: "02",
      title: "Upload Document",
      description:
        "Your file is encrypted and stored securely on decentralized storage.",
    },
    {
      number: "03",
      title: "Verify On-Chain",
      description:
        "Document hash recorded on Solana for permanent verification.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen flex justify-start">
        <div className="absolute inset-0 gradient-soft opacity-50" />
        <div className="absolute inset-0 glow-soft" />

        {/* Prism as hero background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Prism
            animationType="3drotate"
            timeScale={0.6}
            height={3.5}
            baseWidth={5.5}
            scale={1.6}
            hueShift={0.1}
            colorFrequency={1}
            noise={0.35}
            glow={1}
            suspendWhenOffscreen={true}
          />
        </div>

        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="w-full md:w-1/2 mx-auto h-full flex justify-center items-center">
            <div className="space-y-8 animate-fade-in-up flex items-center flex-col text-center">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Powered by Solana
              </div>
              {/* <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Own and Verify Your Digital Documents — <span className="text-gradient">Forever</span>
              </h1> */}
              <DecryptedText
                text="Own and Verify Your Digital Documents — Forever"
                speed={50}
                animateOn="view"
                parentClassName="w-screen text-center"
                className="text-5xl md:text-8xl font-bold leading-tight -z-1"
                encryptedClassName="text-5xl md:text-8xl font-bold leading-tight opacity-80"
              />

              <p className="text-xl text-muted-foreground">
                A decentralized document locker built on Solana — tamper-proof,
                transparent, and user-controlled.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  onClick={() => setRoleModalOpen(true)}
                >
                  Launch App
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Dokchain?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Blockchain-powered credential management that puts you in control
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2 border-border"
              >
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to secure, verified credentials
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* horizontal connector for md+ screens (behind the icons) */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-primary to-accent z-0" />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 text-center relative z-10">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-black text-2xl font-bold shadow-lg glow-primary z-10">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Build trust into every credential
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of document verification powered by Solana
          </p>
          <Button
            size="lg"
            className="gradient-primary text-lg px-8 glow-primary"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
      <RoleSelectModal open={roleModalOpen} onOpenChange={setRoleModalOpen} />
    </div>
  );
};

export default Landing;
