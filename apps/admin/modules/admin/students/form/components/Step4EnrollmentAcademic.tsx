"use client";

import { Stack, Group, Text, TextInput, Table, NumberInput, Paper, ScrollArea, Select, Button } from "@mantine/core";
import { DateInput, MonthPickerInput } from "@mantine/dates";
import { FormWrapper } from "@settle/core";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import dayjs from "dayjs";
import { SelectWithCreate } from "../../components/SelectWithCreate";
import { BATCH_API, GRADE_OPTIONS } from "../../module.config";
import { BatchModal } from "../../modals/BatchModal";

interface Step4EnrollmentAcademicProps {
    disabled?: boolean;
}

export function Step4EnrollmentAcademic({
    disabled = false,
}: Step4EnrollmentAcademicProps) {
    const form = FormWrapper.useForm();
    const [, forceUpdate] = useState({});

    // Modal states
    const [batchModalOpened, batchModalHandlers] = useDisclosure(false);



    // Marking State
    const handleStartMonthChange = (date: Date | null) => {
        form.setFieldValue("marking_start_date", date);
    };

    const handleGenerateMarkings = () => {
        const date = form.getValues().marking_start_date;
        if (!date) return;

        const currentMarkings = form.getValues().markings || [];
        const newMarkings: any[] = [];

        let currentDate = dayjs(date);
        for (let i = 0; i < 12; i++) {
            const year = currentDate.year();
            const month = currentDate.month() + 1;

            const existing = currentMarkings.find((m: any) => m.year === year && m.month === month);
            if (existing) {
                newMarkings.push(existing);
            } else {
                newMarkings.push({
                    year,
                    month,
                    total_days: null,
                    class_hours: "",
                    present: null,
                    absent: null,
                    attendance_percent: "",
                });
            }
            currentDate = currentDate.add(1, 'month');
        }

        form.setFieldValue("markings", newMarkings);
        forceUpdate({});
    };

    const updateMarkingFieldValue = (index: number, field: string, val: any) => {
        const current = [...(form.getValues().markings || [])];
        current[index][field] = val === "" ? null : val;
        form.setFieldValue("markings", current);
        forceUpdate({});
    };

    const handleMarkingBlur = (index: number, fieldBlurred: string) => {
        const current = [...(form.getValues().markings || [])];
        const row = current[index];
        const maxDaysInMonth = dayjs().year(row.year).month(row.month - 1).daysInMonth();
        const defaultHours = form.getValues().default_class_hours;

        // cap total_days
        if (row.total_days !== null && row.total_days > maxDaysInMonth) {
            row.total_days = maxDaysInMonth;
        }

        // Calculate class_hours from total_days * default_class_hours
        if (fieldBlurred === "total_days" && row.total_days !== null && defaultHours) {
            row.class_hours = String(Number(row.total_days) * Number(defaultHours));
        }

        const t = row.total_days !== null ? Number(row.total_days) : null;

        let p = row.present !== null ? Number(row.present) : null;
        let a = row.absent !== null ? Number(row.absent) : null;

        // Limiting bounds and calculating based on total_days
        if (fieldBlurred === "present") {
            if (p !== null && t !== null && p > t) {
                p = t;
                row.present = p;
            }
            if (t !== null && p !== null) {
                a = Math.max(0, t - p);
                row.absent = a;
            }
        } else if (fieldBlurred === "absent") {
            if (a !== null && t !== null && a > t) {
                a = t;
                row.absent = a;
            }
            if (t !== null && a !== null) {
                p = Math.max(0, t - a);
                row.present = p;
            }
        }

        if (p !== null && a !== null && (p + a) > 0) {
            row.attendance_percent = ((p / (p + a)) * 100).toFixed(2);
        } else if (p !== null && t !== null && t > 0) {
            row.attendance_percent = ((p / t) * 100).toFixed(2);
        } else {
            row.attendance_percent = "";
        }

        form.setFieldValue("markings", current);
        forceUpdate({});
    };

    const calculateTotals = () => {
        let total_days = 0;
        let class_hours = 0;
        let present = 0;
        let absent = 0;

        (form.getValues().markings || []).forEach((m: any) => {
            total_days += Number(m.total_days || 0);
            class_hours += Number(m.class_hours || 0);
            present += Number(m.present || 0);
            absent += Number(m.absent || 0);
        });

        const totalForPercent = present + absent;
        const attendPercent = totalForPercent > 0
            ? ((present / totalForPercent) * 100).toFixed(2)
            : class_hours > 0
                ? ((present / class_hours) * 100).toFixed(2)
                : "0.00";

        return { total_days, class_hours, present, absent, attendPercent };
    };

    // Fetch batches
    const { data: batchesData, refetch: refetchBatches } = useQuery({
        queryKey: ["batches"],
        queryFn: async () => {
            const res = await BATCH_API.getBatches();
            return res.data;
        },
    });

    const batchOptions = (batchesData || []).map((batch: any) => ({
        value: String(batch.id),
        label: batch.name,
    }));



    const values = form.getValues();
    const totals = calculateTotals();

    return (
        <>
            <Stack gap="xl">
                <Stack gap="md">
                    <SelectWithCreate
                        label="Batch"
                        placeholder="Select or create batch"
                        data={batchOptions}
                        disabled={disabled}
                        onAddNew={batchModalHandlers.open}
                        value={values.batch ? String(values.batch) : null}
                        onChange={(value) => { form.setFieldValue("batch", value ? Number(value) : null); forceUpdate({}); }}
                        error={form.errors.batch as string}
                    />

                    <Group grow>
                        <DateInput
                            label="Date of Admission"
                            placeholder="Select admission date"
                            disabled={disabled}
                            valueFormat="YYYY-MM-DD"
                            {...form.getInputProps("date_of_admission")}
                        />
                        <DateInput
                            label="Date of Completion"
                            placeholder="Select completion date"
                            disabled={disabled}
                            valueFormat="YYYY-MM-DD"
                            {...form.getInputProps("date_of_completion")}
                        />
                    </Group>
                </Stack>

                <Stack gap="md" mt="md">
                    <Text fw={600} size="sm">Grading Information</Text>
                    <Group grow>
                        <Select data={GRADE_OPTIONS} clearable label="Grammar" placeholder="Grade" {...form.getInputProps("grading_grammar")} disabled={disabled} />
                        <Select data={GRADE_OPTIONS} clearable label="Conversation" placeholder="Grade" {...form.getInputProps("grading_conversation")} disabled={disabled} />
                        <Select data={GRADE_OPTIONS} clearable label="Composition" placeholder="Grade" {...form.getInputProps("grading_composition")} disabled={disabled} />
                    </Group>
                    <Group grow>
                        <Select data={GRADE_OPTIONS} clearable label="Listening" placeholder="Grade" {...form.getInputProps("grading_listening")} disabled={disabled} />
                        <Select data={GRADE_OPTIONS} clearable label="Reading" placeholder="Grade" {...form.getInputProps("grading_reading")} disabled={disabled} />
                        <TextInput label="Remarks" placeholder="Remarks" {...form.getInputProps("grading_remarks")} disabled={disabled} />
                    </Group>
                </Stack>

                <Stack gap="md" mt="md">
                    <Text fw={600} size="sm">Marking (Attendance) Information</Text>
                    <MonthPickerInput
                        label="Marking Start Month"
                        placeholder="Pick start month to auto-generate 12 months"
                        disabled={disabled}
                        value={values.marking_start_date ? new Date(values.marking_start_date) : null}
                        onChange={(val: any) => handleStartMonthChange(val)}
                    />

                    {values.marking_start_date && (
                        <Stack gap="md">
                            <TextInput
                                label="Default Class Hours"
                                placeholder="Enter default class hours"
                                disabled={disabled}
                                value={values.default_class_hours ?? ""}
                                onChange={(e) => form.setFieldValue("default_class_hours", e.currentTarget.value)}
                            />
                            <Button
                                onClick={handleGenerateMarkings}
                                disabled={disabled}
                                variant="default"
                            >
                                Generate 12 Months
                            </Button>
                        </Stack>
                    )}

                    {values.markings && values.markings.length > 0 && (
                        <ScrollArea type="auto" offsetScrollbars>
                            <Table striped highlightOnHover withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th style={{ whiteSpace: 'nowrap' }}>Month</Table.Th>
                                        <Table.Th style={{ whiteSpace: 'nowrap' }}>Tot. Days</Table.Th>
                                        <Table.Th style={{ whiteSpace: 'nowrap' }}>Class Hrs</Table.Th>
                                        <Table.Th style={{ whiteSpace: 'nowrap' }}>Present Days</Table.Th>
                                        <Table.Th style={{ whiteSpace: 'nowrap' }}>Absent Days</Table.Th>
                                        <Table.Th style={{ whiteSpace: 'nowrap' }}>Attend. %</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {values.markings.map((mark: any, index: number) => (
                                        <Table.Tr key={`${mark.year}-${mark.month}`}>
                                            <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                                <Text size="sm" fw={500}>{dayjs().year(mark.year).month(mark.month - 1).format("MMM")}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    placeholder="Days"
                                                    disabled={disabled}
                                                    value={values.markings[index]?.total_days ?? ""}
                                                    onChange={(val) => updateMarkingFieldValue(index, "total_days", val)}
                                                    onBlur={() => handleMarkingBlur(index, "total_days")}
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <TextInput
                                                    size="xs"
                                                    placeholder="Hrs"
                                                    readOnly
                                                    value={values.markings[index]?.class_hours ?? ""}
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    placeholder="Days"
                                                    disabled={disabled}
                                                    value={values.markings[index]?.present ?? ""}
                                                    onChange={(val) => updateMarkingFieldValue(index, "present", val)}
                                                    onBlur={() => handleMarkingBlur(index, "present")}
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <NumberInput
                                                    size="xs"
                                                    placeholder="Days"
                                                    disabled={disabled || !values.markings[index]?.total_days}
                                                    value={values.markings[index]?.absent ?? ""}
                                                    onChange={(val) => updateMarkingFieldValue(index, "absent", val)}
                                                    onBlur={() => handleMarkingBlur(index, "absent")}
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <TextInput
                                                    size="xs"
                                                    placeholder="%"
                                                    disabled={disabled}
                                                    value={values.markings[index]?.attendance_percent ?? ""}
                                                    onChange={(e) => updateMarkingFieldValue(index, "attendance_percent", e.currentTarget.value)}
                                                    onBlur={() => handleMarkingBlur(index, "attendance_percent")}
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                                <Table.Tfoot>
                                    <Table.Tr>
                                        <Table.Th>Totals</Table.Th>
                                        <Table.Th>{totals.total_days || "-"}</Table.Th>
                                        <Table.Th>{totals.class_hours || "-"}</Table.Th>
                                        <Table.Th>{totals.present || "-"}</Table.Th>
                                        <Table.Th>{totals.absent || "-"}</Table.Th>
                                        <Table.Th>{totals.attendPercent}%</Table.Th>
                                    </Table.Tr>
                                </Table.Tfoot>
                            </Table>
                        </ScrollArea>
                    )}
                </Stack>
            </Stack>

            {/* Modals */}
            <BatchModal
                opened={batchModalOpened}
                onClose={batchModalHandlers.close}
                onSuccess={(newBatch) => {
                    refetchBatches();
                    form.setFieldValue("batch", newBatch.id);
                    forceUpdate({});
                    batchModalHandlers.close();
                }}
            />




        </>
    );
}
