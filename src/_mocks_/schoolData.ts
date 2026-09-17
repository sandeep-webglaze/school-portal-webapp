export interface SchoolCategory {
  title: string;
  items: SchoolItem[];
}

export interface SchoolItem {
  name: string;
  url: string;
}

export const schoolCategories: SchoolCategory[] = [
  //   {
  //     title: "Best Schools In Popular Cities",
  //     items: [
  //       { name: "Best Schools in Dehradun", url: "#" },
  //       { name: "Best Schools in Mumbai", url: "#" },
  //       { name: "Best Schools in Delhi", url: "#" },
  //       { name: "Best Schools in Bangalore", url: "#" },
  //       { name: "Best Schools in India", url: "#" },
  //       { name: "Best Schools in Pune", url: "#" },
  //       { name: "Best Schools in Hyderabad", url: "#" },
  //       { name: "Best Schools in Kolkata", url: "#" },
  //       { name: "Best Schools in Shimla", url: "#" },
  //       { name: "Best Schools in Mussoorie", url: "#" },
  //     ],
  //   },
  //   {
  //     title: "Best International Schools In Popular Cities",
  //     items: [
  //       { name: "Best International Schools in Dehradun", url: "#" },
  //       { name: "Best International Schools in Mumbai", url: "#" },
  //       { name: "Best International Schools in Delhi", url: "#" },
  //       { name: "Best International Schools in Bangalore", url: "#" },
  //       { name: "Best International Schools in India", url: "#" },
  //       { name: "Best International Schools in Pune", url: "#" },
  //       { name: "Best International Schools in Hyderabad", url: "#" },
  //       { name: "Best International Schools in Kolkata", url: "#" },
  //       { name: "Best International Schools in Shimla", url: "#" },
  //       { name: "Best International Schools in Mussoorie", url: "#" },
  //     ],
  //   },
  {
    title: "Best Boarding Schools ",
    items: [
      {
        name: "Best Boarding Schools in Bangalore",
        // Backend slug is "bangalore", not "bengaluru". Day Schools has a
        // "bengaluru" variant that works; Boarding Schools does not —
        // /search/boarding-schools-in-bengaluru returns 404.
        url: "/search/boarding-schools-in-bangalore",
      },
      {
        name: "Best Boarding Schools in Chennai",
        url: "/search/boarding-schools-in-chennai",
      },
      {
        name: "Best Boarding Schools in Hyderabad",
        url: "/search/boarding-schools-in-hyderabad",
      },
      {
        name: "Best Boarding Schools in Dehradun",
        url: "/search/boarding-schools-in-dehradun",
      },
      {
        name: "Best Boarding Schools in India",
        url: "/search/boarding-schools-in-india",
      },
      {
        name: "Best Boarding Schools in Kolkata",
        url: "/search/boarding-schools-in-kolkata",
      },
      {
        name: "Best Boarding Schools in Lucknow",
        url: "/search/boarding-schools-in-lucknow",
      },
      {
        name: "Best Boarding Schools in Mumbai",
        url: "/search/boarding-schools-in-mumbai",
      },
      {
        name: "Best Boarding Schools in Pune",
        url: "/search/boarding-schools-in-pune",
      },

      {
        name: "Best Boarding Schools in Shimla",
        url: "/search/boarding-schools-in-shimla",
      },
    ],
  },
  {
    title: "Best  Schools",
    items: [
      {
        name: "Best Boys Schools In India",
        url: "/search/boys-schools",
      },
      {
        name: "Best CBSE Schools In India",
        url: "/search/cbse-schools",
      },
      {
        name: "Best Co-ed Schools In India",
        url: "/search/coed-schools",
      },
      {
        name: "Best Day Schools In India",
        url: "/search/day-schools",
      },
      {
        name: "Best Girls Schools In India",
        url: "/search/girls-schools",
      },
      {
        name: "Best ICSE Schools In India",
        url: "/search/icse-isc-schools",
      },
    ],
  },
  {
    title: "Best Day  Schools",
    items: [
      {
        name: "Best Day Schools In Bangalore",
        url: "/search/day-schools-in-bengaluru",
      },
      {
        name: "Best Day Schools In Chennai",
        url: "/search/day-schools-in-chennai",
      },
      {
        name: "Best Day Schools In Hyderabad",
        url: "/search/day-schools-in-hyderabad",
      },
      {
        name: "Best Day Schools In India",
        url: "/search/day-schools",
      },
      {
        name: "Best Day Schools In Kolkata",
        url: "/search/day-schools-in-kolkata",
      },
      {
        name: "Best Day Schools In Lucknow",
        url: "/search/day-schools-in-lucknow",
      },
      {
        name: "Best Day Schools In Mumbai",
        url: "/search/day-schools-in-mumbai",
      },
      {
        name: "Best Day Schools In Pune",
        url: "/search/day-schools-in-pune",
      },
      {
        name: "Best Day Schools In Shimla",
        url: "/search/day-schools-in-shimla",
      },
    ],
  },
];

export const additionalSchoolData = {
  bestSchools: [
    {
      name: "Best Boys Schools In India",
      url: "/search/boys-schools",
    },
    {
      name: "Best CBSE Schools In India",
      url: "/search/cbse-schools",
    },
    {
      name: "Best Co-ed Schools In India",
      url: "/search/coed-schools",
    },
    {
      name: "Best Day Schools In India",
      url: "/search/day-schools",
    },
    {
      name: "Best Girls Schools In India",
      url: "/search/girls-schools",
    },
    {
      name: "Best ICSE Schools In India",
      url: "/search/icse-schools",
    },
  ],
  bestDaySchools: [
    {
      name: "Best Day Schools In Bangalore",
      url: "/search/day-schools-in-bengaluru",
    },
    {
      name: "Best Day Schools In Chennai",
      url: "/search/day-schools-in-chennai",
    },
    {
      name: "Best Day Schools In Hyderabad",
      url: "/search/day-schools-in-hyderabad",
    },
    {
      name: "Best Day Schools In India",
      url: "/search/day-schools",
    },
    {
      name: "Best Day Schools In Kolkata",
      url: "/search/day-schools-in-kolkata",
    },
    {
      name: "Best Day Schools In Lucknow",
      url: "/search/day-schools-in-lucknow",
    },
    {
      name: "Best Day Schools In Mumbai",
      url: "/search/day-schools-in-mumbai",
    },
    {
      name: "Best Day Schools In Pune",
      url: "/search/day-schools-in-pune",
    },
    {
      name: "Best Day Schools In Shimla",
      url: "/search/day-schools-in-shimla",
    },
  ],
};
