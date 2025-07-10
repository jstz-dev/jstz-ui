import type { Meta, StoryObj } from "@storybook/react-vite";

import { ArrowRight, Download, Loader2, type LucideProps, Mail, Share } from "lucide-react";
import { cn } from "~/lib/utils";

import { Button } from "../button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "ui/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    renderIcon: {
      control: {
        type: "select",
      },
      options: ["Mail", "Share", "Download"],
      mapping: {
        Mail: (props: LucideProps) => <Mail {...props} />,
        Share: (props: LucideProps) => <Share {...props} />,
        Download: (props: LucideProps) => <Download {...props} />,
      },
    },
  },
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

/**
 * The primary button style used to guide users forward in a flow. Use only once per flow.
 */
export const Primary: Story = {
  args: {
    children: "Button",
  },
};

/**
 * The secondary button styled used more frequently for secondary actions.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const Icon: Story = {
  args: {
    size: "icon",
    variant: "outline",
    children: <ArrowRight />,
  },
};

export const IconSquare: Story = {
  args: {
    size: "icon_square",
    variant: "outline",
    children: <ArrowRight />,
  },
};

export const WithIcon: Story = {
  args: {
    renderIcon: (props) => <Mail {...props} />,
    children: "Login with email",
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#">Login</a>,
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    iconPosition: "left",
    renderIcon: (props) => <Loader2 {...props} className={cn(props.className, "animate-spin")} />,
    children: "Please wait",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Button",
  },
};
