"use client";

import React, { useEffect, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { Tooltip } from "react-tooltip";

const GithubHeatmap = ({ username }: { username: string }) => {
    const [data, setData] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
            .then((response) => response.json())
            .then((json) => {
                if (json.contributions) {
                    const contributionsWithLevels = json.contributions.map((activity: Activity) => {
                        if (activity.level !== undefined) return activity;

                        let level = 0;
                        if (activity.count > 0) level = 1;
                        if (activity.count > 3) level = 2;
                        if (activity.count > 6) level = 3;
                        if (activity.count > 9) level = 4;

                        return { ...activity, level };
                    });

                    setData(contributionsWithLevels);
                } else {
                    setData([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [username]);

    if (loading) {
        return (
            <div className="w-full h-32 animate-pulse bg-gray-100 flex items-center justify-center">
                <span className="font-bold font-mono opacity-50 capitalize">
                    Loading github activity...
                </span>
            </div>
        );
    }

    if (error || data.length === 0) {
        return (
            <div className="w-full h-32 bg-red-50 flex items-center justify-center">
                <span className="font-bold font-mono text-red-600">
                    Failed to fetch GitHub data
                </span>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <h3 className="w-full text-left font-heading text-2xl uppercase mb-6 border-b-4 border-black pb-2">
                Github Contributions
            </h3>

            <div className="w-full overflow-x-auto pb-4 custom-scrollbar flex justify-center">
                <ActivityCalendar
                    data={data}
                    theme={{
                        light: ["#FFF2C7", "#fdc500", "#fd9d00", "#ff6b00", "#dc0000"],
                        dark: ["#FFF2C7", "#fdc500", "#fd9d00", "#ff6b00", "#dc0000"],
                    }}
                    showWeekdayLabels
                    blockSize={14}
                    blockMargin={4}
                    blockRadius={0}
                    fontSize={14}
                    labels={{
                        totalCount: "{{count}} contributions in the last year",
                    }}
                    renderBlock={(block, activity) =>
                        React.cloneElement(block as React.ReactElement<React.SVGProps<SVGRectElement> & { 'data-tooltip-id'?: string; 'data-tooltip-content'?: string }>, {
                            stroke: "#000",
                            strokeWidth: 1.5,
                            shapeRendering: "crispEdges",
                            "data-tooltip-id": "react-tooltip",
                            "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
                        })
                    }
                />

                <Tooltip id="react-tooltip" />
            </div>
        </div>
    );
};

export default GithubHeatmap;
