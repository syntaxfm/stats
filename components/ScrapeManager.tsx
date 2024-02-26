"use client";
import { Scrape } from "../src/types";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ServerActionResponse, deleteScrape } from "../actions/deleteScrape";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ServerAction = (formData: FormData) => Promise<string>;
type ServerActionWithState = (state: unknown, formData: FormData) => Promise<string>;

export function ScrapeManager({ scrape }: { scrape: Scrape }) {
	const [formState, deleteAction] = useFormState(deleteScrape, {} as ServerActionResponse);
	useEffect(() => {
		if (formState.success) {
			toast.success(formState.message, {
				id: scrape.id.toString(),
			});
		}
	}, [formState, scrape.id]);

	return (
		<div>
			<form action={deleteAction}>
				<input type="hidden" name="id" value={scrape.id} />
				<Submit type="submit">Delete</Submit>
			</form>
		</div>
	);
}

export function Submit({ children, ...props }: ServerProps<"button">) {
	const status = useFormStatus();
	useEffect(() => {
		if (status.data && status.pending) {
			toast.loading(`Deleting Scrape: ${status.data.get("id")}`, {
				id: status.data.get("id")?.toString(),
			});
		}
	}, [status]);
	return (
		<Button {...props} disabled={status.pending}>
			{children}
		</Button>
	);
}
