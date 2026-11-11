import { Link2 } from "lucide-react";
import AvatarUploader from "@/components/profile/AvatarUploader";
import ProfileDetailsForm from "@/components/profile/ProfileDetailsForm";
import SessionsCard from "@/components/profile/SessionsCard";
import TwoFactorCard from "@/components/profile/TwoFactorCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/context/AuthContext";
import { Provider } from "@/lib/enums";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <PageLoader />;
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="blue" className="-rotate-2">
            Your profile
          </Badge>
          <h1 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
            {user?.username ?? "You"}
          </h1>
        </div>

        <Button to="/share" variant="primary" size="sm">
          <Link2 size={15} /> My link
        </Button>
      </div>

      <div className="mt-7 flex flex-col gap-5">
        <Card tone="white" className="p-6">
          <AvatarUploader />
        </Card>

        <Card tone="white" className="p-6">
          <h2 className="text-xl font-black tracking-tight">Details</h2>
          <div className="mt-5">
            <ProfileDetailsForm />
          </div>
        </Card>

        {user?.provider === Provider.SYSTEM && <TwoFactorCard />}

        <SessionsCard />
      </div>
    </section>
  );
}
