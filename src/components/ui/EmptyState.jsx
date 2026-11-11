import Card from "./Card";

export default function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <Card tone="white" className="flex flex-col items-center p-10 text-center">
      {Icon && (
        <span className="border-3 border-ink bg-psst-amber p-3 shadow-brutal-sm">
          <Icon size={26} />
        </span>
      )}
      <h3 className="mt-5 text-2xl font-black tracking-tight">{title}</h3>
      {body && (
        <p className="mt-2 max-w-sm text-sm font-medium text-ink/65">{body}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
