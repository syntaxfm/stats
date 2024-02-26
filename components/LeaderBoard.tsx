import { GroupedData } from "@/app/page";
import { getShowBySlug } from "../src/shows";

export function Leaderboard({ data }: { data: GroupedData }) {
	return (
		<div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
			{data.map((item) => (
				<LeaderBoardItem key={item.id} item={item} />
			))}
		</div>
	);
}

function LeaderBoardItem({ item }: { item: GroupedData[0] }) {
	const show = getShowBySlug(item.id);
	const rank = item.data.at(-1).rank;
	const change = item.data.at(-1).change;
	return (
		<div>
			<img src={show.art} alt={show?.showName} className="max-w-full" />

			<span className="center text-xs bg-green-500 text-white p-1 rounded-sm">
				{rank ? `#${rank}` : "🕳️"}
				{/* <span className="p-1 bg-dark">{change > 0 : `↑${change}` : change === 0}</span> */}
			</span>
			{item.average ? (
				<span className="center text-xs bg-yellow-500 text-white p-1 rounded-sm">ø{item.average}</span>
			) : (
				""
			)}
		</div>
	);
}
