import { BumpChart } from "@/components/BumpChart";
import { ChartedRankings } from "@/components/ChartRankings";
import { ChartsList } from "@/components/ChartsList";
import { Leaderboard } from "@/components/LeaderBoard";
import { db } from "@/db/db";
import { getCachedScrapes, getScrapes } from "@/db/queries";
import { scrapeItem } from "@/src/schema";
import { showsToWatch, slugs } from "@/src/shows";
import { format } from "date-fns";
import groupBy from "object.groupby";

export type GroupedData = {
	id: string;
	average: number;
	data: {
		slug: string;
		rank: number | null;
		scrapeId: number;
		date: string;
		id?: number | undefined;
		type?: "itunes" | "spotify" | undefined;
		showName?: string | null | undefined;
		change: number | null;
		x: string;
		y: number | null;
		index: number;
	}[];
}[];

async function getGroupedStandings() {
	const scrapeItems = await db.query.scrapeItem.findMany({
		where: (scrapeItem, { inArray, and, eq }) => and(inArray(scrapeItem.slug, slugs), eq(scrapeItem.type, "spotify")),
	});

	const scrapes = await db.query.scrapes.findMany({
		orderBy: (scrape, { asc }) => asc(scrape.date),
		where: (scrape, { eq }) => eq(scrape.type, "spotify"),
		with: {
			scrapeItems: {
				where: (scrapeItem, { inArray }) => inArray(scrapeItem.slug, slugs),
			},
		},
	});

	// Now we make slots for each tracked slug, for each scrape
	const slugSlots = scrapes.map(({ scrapeItems, ...scrape }) => {
		const date = new Date(parseInt(scrape.date));
		const formattedDate = format(date, "MMM d");
		const slot = {
			// ...scrape,
			date: formattedDate,
			slots: showsToWatch.map((showToWatch) => {
				const slug = scrape.type === "itunes" ? showToWatch.slug : showToWatch.showUri;
				const scrapeItem = scrapeItems.find((scrapeItem) => scrapeItem.slug === slug);
				const rank = scrapeItem ? scrapeItem.rank : null;
				return {
					...scrapeItem,
					slug,
					rank,
					scrapeId: scrape.id,
					date: formattedDate,
				};
			}),
			// scrapeItems: scrape.scrapeItems,
		};
		return slot;
	});
	// console.log(slugSlots);
	// Group by scrapeId
	// Flat Map them into a single array
	const flatSlots = slugSlots.flatMap(({ slots }) => slots);
	const groups = groupBy(flatSlots, (item) => item.slug);
	const grouped = Object.entries(groups)
		.map(([slug, items]) => {
			const average = Math.round(
				items.reduce((acc, item) => acc + (item.rank || 0), 0) / items.filter((item) => item.rank).length,
			);
			return {
				id: slug,
				average,
				data: items.map((item, index, arr) => {
					const lastRank = arr[index - 1]?.rank;
					return {
						x: item.date,
						y: item.rank,
						index,
						change: lastRank && item.rank ? item.rank - lastRank : null,
						...item,
					};
				}),
			};
		})
		.sort((a, b) => a.average - b.average);
	return grouped;
}

export default async function Home() {
	const scrapes = await getScrapes();
	const grouped = await getGroupedStandings();
	return (
		<main>
			<h2>Leaderboard</h2>
			<Leaderboard data={grouped} />
			<h2>Bump Chart</h2>
			<div className="h-screen">
				<BumpChart data={grouped} />
			</div>
			<h2>Data Scrapes</h2>
			<ChartsList scrapes={scrapes} />
			{/* <ChartedRankings scrape={scrape}  /> */}
		</main>
	);
}

export const runtime = "edge";
export const dynamic = "force-dynamic";
