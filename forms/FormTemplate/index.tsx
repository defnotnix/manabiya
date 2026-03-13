"use client";

import React, { useEffect, useState } from "react";
//mantine
import {
  Box,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
//context
import { FormHandler } from "@/components/framework/FormHandler";

//dates
import moment from "moment";
import { configTemplateInfo } from "@/components/templates";
import { useParams, usePathname } from "next/navigation";

//@ts-ignore , Dates

export function FormTemplate() {
  // * DEFINITIONS

  const form = FormHandler.useForm();

  const Params = useParams();
  const Pathname = usePathname();

  // * CONTEXTS

  const {
    current,
    handleSubmit,
    steps,
    stepClickable,
    initialStep,
    handleStepBack,
    handleStepNext,
  } = FormHandler.usePropContext();

  // * STATES

  // * PRELOADS

  // * FUNCTIONS

  // * COMPONENTS

  useEffect(() => {
    const setinfo = Pathname.includes("/editor/woda/")
      ? configTemplateInfo[0]
      : configTemplateInfo[1];

    if (!form.values.setinfo) {
      form.setFieldValue("setinfo", {
        ...setinfo,
        allItems: setinfo?.items,
        items: setinfo?.items
          ?.filter((item: any) => {
            return !item.disablePreSelect;
          })
          .map((item: any) => {
            return item.value;
          }),
      });
    }
  }, []);

  return (
    <>
      <Container size="lg">
        <Paper withBorder px="md" py="lg">
          <Stack gap="xs">
            <Text size="xs" fw={600} tt="uppercase" mb="sm">
              Document Sets
            </Text>

            <Radio.Group
              value={form.values?.setinfo?.value}
              onChange={(e) => {
                const setinfo = configTemplateInfo.filter((item) => {
                  return item.value == e;
                })[0];

                form.setFieldValue("setinfo", {
                  ...setinfo,
                  allItems: setinfo?.items,
                  items: setinfo?.items
                    ?.filter((item: any) => {
                      return !item.disablePreSelect;
                    })
                    .map((item: any) => {
                      return item.value;
                    }),
                });
              }}
            >
              <SimpleGrid cols={4} spacing="xs">
                {configTemplateInfo
                  .filter((item, index) => {
                    if (Params.type == "woda") {
                      return index <= 0;
                    } else {
                      return index > 0;
                    }
                  })
                  .map((setinfo: any, index: number) => {
                    return (
                      <Radio.Card
                        disabled={setinfo.disable}
                        radius="md"
                        value={setinfo.value}
                        key={index}
                        p="sm"
                      >
                        <Group wrap="nowrap" align="center">
                          <Radio.Indicator
                            disabled={setinfo.disable}
                            size="xs"
                          />
                          <div>
                            <Text size="xs">{setinfo.group}</Text>
                          </div>
                        </Group>
                      </Radio.Card>
                    );
                  })}
              </SimpleGrid>
            </Radio.Group>

            <Divider my="lg" />

            <Text size="xs" fw={600} tt="uppercase" mb="sm">
              Available Template Documents
            </Text>

            <Checkbox.Group
              value={form.values?.setinfo?.items}
              onChange={(e: string[]) => {
                form.setFieldValue("setinfo", {
                  ...form.values.setinfo,
                  items: e,
                });
              }}
            >
              <SimpleGrid cols={4} spacing="xs">
                {form?.values?.setinfo?.allItems?.map(
                  (item: any, index: number) => {
                    return (
                      <Checkbox.Card
                        value={item.value}
                        key={index}
                        radius="md"
                        withBorder
                        pos="relative"
                      >
                        <Image h={150} src={item.img} alt="X" fit="cover" />

                        <Group wrap="nowrap" align="center" p="sm">
                          <Checkbox.Indicator size="xs" />
                          <Text size="xs">{item.label}</Text>
                        </Group>
                      </Checkbox.Card>
                    );
                  }
                )}
              </SimpleGrid>
            </Checkbox.Group>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
