function ListGroup({ label, items }: { label: string; items?: string[] | null }) {
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <ul className="list-disc pl-6 text-foreground">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListGroup;
