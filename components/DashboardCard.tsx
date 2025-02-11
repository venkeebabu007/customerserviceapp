import Link from "next/link"

export const DashboardCard = ({ title, count, link }: { title: string; count: number; link: string }) => {
  return (
    <Link href={link} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{count}</p>
      {title === "Resolved Tickets" && <p className="text-sm text-gray-500 mt-1">Total resolved</p>}
    </Link>
  )
}

