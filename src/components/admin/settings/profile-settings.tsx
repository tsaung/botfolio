"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your public profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your Name" defaultValue="Thant Sin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              defaultValue="thantsin@example.com"
              disabled
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Email cannot be changed at this time.
            </p>
          </div>
          <div>
            <Button>Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
