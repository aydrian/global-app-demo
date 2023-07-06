import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Global App Demo" },
    { content: "A global app using CockroachDB and Fly", name: "description" }
  ];
};

export default function Index() {
  return <h1>Global App Demo</h1>;
}
