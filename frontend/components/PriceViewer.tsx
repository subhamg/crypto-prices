"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrice } from "@/lib/api";
import {
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";

type BaseOrQuote = "TON" | "USDT";

export default function PriceViewer() {
  const [base, setBase] = useState<BaseOrQuote>("TON");
  const [quote, setQuote] = useState<BaseOrQuote>("USDT");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["price", base, quote],
    queryFn: () => getPrice(base, quote),
    staleTime: 60_000,
  });

  return (
    <Stack
      align="center"
      gap="md"
      style={{ maxWidth: 560, margin: "2rem auto" }}
    >
      <Title order={2}>Crypto Prices</Title>
      <Flex gap="md" align="center">
        <Select
          data={["TON", "USDT"]}
          value={base}
          onChange={(val) => setBase((val as BaseOrQuote) ?? "TON")}
          allowDeselect={false}
          w={120}
          checkIconPosition="right"
        />
        <Text size="lg">/</Text>
        <Select
          data={["USDT", "TON"]}
          value={quote}
          onChange={(val) => setQuote((val as BaseOrQuote) ?? "USDT")}
          allowDeselect={false}
          w={120}
          checkIconPosition="right"
        />
        <Button onClick={() => refetch()} loading={isFetching}>
          Refresh
        </Button>
      </Flex>

      {isLoading && <Loader />}
      {isError && <Text c="red">Failed to load price.</Text>}
      {data && (
        <Card withBorder shadow="sm" radius="md" w="100%">
          <Stack gap={6}>
            <Text>
              <Text span fw={600}>
                Pair:
              </Text>{" "}
              {data.pair}
            </Text>
            <Text>
              <Text span fw={600}>
                Price:
              </Text>{" "}
              {data.price}
            </Text>
            <Text>
              <Text span fw={600}>
                Source:
              </Text>{" "}
              {data.source}
            </Text>
            <Text>
              <Text span fw={600}>
                As of:
              </Text>{" "}
              {new Date(data.asOf).toLocaleString()}
            </Text>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
