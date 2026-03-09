"use client";

import { useContext } from "react";
//mantine
import {
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
} from "@mantine/core";
//pageprops
import { configPageProps } from "../../../templateprops";
//context
import { ContextEditor } from "@/components/layout/editor/editor.context";
//style
import classesTemplate from "../template.module.css";
import classes from "./certificate.module.css";
import { FormHandler } from "@/components/framework/FormHandler";
import dayjs from "dayjs";
import { WodaMissingBanner } from "../../../woda/WodaMissingBanner";
//templateprops

// * DEFINITION

export function TemplateShahabhagiCertificate() {
  const form = FormHandler.useForm();

  // * PRE STATES

  // * STATES

  // * CONTEXT

  const { state, dispatch } = useContext(ContextEditor.Context);
  const { details } = state;

  // * PRELOAD

  // * FUNCTIONS

  // * COMPONENTS

  // * MISC

  const _defaultTextProps = {
    size: "14px",
    lh: ".17in",
    style: {},
  };

  const applicantDetails: any[] = [
    // {
    //   label: "Reference No",
    //   value: "MR/CCI/4597/080/081", // You can update this value accordingly
    //   transform: "uppercase",
    // },
    {
      label: "Name",
      value: form.values?.statement_account_holder,
      transform: "capitalize",
    },
    {
      label: "Address",
      value: form.values?.statement_account_address,
      transform: "capitalize",
    },
    {
      label: "A/C Number",
      value: form.values?.statement_account_no,
      transform: "capitalize",
    },
    {
      label: "Interest Rate",
      value: `${form.values?.statement_interest}%`,
    },
    {
      label: "Account Type",
      value: form.values?.statement_account_type,
      transform: "capitalize",
    },
    {
      label: "Tax Rate",
      value: `${form.values?.statement_tax}%`,
    },
    {
      label: "Currency",
      value: "NPR",
      transform: "capitalize",
    },
    {
      label: "Has Balance of",
      value: "NPR " + form.values?.statement_total_balance, // Update with appropriate value
      transform: "capitalize",
    },

    {
      label: "Has Balance of",
      value:
        "USD " +
        (
          form.values?.statement_balance_total_number /
          form.values?.statement_usdrate
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
  ];

  return (
    <>
            <WodaMissingBanner
        fields={[
          { key: "statement_ref_no", label: "Reference Number" },
          { key: "statement_end_date", label: "End Date" },
          { key: "statement_account_holder", label: "Account Holder Name" },
          { key: "statement_account_address", label: "Account Address" },
          { key: "statement_account_no", label: "Account Number" },
          { key: "statement_account_type", label: "Account Type" },
          { key: "statement_total_balance", label: "Total Balance" },
          { key: "statement_total_balance_words", label: "Balance in Words" },
          { key: "statement_usdrate", label: "USD Exchange Rate" },
          { key: "statement_spokesperson", label: "Spokesperson Name" },
          { key: "statement_spokesperson_post", label: "Spokesperson Post" },
        ]}
      />
      <Paper
        py=".6in"
        px="1in"
        className={classesTemplate.root}
        {...configPageProps}
      >
        <Space h={state?.headerProps?.height + "in" || "1in"} />

        <Text fw={400} {..._defaultTextProps} ta="right">
          Date :{" "}
          {dayjs(form.values?.statement_end_date)
            .add(1, "day")
            .format("YYYY-MM-DD")}
        </Text>

        <Space h=".5in" />

        <Stack gap={4}>
          <Text td="underline" ta="center" fw={800} size={"20px"}>
            BALANCE CERTIFICATE
          </Text>
          <Text mt="xs" td="underline" ta="center" fw={800} size={"20px"}>
            To Whom It May Concern
          </Text>
        </Stack>

        <Space h=".5in" />

        <Text ta="justify" fw={400} {..._defaultTextProps}>
          This is to certify that account holder as mentioned below:
        </Text>

        <Space h=".3in" />

        <table className={classes.table}>
          {applicantDetails?.map((data: any, index: number) => (
            <tr key={index}>
              <td style={{ width: 150, height: 25 }}>
                <Grid>
                  <Grid.Col span={10}>
                    <Text {..._defaultTextProps} fw={600}>
                      {data.label}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Text ta="right" {..._defaultTextProps} fw={700}>
                      :
                    </Text>
                  </Grid.Col>
                </Grid>
              </td>
              <td>
                <Text
                  fw={400}
                  {..._defaultTextProps}
                  tt={data.transform}
                  pl="8px"
                >
                  {data.value}
                </Text>
              </td>
            </tr>
          ))}
        </table>

        <Space h=".3in" />

        <Text ta="justify" fw={400} {..._defaultTextProps}>
          As per todays currency exchange rate of 1 USD equivalent to NPR{" "}
          {form.values?.statement_usdrate?.toFixed(2).toLocaleString("en-US")}
        </Text>

        <Space h=".15in" />

        <Text ta="justify" fw={400} {..._defaultTextProps}>
          This certificate has been issued as per the request of the afore
          stated account holder without any obligation on the part of the
          Organization and its officials.
        </Text>

        <Space h=".8in" />

        <div
          style={{
            display: "block",
            width: "1.2in",
            borderBottom: "2px dotted black",
            marginBottom: ".01in",
          }}
        />

        <Space h=".1in" />

        <Text ta="justify" fw={400} {..._defaultTextProps}>
          {form.values?.statement_spokesperson}
        </Text>
      </Paper>
    </>
  );
}
