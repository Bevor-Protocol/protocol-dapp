export const navItems = {
  main: [
    {
      url: "/leaderboard",
      text: "leaderboard",
    },
    {
      url: "/audits",
      text: "audits",
    },
    {
      url: "/messaging",
      text: "messaging",
    },
  ],
  dropdown: [
    {
      url: "/dao",
      text: "Governance",
    },
    {
      url: "https://docs.bevor.io",
      text: "Documentation",
    },
  ],
};

export const stats = [
  {
    text: "audits conducted",
    stat: 100,
  },
  {
    text: "unique vulnerabilites uncovered",
    stat: 1_000,
  },
  {
    text: "processed funds",
    stat: 10_000,
    symbol: "$",
  },
  {
    text: "registered auditors",
    stat: 50,
  },
];

export const leaderboard = [
  {
    name: "user 1",
    money: 100,
    active: 2,
    completed: 1,
    available: false,
  },
  {
    name: "user 2",
    money: 200,
    active: 1,
    completed: 0,
    available: false,
  },
  {
    name: "user 3",
    money: 400,
    active: 2,
    completed: 3,
    available: true,
  },
  {
    name: "user 4",
    money: 10_000,
    active: 0,
    completed: 1,
    available: false,
  },
  {
    name: "user 5 has a really long name and should cut off",
    money: 50,
    active: 2,
    completed: 2,
    available: true,
  },
  {
    name: "user 1",
    money: 100,
    active: 2,
    completed: 1,
    available: false,
  },
  {
    name: "user 2",
    money: 200,
    active: 1,
    completed: 0,
    available: false,
  },
  {
    name: "user 3",
    money: 400,
    active: 2,
    completed: 3,
    available: true,
  },
  {
    name: "user 4",
    money: 100,
    active: 0,
    completed: 1,
    available: false,
  },
  {
    name: "user 5 has a really long name and should cut off",
    money: 50,
    active: 2,
    completed: 2,
    available: true,
  },
  {
    name: "user 1",
    money: 100,
    active: 2,
    completed: 1,
    available: false,
  },
  {
    name: "user 2",
    money: 200,
    active: 1,
    completed: 0,
    available: false,
  },
  {
    name: "user 3",
    money: 400,
    active: 2,
    completed: 3,
    available: true,
  },
  {
    name: "user 4",
    money: 100,
    active: 0,
    completed: 1,
    available: false,
  },
  {
    name: "user 5 has a really long name and should cut off",
    money: 50,
    active: 2,
    completed: 2,
    available: true,
  },
];

export const audits = [
  {
    auditee: "Protocol 1",
    auditors: ["user 1", "user 2"],
    money: 10_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "open",
  },
  {
    auditee: "Protocol 2",
    auditors: [],
    money: 20_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "soon",
  },
  {
    auditee: "Protocol 3",
    auditors: ["user 2", "user 3"],
    money: 10_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "open",
  },
  {
    auditee: "Protocol 4",
    auditors: ["user 1", "user 2"],
    money: 100,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "closed",
  },
  {
    auditee: "Protocol 5",
    auditors: [],
    money: 50_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "soon",
  },
  {
    auditee: "Protocol 6",
    auditors: ["user 1", "user 2", "user 3"],
    money: 2_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "closed",
  },
];
