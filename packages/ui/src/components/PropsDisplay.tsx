interface PropsDisplayProps {
  componentName: string;
  props: Record<string, unknown>;
}

export function PropsDisplay({ componentName, props }: PropsDisplayProps) {
  const entries = Object.entries(props);

  return (
    <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto text-gray-700">
      {`<${componentName}`}
      {entries.map(([key, value]) => `\n  ${key}={${JSON.stringify(value)}}`)}
      {`\n/>`}
    </pre>
  );
}
