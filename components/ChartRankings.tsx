import { format } from "date-fns";
import { Scrape, ScrapeItem, ScrapeWithItems } from "../src/types";
import { ShowtoWatch, getShowBySlug, showsToWatch, slugs } from "../src/shows";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function ChartedRankings({ scrape }: { scrape: ScrapeWithItems }) {
	const shows = scrape.scrapeItems.filter((show) => slugs.includes(show.slug));
	const date = new Date(parseInt(scrape.date));
	const formattedDate = format(date, "MMM d, yyyy h:mm a");
	const chartedSlugs = shows.map((show) => show.slug);
	// Find the shows not on the charts
	const notOnChart: ShowtoWatch[] = showsToWatch.filter((show) => {
		// See if this shows slug in in the list of charted show
		return !chartedSlugs.includes(scrape.type === "spotify" ? show.showUri : show.slug);
	});
	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Rank</TableHead>
						<TableHead>Change</TableHead>
						<TableHead>Art</TableHead>
						<TableHead>Podcast</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{shows.map(Row)}
					{notOnChart.map(UnchartedRow)}
				</TableBody>
			</Table>
		</div>
	);
}

function Row(show: ScrapeItem) {
	const change = show.change && show.change > 0 ? "↑" : show.change ? "↓" : "·";
	const changeClass =
		show.change && show.change > 0 ? "text-green-500" : show.change ? "text-red-500" : "text-grey-500";
	return (
		<TableRow key={show.slug}>
			<TableCell>
				<img width="50" src={getShowBySlug(show.slug)?.art} alt={`Podcast art for ${show.showName}`} />
			</TableCell>
			<TableCell>{show.rank ? show.rank : <Badge variant="outline">Not Charted</Badge>}</TableCell>
			<TableCell>
				<span className={changeClass}>
					{change}
					{show.change ? Math.abs(show.change) : ""}
				</span>
			</TableCell>
			<TableCell>{show.showName}</TableCell>
		</TableRow>
	);
}

function UnchartedRow(show: ShowtoWatch) {
	return (
		<TableRow key={show.slug}>
			<TableCell>
				<img width="50" src={getShowBySlug(show.slug)?.art} alt={`Podcast art for ${show.showName}`} />
			</TableCell>
			<TableCell>
				<Badge variant="outline">Not Charted</Badge>
			</TableCell>
			<TableCell>{""}</TableCell>
			<TableCell>{show.showName}</TableCell>
		</TableRow>
	);
}
