import { useNavigate, useParams } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { ContainerContent } from "@/components/container";

import { NotificationCard } from "./notification-card";

export function NotificationList({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof ContainerContent>) {
  const { organization } = useParams({ from: "/_app/$organization" });
  const navigate = useNavigate();
  return (
    <ContainerContent
      className={cn("p-0.5", className)}
      onClick={() => {
        navigate({
          to: "/$organization/inbox",
          params: {
            organization,
          },
        });
      }}
      {...props}
    >
      <NotificationCard />
    </ContainerContent>
  );
}
