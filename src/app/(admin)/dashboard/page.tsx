
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to AutoFolio Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the protected area for managing your portfolio.</p>
        </CardContent>
      </Card>
    </div>
  );
}
