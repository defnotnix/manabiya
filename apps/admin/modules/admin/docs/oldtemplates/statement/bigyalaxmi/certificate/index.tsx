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
import dayjs from "dayjs";
import { FormHandler } from "@/components/framework/FormHandler";
import { monthNames } from "@/const/monthnames";
import { getDaySuffix } from "@/components/helper/getDaySuffix";
import { WodaMissingBanner } from "../../../woda/WodaMissingBanner";
//templateprops

export function TemplateBigyalaxmiCertificate() {
  // * DEFINITION
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
    size: "15px",
    lh: ".17in",
  };

  const applicantDetails: any[] = [
    {
      label: "Name",
      value: form.values?.statement_account_holder,
      enableBold: true,
    },
    {
      label: "Address",
      value: form.values?.statement_account_address,
      enableBold: true,
    },
    {
      label: "A/c No",
      value: form.values?.statement_account_no,
    },
    {
      label: "A/c Type",
      value: form.values?.statement_account_type,
    },

    {
      label: "Interest",
      value: `${form.values?.statement_interest}%`,
    },
    {
      label: "Tax Rate",
      value: `${form.values?.statement_tax}%`,
    },
    {
      label: "Currency",
      value: "NPR",
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
      <Paper p="1in" className={classesTemplate.root} {...configPageProps}>
        <Space h={state?.headerProps?.height + "in" || "1in"} />

        <Group justify="space-between">
          <Text {..._defaultTextProps}>
            <b>Ref. No.</b> : {form.values?.statement_ref_no}
          </Text>

          <Text {..._defaultTextProps}>
            <b>Date</b> :{" "}
            {dayjs(form.values?.statement_end_date)
              .add(1, "day")
              .format("YYYY/MM/DD")}
          </Text>
        </Group>

        <Space h="1in" />

        <Text
          {..._defaultTextProps}
          size="24px"
          lh=".3in"
          ta="center"
          fw={700}
          mb="xs"
        >
          <u> BALANCE CERTIFICATE</u>
        </Text>
        <Text {..._defaultTextProps} size="22px" lh=".3in" ta="center" fw={700}>
          To Whom It May Concern
        </Text>

        <Space h=".3in" />

        <Text {..._defaultTextProps} lh=".2in">
          This is to certify that the account holder has maintained the
          following details:
        </Text>

        <Space h=".3in" />

        <table className={classes.table}>
          {applicantDetails?.map((data: any, index: number) => (
            <tr key={index}>
              <td>
                <Text ta="left" {..._defaultTextProps} w={200}>
                  {data.label}
                </Text>
              </td>
              <td>
                <Text ta="left" {..._defaultTextProps} w={40}>
                  :
                </Text>
              </td>
              <td
                style={{
                  paddingBottom: ".25in",
                }}
              >
                <Text
                  w={300}
                  fw={data.enableBold && 600}
                  {..._defaultTextProps}
                >
                  {data.value}
                </Text>
              </td>
            </tr>
          ))}
        </table>

        <Space h=".1in" />

        <Text {..._defaultTextProps} lh=".2in" ta="justify">
          The balance in this account is {" "}
          <b>
            NPR {form.values?.statement_total_balance} (
            {form.values?.statement_total_balance_words})
          </b>{" "}
          which is equivalent to{" "}
          <b>
            US${" "}
            {Number(
              (
                Number(form.values?.statement_balance_total_number) /
                form.values?.statement_usdrate
              )?.toFixed(2)
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </b>{" "}
          at prevailing exchange rate of{" "}
          <b>
            NPR{" "}
            {form.values?.statement_usdrate
              ?.toFixed(2)
              .toLocaleString("en-US")
              .toLocaleString("en-US")}
          </b>{" "}
          per US$.
        </Text>

        <Space h=".1in" />

        <Text {..._defaultTextProps} lh=".2in" ta="justify">
          This information has been furnished without any financial engagement
          of liability on the part of company or its officer whose signature
          appears below.
        </Text>

        <Space h="1in" />

        <Stack gap={0}>
          <div
            style={{
              width: 150,
              display: "block",

              borderBottom: "2px dotted black",
              marginBottom: ".01in",
            }}
          />

          <Text {..._defaultTextProps} ta="left" mt=".1in" fw={700}>
            {form.values?.statement_spokesperson}
          </Text>
          <Text {..._defaultTextProps} ta="left" fw={700}>
            {form.values?.statement_spokesperson_post}
          </Text>
        </Stack>
      </Paper>
    </>
  );
}
