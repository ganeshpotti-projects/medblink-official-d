export function entityUpdater(prev, entity, eventType, key = "id") {
  switch (eventType) {
    case "CREATED":
      return prev.some((e) => e[key] === entity[key])
        ? prev
        : [...prev, entity];
    case "UPDATED":
      return prev.map((e) => (e[key] === entity[key] ? entity : e));
    case "DELETED":
      return prev.filter((e) => e[key] !== entity[key]);
    default:
      return prev;
  }
}
