import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import { Scrape } from "../src/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ClientButon from "@/components/ui/ClientButton";
import ClientButton from "@/components/ui/ClientButton";
import { Submit } from "@/components/ui/Submit";
import { ScrapeManager } from "./ScrapeManager";

export async function ChartsList({ scrapes }: { scrapes: Scrape[] }) {
	return (
		<Card className="w-max mx-auto">
			<CardHeader>
				<CardTitle>Data Scrapes</CardTitle>
				<CardDescription>Data so far</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableCaption>A list of all data scrapes.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Service</TableHead>
							<TableHead>Dupe?</TableHead>
							<TableHead className="text-right">Manage</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{scrapes.map((scrape) => {
							const date = new Date(parseInt(scrape.date));
							const formattedDate = format(date, "MMM d, yyyy h:mm a");
							const formattedDateShort = format(date, "MMM d, yyyy");
							const isDuplicate =
								scrapes.filter((s) => {
									const sDate = new Date(parseInt(s.date));
									const sFormattedDate = format(sDate, "MMM d, yyyy");
									return sFormattedDate === formattedDateShort && s.type === scrape.type;
								}).length > 1;
							return (
								<TableRow key={scrape.id}>
									<TableCell className="font-medium">
										<Link href={`/chart/${scrape.id}`}>{formattedDate}</Link>
									</TableCell>
									<TableCell>{scrape.type}</TableCell>
									<TableCell>{isDuplicate ? <Badge>Dupe</Badge> : ""}</TableCell>
									<TableCell className="text-right">
										<ScrapeManager scrape={scrape} />
										<DropdownMenu>
											<DropdownMenuTrigger>Open</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuLabel>
													<Link href="/">View</Link>
												</DropdownMenuLabel>
												<DropdownMenuSeparator />

												<DropdownMenuItem>
													<p>hu</p>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
