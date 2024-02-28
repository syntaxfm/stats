import type { Metadata } from "next";
import "./globals.css";

import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Podcast Stats",
	description: "good ",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${GeistMono.variable} ${GeistMono.variable}`}>
			<body className="font-mono dark">
				<div className="container mx-auto">{children}</div>
				<Toaster expand={true} />
			</body>
		</html>
	);
}

export const runtime = "edge";
export const dynamic = "force-dynamic";
