import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";
import { Input } from "../input";
import { Label } from "../label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * A set of layered sections of content -- known as tab panels -- that are displayed one at a time.
 */
const meta = {
  title: "ui/Tabs",
  component: Tabs,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
    backgrounds: {
      default: "dark",
      options: {
        light: { name: "Light", value: "#fff" },
        dark: { name: "Dark", value: "#121212" },
      },
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    className: "w-[400px]",
    defaultValue: "account",
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    children: [
      <TabsList key={Date.now()} className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>

        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>,

      <TabsContent key="account" value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>

            <CardDescription>
              Make changes to your account here. Click save when you are done.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>

              <Input id="name" defaultValue="Example" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>

              <Input id="username" defaultValue="example" />
            </div>
          </CardContent>

          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>,

      <TabsContent key="password" value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>

            <CardDescription>
              Change your password here. After saving, you will be logged out.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>

              <Input id="current" type="password" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>

              <Input id="new" type="password" />
            </div>
          </CardContent>

          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>,
    ],
  },
};

export const Simple: Story = {
  args: {
    children: [
      <TabsList key={Date.now()} className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>,

      <TabsContent key="account" value="account">
        Make changes to your account here.
      </TabsContent>,

      <TabsContent key="password" value="password">
        Change your password here.
      </TabsContent>,
    ],
  },
};
