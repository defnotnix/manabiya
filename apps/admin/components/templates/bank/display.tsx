import { Stack, Center, Text } from "@mantine/core";
import type { BankStatementData } from "@/context/DocumentContext";
import { ContextEditor } from "@/components/layout/editor/editor.context";
import { FormHandler } from "@/components/framework/FormHandler";

// Import all bank statement templates
import { TemplateBigyalaxmiStatement } from "./bigyalaxmi/statement";
import { TemplateSumnimaStatement } from "./sumnima/statement";
import { TemplateMataBageshworiStatement } from "./mataBageshwori/statement";
import { TemplateNarayanStatement } from "./narayan/statement";
import { TemplateHimchuliStatement } from "./himchuli/statement";
import { TemplateVyasStatement } from "./vyas/statement";
import { TemplateBirendranagarStatement } from "./birendranagar/statement";
import { TemplateKarnaliStatement } from "./karnali/statement";
import { TemplateJanautthanStatement } from "./janautthan/statement";
import { TemplateTribeniStatement } from "./tribeni/statement";
import { TemplateShahabhagiStatement } from "./shahabhagi/statement";

const bankStatementMap: Record<string, React.ComponentType<any>> = {
  bigyalaxmi: TemplateBigyalaxmiStatement,
  sumnima: TemplateSumnimaStatement,
  mataBageshwori: TemplateMataBageshworiStatement,
  narayan: TemplateNarayanStatement,
  himchuli: TemplateHimchuliStatement,
  vyas: TemplateVyasStatement,
  birendranagar: TemplateBirendranagarStatement,
  karnali: TemplateKarnaliStatement,
  janautthan: TemplateJanautthanStatement,
  tribeni: TemplateTribeniStatement,
  shahabhagi: TemplateShahabhagiStatement,
};

export function BankStatementDisplayTemplate({ data, bankKey: propBankKey }: { data: BankStatementData | null; bankKey?: string }) {
  // Determine which bank template to render - use prop first, then fallback to data
  const bankKey = propBankKey || data?.bank_template || data?.bank;
  if (!bankKey) {
    return (
      <Center py="xl">
        <Text size="sm" c="dimmed">Bank information not available</Text>
      </Center>
    );
  }

  const StatementComponent = bankStatementMap[bankKey];
  if (!StatementComponent) {
    return (
      <Center py="xl">
        <Text size="sm" c="dimmed">Template not available for {bankKey}</Text>
      </Center>
    );
  }

  // Render the bank-specific statement template with context providers
  // Even if data is null, render the template with empty/default values
  return (
    <ContextEditor.Provider>
      <FormHandler.Provider values={data || {}}>
        <Stack gap={0}>
          <StatementComponent />
        </Stack>
      </FormHandler.Provider>
    </ContextEditor.Provider>
  );
}
