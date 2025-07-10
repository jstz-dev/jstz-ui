import type { Meta, StoryObj } from "@storybook/react-vite";

import { Lock, Mail } from "lucide-react";

import { Button } from "../button";
import { Input, InputGroup } from "../input";
import { Label } from "../label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

const meta = {
  title: "ui/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Displays a form input field or a component that looks like an input field.
 */
export const Primary: Story = {
  args: {
    type: "email",
    placeholder: "Email",
  },
};

export const WithLabel: Story = {
  args: {
    type: "email",
    placeholder: "Email",
  },

  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="email">Email</Label>

      <Input {...args} id="email" />
    </div>
  ),
};

export const File: Story = {
  args: {
    type: "file",
  },

  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">Picture</Label>

      <Input {...args} id="picture" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    type: "email",
    placeholder: "Email",
  },
};

export const WithIcon: Story = {
  args: {
    type: "email",
    placeholder: "Email",
  },

  render: (args) => <Input {...args} id="email" renderIcon={(props) => <Mail {...props} />} />,
};

export const WithButton: Story = {
  args: {
    type: "email",
    placeholder: "Email",
  },

  render: (args) => (
    <Input {...args} id="email" renderButton={(props) => <Button {...props}>Subscribe</Button>} />
  ),
};

export const InAGroup: Story = {
  args: {
    type: "email",
    placeholder: "Email",
  },

  render: (args) => (
    <InputGroup>
      <Input {...args} id="email" renderIcon={(props) => <Mail {...props} />} />

      <Select>
        <SelectTrigger className="w-full rounded-none">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      <Input
        id="confirm-password"
        type="password"
        placeholder="Password"
        renderIcon={(props) => <Lock {...props} />}
      />

      <Input
        id="confirm-password"
        type="password"
        placeholder="Confirm Password"
        renderIcon={(props) => <Lock {...props} />}
      />
    </InputGroup>
  ),
};
