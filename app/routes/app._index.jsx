import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import {
  SettingsFilledIcon,
  PersonLockIcon,
  ViewIcon,
  ButtonIcon,
  ConfettiIcon,
} from "@shopify/polaris-icons";
import {
  Card,
  Page,
  Text,
  Icon,
  Grid,
  Box,
  InlineGrid,
  CalloutCard,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const variantId =
    responseJson.data.productCreate.product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
      mutation shopifyRemixTemplateUpdateVariant($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
            barcode
            createdAt
          }
        }
      }`,
    {
      variables: {
        input: {
          id: variantId,
          price: Math.random() * 100,
        },
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantUpdate.productVariant,
  });
};

export default function Index() {
  const impressions = 1000; // Replace with actual data
  const clicks = 500; // Replace with actual data
  const conversionRate = (clicks / impressions) * 100;
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page
      divider
      title="Dashboard"
      primaryAction={{
        content: "Settings",
        icon: <Icon source={SettingsFilledIcon} tone="base" />,
        onAction: () => navigate("/app/settings"),
      }}
      secondaryActions={[
        {
          content: "Upgrade",
          icon: <Icon source={PersonLockIcon} tone="base" />,
          onAction: () => navigate("/app/upgrade"),
        },
      ]}
    >
      <TitleBar title="Floatr - Custom Floating Action Bar"></TitleBar>
      <CalloutCard
        title="You are using Floatr Free Version"
        illustration="floatr.png"
        primaryAction={{ content: "Upgrade Now" }}
        onDismiss={() => {}}
      >
        <p>
          Thank you for using Floatr! Our app is free to use until you exceed
          1,000 impressions. An impression is counted each time the floating bar
          is displayed to a visitor on your website. Once you surpass this
          limit, you will need to upgrade to a paid plan to continue using
          Floatr.
        </p>
        <br />
        <p>
          We hope you enjoy the benefits of Floatr and find it valuable for your
          Shopify store. If you have any questions or need assistance, please
          don't hesitate to reach out to our support team.
        </p>
      </CalloutCard>
      <br />
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Card title="Impressions" sectioned>
            <InlineGrid columns="1fr auto">
              <Text as="h2" variant="headingSm">
                Impressions
              </Text>
              <Icon source={ViewIcon} tone="magic" />
            </InlineGrid>
            <br />
            <Box background="bg-fill-tertiary" borderRadius="200" padding="300">
              <InlineGrid columns="1fr auto">
                <Text as="p" fontWeight="semibold">
                  {impressions}
                </Text>
                <Text as="p" fontWeight="light">
                  / 1000
                </Text>
              </InlineGrid>
            </Box>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Card title="Clicks" sectioned>
            <InlineGrid columns="1fr auto">
              <Text as="h2" variant="headingSm">
                Clicks
              </Text>
              <Icon source={ButtonIcon} tone="success" />
            </InlineGrid>
            <br />
            <Box background="bg-fill-tertiary" borderRadius="200" padding="300">
              <Text as="p" fontWeight="semibold">
                {clicks}
              </Text>
            </Box>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Card title="Conversion Rate" sectioned>
            <InlineGrid columns="1fr auto">
              <Text as="h2" variant="headingSm">
                Conversion Rate
              </Text>
              <Icon source={ConfettiIcon} tone="info" />
            </InlineGrid>
            <br />
            <Box background="bg-fill-tertiary" borderRadius="200" padding="300">
              <Text as="p" fontWeight="semibold">
                {conversionRate.toFixed(2)}%
              </Text>
            </Box>
          </Card>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}
