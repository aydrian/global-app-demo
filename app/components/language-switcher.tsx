import { Form, useLocation, useSubmit } from "@remix-run/react";
import { useLocale } from "remix-i18next";
import { ServerOnly } from "remix-utils";

import { Button } from "~/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select.tsx";
import { cn } from "~/utils/misc.ts";

export function LanguageSwitcher({
  className,
  languages,
  name
}: {
  className?: string;
  languages: { text: string; value: string }[];
  name: string;
}) {
  const locale = useLocale();
  const location = useLocation();
  const submit = useSubmit();

  return (
    <ServerOnly
      fallback={
        <Select
          onValueChange={(lang: string) => {
            submit(
              { lng: lang },
              { action: location.pathname, method: "GET", replace: true }
            );
          }}
          defaultValue={locale}
          name={name}
        >
          <SelectTrigger className={cn("text-black", className)}>
            <SelectValue placeholder="select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(({ text, value }) => (
              <SelectItem key={`s-${value}`} value={value}>
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {() => (
        <Form
          action={location.pathname}
          className={cn("flex gap-1 text-black", className)}
          method="GET"
          replace
        >
          <select
            className="rounded-md px-3 py-2"
            defaultValue={locale}
            name={name}
          >
            {languages.map(({ text, value }) => (
              <option key={`c-${value}`} value={value}>
                {text}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Go
          </Button>
        </Form>
      )}
    </ServerOnly>
  );
}
