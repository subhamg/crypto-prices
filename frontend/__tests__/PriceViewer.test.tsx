import { render, screen, waitFor } from "@testing-library/react";
import PriceViewer from "@/components/PriceViewer";

// Mock fetch before tests
beforeAll(() => {
  const mockResponse = {
    ok: true,
    json: async () => ({
      pair: "TON/USDT",
      price: 7.12,
      source: "mock",
      asOf: new Date().toISOString(),
      ttlSeconds: 60,
    }),
  } as Response;
  global.fetch = jest.fn().mockResolvedValue(mockResponse);
});

afterAll(() => {
  // @ts-expect-error - cleanup mock
  global.fetch?.mockRestore?.();
});

// Because PriceViewer needs React Query provider, we wrap it with a quick inline provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";

function wrap(ui: React.ReactElement) {
  const client = new QueryClient();
  return (
    <MantineProvider>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </MantineProvider>
  );
}

it("renders price from api", async () => {
  render(wrap(<PriceViewer />));

  await waitFor(() => {
    expect(screen.getByText(/TON\/USDT/)).toBeInTheDocument();
  });
  expect(screen.getByText(/7\.12/)).toBeInTheDocument();
});
