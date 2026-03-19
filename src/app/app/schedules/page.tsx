import { Suspense } from "react";
import SchedulesTable from "@/components/dashboard/SchedulesTable";

export default function SchedulesPage() {
  return (
    <Suspense>
      <SchedulesTable />
    </Suspense>
  );
}
