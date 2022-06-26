import React from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { SearchIcon } from "@heroicons/react/outline";

function Widgets() {
  return (
    <div className="col-span-2 hidden lg:inline">
      <div className="flex items-center space-x-2 rounded-full bg-gray-100 p-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none"
          placeholder="Search Twitter"
        />
      </div>

      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="danaharliansyah"
        options={{ height: 1000 }}
      />
    </div>
  );
}

export default Widgets;
