import {
  type LoaderArgs,
  type V2_MetaFunction,
  redirect
} from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Global App Demo" },
    { content: "A global app using CockroachDB and Fly", name: "description" }
  ];
};

export async function loader({ request }: LoaderArgs) {
  return redirect("/products/us");
}

export default function Index() {
  return <h1>Global App Demo</h1>;
}
