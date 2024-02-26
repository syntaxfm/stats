import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartedRankings } from "@/components/ChartRankings";
import { db } from "@/db/db";
import { format } from "date-fns";
import Link from "next/link";

export const runtime = "edge";

export default async function ChartPage({ params }: { params: { id: string } }) {
	const scrape = await db.query.scrapes.findFirst({
		where: (scrape, { eq }) => eq(scrape.id, parseInt(params.id)),
		with: {
			scrapeItems: true,
		},
	});
	if (!scrape) return <div>Scrape not found</div>;
	const [next, prev] = await Promise.all([
		db.query.scrapes.findMany({
			where: ({ id, date }, { gt }) => gt(date, scrape.date),
			orderBy: (scrape, { asc }) => asc(scrape.date),
			limit: 2,
		}),
		db.query.scrapes.findMany({
			where: ({ date }, { lt }) => lt(date, scrape.date),
			orderBy: (scrape, { desc }) => desc(scrape.date),
			limit: 2,
		}),
	]);

	if (!scrape) return <div>Scrape not found</div>;
	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>
						Data Rankings <Badge variant="outline">{scrape?.type}</Badge>
					</CardTitle>
					<CardDescription>Scraped {format(new Date(parseInt(scrape.date)), "MMM d, yyyy h:mm a")}</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartedRankings scrape={scrape}></ChartedRankings>
				</CardContent>
			</Card>
			<menu className="flex place-content-around p-10">
				<div className="flex flex-row">
					<Button asChild variant="outline">
						<Link href={`/chart/${prev[0]?.id}`}>← Prev {prev[0]?.type}</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href={`/chart/${prev[1]?.id}`}>← Prev {prev[1]?.type}</Link>
					</Button>
				</div>
				<div className="flex flex-row">
					<Button asChild variant="outline">
						<Link href={`/chart/${next[0]?.id}`}>Next {next[0]?.type} →</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href={`/chart/${next[1]?.id}`}>Next {next[1]?.type} →</Link>
					</Button>
				</div>
			</menu>
		</div>
	);
}
