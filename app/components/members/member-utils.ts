export interface Member {
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: string;
  avatar?: string;
}

export const membersData: Member[] = [
  {
    name: "Darlene Robertson",
    email: "darlenerobertson@gmail.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    totalOrders: 15,
    totalSpent: "$12,500.00",
  },
  {
    name: "Jane Cooper",
    email: "janecooper@gmail.com",
    phone: "(555) 987-6543",
    location: "Los Angeles, CA",
    totalOrders: 20,
    totalSpent: "$8,000.00",
  },
  {
    name: "Jenny Wilson",
    email: "jennywilson@gmail.com",
    phone: "(555) 555-1234",
    location: "New York, NY",
    totalOrders: 15,
    totalSpent: "$600.00",
  },
  {
    name: "Robert Fox",
    email: "robertfox@gmail.com",
    phone: "(555) 234-5678",
    location: "Chicago, IL",
    totalOrders: 10,
    totalSpent: "$4,500.00",
  },
  {
    name: "Wade Warren",
    email: "wadewarren@gmail.com",
    phone: "(555) 345-6789",
    location: "Miami, FL",
    totalOrders: 8,
    totalSpent: "$3,200.00",
  },
  {
    name: "Albert Flores",
    email: "albertflores@gmail.com",
    phone: "(555) 456-7890",
    location: "Boston, MA",
    totalOrders: 12,
    totalSpent: "$7,800.00",
  },
  {
    name: "Eleanor Pena",
    email: "eleanorpena@gmail.com",
    phone: "(555) 567-8901",
    location: "Dallas, TX",
    totalOrders: 5,
    totalSpent: "$2,500.00",
  },
  {
    name: "Ronald Richards",
    email: "ronaldrichards@gmail.com",
    phone: "(555) 678-9012",
    location: "Seattle, WA",
    totalOrders: 18,
    totalSpent: "$10,000.00",
  },
  {
    name: "Darrell Steward",
    email: "darrellsteward@gmail.com",
    phone: "(555) 789-0123",
    location: "Denver, CO",
    totalOrders: 7,
    totalSpent: "$3,500.00",
  },
  {
    name: "Cameron Williamson",
    email: "cameronwilli@gmail.com",
    phone: "(555) 890-1234",
    location: "Las Vegas, NV",
    totalOrders: 9,
    totalSpent: "$4,000.00",
  },
];
