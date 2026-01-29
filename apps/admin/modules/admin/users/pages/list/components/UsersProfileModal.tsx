"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  Tabs,
  Text,
  Group,
  Avatar,
  Badge,
  Paper,
  Grid,
  Loader,
  ScrollArea,
  ThemeIcon,
  Timeline,
  Card,
  Image,
  Checkbox,
} from "@mantine/core";
import {
  User,
  ShoppingCart,
  TextAa,
  CheckCircle,
  MapPin,
  Briefcase,
  Bank,
} from "@phosphor-icons/react";
import { USERS_API } from "../../../module.api";

interface UsersProfileModalProps {
  opened: boolean;
  onClose: () => void;
  record: any | null;
}

export function UsersProfileModal({
  opened,
  onClose,
  record,
}: UsersProfileModalProps) {
  const [activeTab, setActiveTab] = useState<string | null>("profile");
  const [loading, setLoading] = useState(false);

  // State for fetched data
  const [carts, setCarts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);

  // Reset state when modal opens/record changes
  useEffect(() => {
    if (opened) {
      setActiveTab("profile");
      setCarts([]);
      setPosts([]);
      setTodos([]);
    }
  }, [opened, record]);

  // Fetch data on tab change
  const handleTabChange = async (value: string | null) => {
    setActiveTab(value);

    if (value && value !== "profile" && record?.id) {
      setLoading(true);
      try {
        if (value === "carts" && carts.length === 0) {
          const res = await USERS_API.getUserCarts(record.id);
          setCarts(res.carts || []);
        } else if (value === "posts" && posts.length === 0) {
          const res = await USERS_API.getUserPosts(record.id);
          setPosts(res.posts || []);
        } else if (value === "todos" && todos.length === 0) {
          const res = await USERS_API.getUserTodos(record.id);
          setTodos(res.todos || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!record) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          User Profile
        </Text>
      }
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="md">
        {/* User Header */}
        <Group>
          <Avatar src={record.image} size={80} radius="xl" />
          <div>
            <Title order={3} size="h3">
              {record.firstName} {record.lastName}
            </Title>
            <Text c="dimmed">@{record.username}</Text>
            <Group gap="xs" mt="xs">
              <Badge>{record.role || "user"}</Badge>
              <Text size="sm">{record.email}</Text>
            </Group>
          </div>
        </Group>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<User />}>
              Profile
            </Tabs.Tab>
            <Tabs.Tab value="carts" leftSection={<ShoppingCart />}>
              Carts
            </Tabs.Tab>
            <Tabs.Tab value="posts" leftSection={<TextAa />}>
              Posts
            </Tabs.Tab>
            <Tabs.Tab value="todos" leftSection={<CheckCircle />}>
              Todos
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Grid>
              <Grid.Col span={6}>
                <Paper withBorder p="md" h="100%">
                  <Group mb="md">
                    <MapPin size={20} />
                    <Text fw={600}>Address</Text>
                  </Group>
                  <Stack gap="xs">
                    <Text size="sm">{record.address?.address}</Text>
                    <Text size="sm">
                      {record.address?.city}, {record.address?.state}{" "}
                      {record.address?.postalCode}
                    </Text>
                    <Text size="sm">{record.address?.country}</Text>
                  </Stack>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper withBorder p="md" h="100%">
                  <Group mb="md">
                    <Briefcase size={20} />
                    <Text fw={600}>Employment</Text>
                  </Group>
                  <Stack gap="xs">
                    <Text size="sm">
                      <Text span fw={500}>
                        Title:
                      </Text>{" "}
                      {record.company?.title}
                    </Text>
                    <Text size="sm">
                      <Text span fw={500}>
                        Company:
                      </Text>{" "}
                      {record.company?.name}
                    </Text>
                    <Text size="sm">
                      <Text span fw={500}>
                        Department:
                      </Text>{" "}
                      {record.company?.department}
                    </Text>
                    <Text size="sm">
                      <Text span fw={500}>
                        University:
                      </Text>{" "}
                      {record.university}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>
              <Grid.Col span={12}>
                <Paper withBorder p="md">
                  <Group mb="md">
                    <Bank size={20} />
                    <Text fw={600}>Financial</Text>
                  </Group>
                  <Group gap="xl">
                    <div>
                      <Text size="xs" c="dimmed">
                        Card Number
                      </Text>
                      <Text size="sm">
                        {record.bank?.cardNumber} ({record.bank?.cardType})
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">
                        IBAN
                      </Text>
                      <Text size="sm">{record.bank?.iban}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">
                        Wallet
                      </Text>
                      <Text size="sm" style={{ wordBreak: "break-all" }}>
                        {record.crypto?.wallet}
                      </Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="carts" pt="md">
            {loading ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              <Stack>
                {carts.length === 0 && <Text c="dimmed">No carts found.</Text>}
                {carts.map((cart: any) => (
                  <Card key={cart.id} withBorder>
                    <Text fw={600} mb="xs">
                      Cart #{cart.id} - Total: {cart.total}
                    </Text>
                    <Stack gap="xs">
                      {cart.products?.map((p: any) => (
                        <Group key={p.id} justify="space-between">
                          <Text size="sm">
                            {p.title} x{p.quantity}
                          </Text>
                          <Text size="sm">${p.total}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="posts" pt="md">
            {loading ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              <Timeline active={-1} bulletSize={24} lineWidth={2}>
                {posts.length === 0 && <Text c="dimmed">No posts found.</Text>}
                {posts.map((post: any) => (
                  <Timeline.Item
                    key={post.id}
                    title={post.title}
                    bullet={<TextAa size={12} />}
                  >
                    <Text size="sm" mt={4}>
                      {post.body}
                    </Text>
                    <Group mt="xs" gap="xs">
                      {(post.tags || []).map((tag: string) => (
                        <Badge key={tag} size="xs" variant="dot">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                    <Group mt="xs">
                      <Text size="xs" c="dimmed">
                        Likes: {post.reactions?.likes || 0}
                      </Text>
                    </Group>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="todos" pt="md">
            {loading ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              <Stack>
                {todos.length === 0 && <Text c="dimmed">No todos found.</Text>}
                {todos.map((todo: any) => (
                  <Paper key={todo.id} withBorder p="sm">
                    <Group>
                      <Checkbox checked={todo.completed} readOnly />
                      <Text td={todo.completed ? "line-through" : undefined}>
                        {todo.todo}
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Modal>
  );
}

// Helper imports for UI components not directly imported in the function
import { Title, Center } from "@mantine/core";
