import { useState, useEffect } from 'react';
import {
  Modal,
  BlockStack,
  Text,
  Spinner,
  TextField,
  Box,
  InlineStack,
  Badge,
  Button,
  Banner,
} from '@shopify/polaris';

interface Order {
  id: string;
  name: string;
  orderNumber: string;
  createdAt: string;
  totalPrice: string;
  currency: string;
  customerName: string;
  customerEmail?: string;
  status: string;
}

interface OrderPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedOrders: Order[]) => void;
}

export function OrderPickerModal({ open, onClose, onSelect }: OrderPickerModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orders/recent');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  };

  const handleSelect = () => {
    const selected = orders.filter(order => selectedOrders.has(order.id));
    onSelect(selected);
    setSelectedOrders(new Set());
  };

  const filteredOrders = orders.filter(order => {
    if (!searchValue) return true;
    const search = searchValue.toLowerCase();
    return (
      order.name.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      order.customerEmail?.toLowerCase().includes(search)
    );
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Select Orders to Generate Invoices"
      primaryAction={{
        content: `Create Invoices (${selectedOrders.size})`,
        onAction: handleSelect,
        disabled: selectedOrders.size === 0,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {error && (
            <Banner tone="critical">
              <p>{error}</p>
            </Banner>
          )}

          <TextField
            label=""
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search orders by number, customer..."
            autoComplete="off"
            clearButton
            onClearButtonClick={() => setSearchValue('')}
          />

          {loading ? (
            <Box padding="400">
              <InlineStack align="center">
                <Spinner size="small" />
                <Text as="p">Loading orders...</Text>
              </InlineStack>
            </Box>
          ) : filteredOrders.length === 0 ? (
            <Text as="p" tone="subdued">
              No orders found
            </Text>
          ) : (
            <BlockStack gap="200">
              <Text as="p" tone="subdued">
                Select up to 10 orders to generate invoices
              </Text>
              <Box
                paddingBlock="200"
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                <BlockStack gap="200">
                  {filteredOrders.slice(0, 50).map((order) => (
                    <Box
                      key={order.id}
                      padding="300"
                      borderWidth="025"
                      borderColor="border"
                      borderRadius="200"
                      background={selectedOrders.has(order.id) ? 'bg-surface-selected' : undefined}
                    >
                      <InlineStack align="space-between" blockAlign="center">
                        <InlineStack gap="300" blockAlign="center">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order.id)}
                            onChange={() => toggleOrder(order.id)}
                            disabled={selectedOrders.size >= 10 && !selectedOrders.has(order.id)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <BlockStack gap="100">
                            <InlineStack gap="200" blockAlign="center">
                              <Text as="h3" variant="headingSm">
                                {order.name}
                              </Text>
                              <Badge tone={order.status === 'paid' ? 'success' : 'info'}>
                                {order.status}
                              </Badge>
                            </InlineStack>
                            <Text as="p" variant="bodySm">
                              {order.customerName}
                              {order.customerEmail && ` • ${order.customerEmail}`}
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">
                              {order.currency} {order.totalPrice} • {new Date(order.createdAt).toLocaleDateString()}
                            </Text>
                          </BlockStack>
                        </InlineStack>
                      </InlineStack>
                    </Box>
                  ))}
                </BlockStack>
              </Box>
            </BlockStack>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
