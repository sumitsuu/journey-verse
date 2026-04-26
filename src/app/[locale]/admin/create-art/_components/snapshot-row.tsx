type SnapshotRowProps = {
  label: string;
  value: string;
};

export const SnapshotRow = ({ label, value }: SnapshotRowProps) => {
  return (
    <div className={"flex items-center justify-between gap-4 rounded-md bg-background/70 px-3 py-2"}>
      <span className={"text-muted-foreground"}>{label}</span>
      <span className={"max-w-[180px] truncate text-right font-semibold text-white"}>{value}</span>
    </div>
  );
};
