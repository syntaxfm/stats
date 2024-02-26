"use client";
import { GroupedData } from "@/app/page";
import { ResponsiveBump } from "@nivo/bump";
import { getShowBySlug, showsToWatch } from "../src/shows";

export type DataItem = {
	id: string;
	data: {
		x: number;
		y: number;
	};
};

export function BumpChart({ data }: { data: GroupedData }) {
	// Generate Colors from showsToWatch
	const colors = data.map((line) => {
		const show = getShowBySlug(line.id);
		return show?.color || "black";
	});

	return (
		<ResponsiveBump
			data={data}
			colors={colors}
			// Labels
			// Design
			lineWidth={3}
			activeLineWidth={6}
			inactiveLineWidth={3}
			inactiveOpacity={0.5}
			pointSize={10}
			pointComponent={({ point, ...what }) => {
				return (
					<g
						transform={`translate(${point.x}, ${point.y})`}
						style={{
							pointerEvents: "none",
							fontSize: 10,
							// fontWeight: "bold",
						}}
					>
						<circle
							x={point.size * -0.5}
							y={point.size * -0.5}
							r={point.size}
							fill="black"
							stroke={point.borderColor}
							strokeWidth={2}
						/>
						{point.data.index === 1 && (
							<image href={getShowBySlug(point.data.slug)?.art} x={-40} y={-20} width={40} height={40} />
						)}

						<text textAnchor="middle" y={4} fill="white">
							{point.data.y}
						</text>
					</g>
				);
			}}
			activePointSize={16}
			inactivePointSize={0}
			theme={{
				axis: {
					ticks: {
						text: {
							fill: "#efefef",
						},
					},
				},
				grid: {
					line: {
						strokeWidth: 1,
						stroke: "rgba(255,255,255,0.1)",
					},
				},
			}}
			pointColor={{ theme: "background" }}
			pointBorderWidth={3}
			activePointBorderWidth={3}
			pointBorderColor={{ from: "serie.color" }}
			endLabel={({ id }) => getShowBySlug(id)?.showName}
			startLabel={({ id, data, average }) => {
				return `x̄${average}`;
			}}
			startLabelPadding={20}
			axisTop={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: "Apple Podcasts",
				legendPosition: "middle",
				legendOffset: -25,
			}}
			axisBottom={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: "",
				legendPosition: "middle",
				legendOffset: 32,
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 10,
				tickRotation: 0,

				format: (value) => {
					if (value % 5 === 0) return value;
					return "";
				},
				legend: "ranking",
				legendPosition: "middle",
				legendOffset: -40,
			}}
			tooltip={(datum) => {
				const show = getShowBySlug(datum.serie.id);
				return (
					<div
						className="border-2 border-gray-200 rounded-lg p-2"
						style={{
							background: "white",
							padding: 10,
							color: datum.serie.color,
						}}
					>
						<img width="100" src={show?.art} alt={show?.showName} />
						<p>{show?.showName}</p>
						<strong>Avg: {datum.serie.data.average}</strong>
					</div>
				);
			}}
			margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
		/>
	);
}
