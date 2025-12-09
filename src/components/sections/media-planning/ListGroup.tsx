function ListGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <ul className="list-disc pl-6 text-gray-800">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListGroup;
