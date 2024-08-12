import {
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  Box,
  Button,
  Badge,
  InlineStack,
  useBreakpoints,
  InlineGrid,
  Divider,
  TextField,
  Grid,
  ChoiceList,
  Select,
  Checkbox,
  Icon,
  Tooltip,
  PageActions,
  Popover,
  FormLayout,
  DatePicker,
  ColorPicker,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  XCircleIcon,
  ClockIcon,
  DiscountIcon,
  ButtonPressIcon,
  ButtonIcon,
  CalendarIcon,
  ResetIcon,
  CheckIcon,
} from "@shopify/polaris-icons";
import { useState, useCallback, useEffect, useRef } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import db from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `{
  shop {
    id
  }
}
`,
  );
  const data = await response.json();
  const shopId = data.data.shop.id;
  // get data from database
  let settings = await db.settings.findUnique({
    where: { id: shopId },
  });
  if (!settings) {
    settings = {
      isEnabled: false,
      fontChosen: "Default",
      fontsizeValue: 16,
      textTitleFieldValue: "",
      contentValue: "",
      canBeClosed: false,
      countdown: false,
      showCoupon: false,
      showButton: false,
      collectLeads: false,
      expiryDate: false,
      expiryDateValue: "",
      widthChoice: false,
      heightChoice: false,
      paddingChoice: false,
      marginChoice: false,
      daysValue: null,
      hoursValue: null,
      minutesValue: null,
      secondsValue: null,
      couponValue: "",
      textButtonFieldValue: "",
      urlButtonFieldValue: "",
      leadChosen: "Collect All",
      positionChosen: "Top",
      styleChosen: "Full Width Bar",
      bgColor: '{"hue":0,"saturation":0,"brightness":0.2,"alpha":1}',
      pColor:
        '{"hue":14.285714285714281,"saturation":0.8411214953271028,"brightness":0.9411764705882353,"alpha":1}',
      sColor: '{"hue":0,"saturation":0,"brightness":1,"alpha":1}',
      deviceChosen: "Both",
      btnEffectChosen: "None",
      afterBtnClickChosen: "Nothing",
      triggerChosen: "None",
      topPaddingValue: null,
      rightPaddingValue: null,
      bottomPaddingValue: null,
      leftPaddingValue: null,
      topMarginValue: null,
      rightMarginValue: null,
      bottomMarginValue: null,
      leftMarginValue: null,
      widthPixelValue: null,
      heightPixelValue: null,
    };
  }
  settings = {
    ...settings,
    bgColor: JSON.parse(settings.bgColor),
    pColor: JSON.parse(settings.pColor),
    sColor: JSON.parse(settings.sColor),
  };
  // let settings = {
  //   isEnabled: false,
  //   fontChosen: "Default",
  //   fontsizeValue: 16,
  //   textTitleFieldValue: "",
  //   contentValue: "",
  //   canBeClosed: false,
  //   countdown: false,
  //   showCoupon: false,
  //   showButton: false,
  //   collectLeads: false,
  //   expiryDate: false,
  //   expiryDateValue: "",
  //   widthChoice: false,
  //   heightChoice: false,
  //   paddingChoice: false,
  //   marginChoice: false,
  //   daysValue: null,
  //   hoursValue: null,
  //   minutesValue: null,
  //   secondsValue: null,
  //   couponValue: "",
  //   textButtonFieldValue: "",
  //   urlButtonFieldValue: "",
  //   leadChosen: "Collect All",
  //   positionChosen: "Top",
  //   styleChosen: "Full Width Bar",
  //   bgColor: "{}",
  //   pColor: "{}",
  //   sColor: "{}",
  //   deviceChosen: "Both",
  //   btnEffectChosen: "None",
  //   afterBtnClickChosen: "Nothing",
  //   triggerChosen: "None",
  //   topPaddingValue: null,
  //   rightPaddingValue: null,
  //   bottomPaddingValue: null,
  //   leftPaddingValue: null,
  //   topMarginValue: null,
  //   rightMarginValue: null,
  //   bottomMarginValue: null,
  //   leftMarginValue: null,
  //   widthPixelValue: null,
  //   heightPixelValue: null,
  // };
  return json(settings);
}
export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `{
  shop {
    id
  }
}
`,
  );
  const data = await response.json();
  const shopId = data.data.shop.id;
  const method = request.method;
  switch (method) {
    case "POST":
      let settings = await request.formData();
      console.log("settings: -----> ", settings);
      settings = Object.fromEntries(settings);
      if (settings.confirmContentText?.toLowerCase() === "reset") {
        const updateContent = {
          fontChosen: "Default",
          fontsizeValue: 16,
          textTitleFieldValue: "",
          contentValue: "",
        };
        await db.settings.upsert({
          where: { id: shopId },
          update: updateContent,
          create: {
            id: shopId,
            ...updateContent,
          },
        });
      }
      if (settings.confirmVisualText?.toLowerCase() === "reset") {
        const updateContent = {
          canBeClosed: false,
          countdown: false,
          showCoupon: false,
          showButton: false,
          collectLeads: false,
          daysValue: null,
          hoursValue: null,
          minutesValue: null,
          secondsValue: null,
          couponValue: "",
          textButtonFieldValue: "",
          urlButtonFieldValue: "",
          leadChosen: "Collect All",
          positionChosen: "Top",
          styleChosen: "Full Width Bar",
        };
        await db.settings.upsert({
          where: { id: shopId },
          update: updateContent,
          create: {
            id: shopId,
            ...updateContent,
          },
        });
      }
      if (settings.confirmColorText?.toLowerCase() === "reset") {
        const updateContent = {
          bgColor: '{"hue":0,"saturation":0,"brightness":0.2,"alpha":1}',
          pColor:
            '{"hue":14.285714285714281,"saturation":0.8411214953271028,"brightness":0.9411764705882353,"alpha":1}',
          sColor: '{"hue":0,"saturation":0,"brightness":1,"alpha":1}',
        };
        await db.settings.upsert({
          where: { id: shopId },
          update: updateContent,
          create: {
            id: shopId,
            ...updateContent,
          },
        });
      }
      if (settings.confirmDimensionText?.toLowerCase() === "reset") {
        const updateContent = {
          widthChoice: false,
          heightChoice: false,
          paddingChoice: false,
          marginChoice: false,
          topPaddingValue: null,
          rightPaddingValue: null,
          bottomPaddingValue: null,
          leftPaddingValue: null,
          topMarginValue: null,
          rightMarginValue: null,
          bottomMarginValue: null,
          leftMarginValue: null,
          widthPixelValue: null,
          heightPixelValue: null,
        };
        await db.settings.upsert({
          where: { id: shopId },
          update: updateContent,
          create: {
            id: shopId,
            ...updateContent,
          },
        });
      }
      if (settings.confirmBehavioralText?.toLowerCase() === "reset") {
        const updateContent = {
          expiryDate: false,
          expiryDateValue: "",
          deviceChosen: "Both",
          btnEffectChosen: "None",
          afterBtnClickChosen: "Nothing",
          triggerChosen: "None",
        };
        await db.settings.upsert({
          where: { id: shopId },
          update: updateContent,
          create: {
            id: shopId,
            ...updateContent,
          },
        });
      }
      const updateData = {
        ...(settings.isEnabled !== undefined && {
          isEnabled: settings.isEnabled === "true" ? true : false,
        }),
        ...(settings.fontChosen && { fontChosen: settings.fontChosen }),
        ...(settings.fontsizeValue && {
          fontsizeValue: parseInt(settings.fontsizeValue, 10),
        }),
        ...(settings.textTitleFieldValue && {
          textTitleFieldValue: settings.textTitleFieldValue,
        }),
        ...(settings.contentValue && { contentValue: settings.contentValue }),
        ...(settings.canBeClosed !== undefined && {
          canBeClosed: settings.canBeClosed === "true" ? true : false,
        }),
        ...(settings.countdown !== undefined && {
          countdown: settings.countdown === "true" ? true : false,
        }),
        ...(settings.showCoupon !== undefined && {
          showCoupon: settings.showCoupon === "true" ? true : false,
        }),
        ...(settings.showButton !== undefined && {
          showButton: settings.showButton === "true" ? true : false,
        }),
        ...(settings.collectLeads !== undefined && {
          collectLeads: settings.collectLeads === "true" ? true : false,
        }),
        ...(settings.expiryDate !== undefined && {
          expiryDate: settings.expiryDate === "true" ? true : false,
        }),
        ...(settings.expiryDateValue && {
          expiryDateValue: settings.expiryDateValue,
        }),
        ...(settings.widthChoice !== undefined && {
          widthChoice: settings.widthChoice === "true" ? true : false,
        }),
        ...(settings.heightChoice !== undefined && {
          heightChoice: settings.heightChoice === "true" ? true : false,
        }),
        ...(settings.paddingChoice !== undefined && {
          paddingChoice: settings.paddingChoice === "true" ? true : false,
        }),
        ...(settings.marginChoice !== undefined && {
          marginChoice: settings.marginChoice === "true" ? true : false,
        }),
        ...(settings.daysValue && {
          daysValue: parseInt(settings.daysValue, 10),
        }),
        ...(settings.hoursValue && {
          hoursValue: parseInt(settings.hoursValue, 10),
        }),
        ...(settings.minutesValue && {
          minutesValue: parseInt(settings.minutesValue, 10),
        }),
        ...(settings.secondsValue && {
          secondsValue: parseInt(settings.secondsValue, 10),
        }),
        ...(settings.couponValue && { couponValue: settings.couponValue }),
        ...(settings.textButtonFieldValue && {
          textButtonFieldValue: settings.textButtonFieldValue,
        }),
        ...(settings.urlButtonFieldValue && {
          urlButtonFieldValue: settings.urlButtonFieldValue,
        }),
        ...(settings.leadChosen && { leadChosen: settings.leadChosen }),
        ...(settings.positionChosen && {
          positionChosen: settings.positionChosen,
        }),
        ...(settings.styleChosen && { styleChosen: settings.styleChosen }),
        ...(settings.bgColor && {
          bgColor: settings.bgColor,
        }),
        ...(settings.pColor && {
          pColor: settings.pColor,
        }),
        ...(settings.sColor && {
          sColor: settings.sColor,
        }),
        ...(settings.deviceChosen && { deviceChosen: settings.deviceChosen }),
        ...(settings.btnEffectChosen && {
          btnEffectChosen: settings.btnEffectChosen,
        }),
        ...(settings.afterBtnClickChosen && {
          afterBtnClickChosen: settings.afterBtnClickChosen,
        }),
        ...(settings.triggerChosen && {
          triggerChosen: settings.triggerChosen,
        }),
        ...(settings.topPaddingValue && {
          topPaddingValue: parseInt(settings.topPaddingValue, 10),
        }),
        ...(settings.rightPaddingValue && {
          rightPaddingValue: parseInt(settings.rightPaddingValue, 10),
        }),
        ...(settings.bottomPaddingValue && {
          bottomPaddingValue: parseInt(settings.bottomPaddingValue, 10),
        }),
        ...(settings.leftPaddingValue && {
          leftPaddingValue: parseInt(settings.leftPaddingValue, 10),
        }),
        ...(settings.topMarginValue && {
          topMarginValue: parseInt(settings.topMarginValue, 10),
        }),
        ...(settings.rightMarginValue && {
          rightMarginValue: parseInt(settings.rightMarginValue, 10),
        }),
        ...(settings.bottomMarginValue && {
          bottomMarginValue: parseInt(settings.bottomMarginValue, 10),
        }),
        ...(settings.leftMarginValue && {
          leftMarginValue: parseInt(settings.leftMarginValue, 10),
        }),
        ...(settings.widthPixelValue && {
          widthPixelValue: parseInt(settings.widthPixelValue, 10),
        }),
        ...(settings.heightPixelValue && {
          heightPixelValue: parseInt(settings.heightPixelValue, 10),
        }),
      };
      console.log("updateData: -----> ", updateData);
      await db.settings.upsert({
        where: { id: shopId },
        update: updateData,
        create: {
          id: shopId,
          ...updateData,
        },
      });
      function escapeJSONString(str) {
        return str
          .replace(/\\/g, "\\\\") // Escape backslashes
          .replace(/"/g, '\\"'); // Escape double quotes
      }
      const updateSettings = await db.settings.findUnique({
        where: { id: shopId },
      });
      const response = await admin.graphql(
        `
        mutation {
          metafieldsSet(
            metafields: [{
              namespace: "floatr", 
              key: "settings", 
              value: "${escapeJSONString(JSON.stringify(updateSettings))}", 
              type: "json", 
              ownerId: "${updateSettings.id}"
            }]
          ) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
        `,
      );
      return json(settings);
    default:
      return new Response("Method not allowed", { status: 405 });
  }
}
export default function SettingsPage() {
  const fetcher = useFetcher();
  const settingsData = useLoaderData();
  const [formState, setFormState] = useState(settingsData);
  // const handleTitleTextFieldChange = useCallback(
  // (value) => setTitleTextFieldValue(value),
  // [],
  // );
  // const handleButtonTextFieldChange = useCallback(
  // (value) => setButtonTextFieldValue(value),
  // [],
  // );
  const [popoverContentActive, setPopoverContentActive] = useState(false);
  const [popoverVisualActive, setPopoverVisualActive] = useState(false);
  const [popoverColorActive, setPopoverColorActive] = useState(false);
  const [popoverDimensionActive, setPopoverDimensionActive] = useState(false);
  const [popoverBehaveActive, setPopoverBehaveActive] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const handleConfirmTextChange = useCallback(
    (value) => setConfirmText(value),
    [],
  );
  function nodeContainsDescendant(rootNode, descendant) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  // const formattedValue = selectedDate.toISOString().slice(0, 10);
  const datePickerRef = useRef(null);
  function isNodeWithinPopover(node) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }
  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    setSelectedDate(newSelectedDate);
    setVisible(false);
    const formattedDate = `${newSelectedDate.getFullYear()}-${String(newSelectedDate.getMonth() + 1).padStart(2, "0")}-${String(newSelectedDate.getDate()).padStart(2, "0")}`;
    setFormState((prevState) => ({
      ...prevState,
      expiryDateValue: formattedDate,
    }));
  }
  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);
  // Toggle functions for each popover
  const togglePopoverContent = () => setPopoverContentActive((prev) => !prev);
  const togglePopoverVisual = () => setPopoverVisualActive((prev) => !prev);
  const togglePopoverColor = () => setPopoverColorActive((prev) => !prev);
  const togglePopoverDimension = () =>
    setPopoverDimensionActive((prev) => !prev);
  const togglePopoverBehave = () => setPopoverBehaveActive((prev) => !prev);
  // Updated function to handle integer parameter
  const handleResetClick = useCallback((value) => {
    if (value === 0) {
      togglePopoverContent();
    } else if (value === 1) {
      togglePopoverVisual();
    } else if (value === 2) {
      togglePopoverColor();
    } else if (value === 3) {
      togglePopoverDimension();
    } else if (value === 4) {
      togglePopoverBehave();
    }
    setConfirmText("");
  }, []);

  // Passing different integer values based on the action
  const activator = (value) => (
    // make handleConfirmTextChange empty
    <Button
      onClick={() => handleResetClick(value)}
      icon={<Icon source={ResetIcon} />}
      variant="primary"
      tone="critical"
    >
      Reset
    </Button>
  );
  const handleCheckBox = useCallback(
    (key) => (newChecked) => {
      setFormState((prevState) => {
        const newState = {
          ...prevState,
          [key]: newChecked,
        };
        if (newState.showButton || newState.showCoupon) {
          newState.collectLeads = false;
        }
        if (newState.collectLeads) {
          newState.showButton = false;
          newState.showCoupon = false;
        }

        return newState;
      });
    },
    [],
  );

  // const handleContentChange = useCallback(
  // (newValue) => contentSetValue(newValue),
  // [],
  // );
  const handleToggle = useCallback(() => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      isEnabled: !prevFormState.isEnabled,
    }));

    // Submit the form with the updated isEnabled value
    fetcher.submit({ isEnabled: !formState.isEnabled }, { method: "post" });
  }, [formState.isEnabled, fetcher]);

  const contentStatus = formState.isEnabled ? "Turn off" : "Turn on";
  const toggleId = "setting-toggle-uuid";
  const descriptionId = "setting-toggle-description-uuid";
  const { breakerSwitch } = useBreakpoints();
  const badgeStatus = formState.isEnabled ? "success" : undefined;
  const badgeContent = formState.isEnabled ? "On" : "Off";
  const title = "Publish Mode";
  const description =
    "Toggle to enable or disable the publish mode of the tool. When enabled, the tool is live on your site. When disabled, it is turned off.";
  const settingStatusMarkup = (
    <Badge
      tone={badgeStatus}
      toneAndProgressLabelOverride={`Setting is ${badgeContent}`}
    >
      {badgeContent}
    </Badge>
  );
  const settingTitle = title ? (
    <InlineStack gap="200" wrap={false}>
      <InlineStack gap="200" align="start" blockAlign="baseline">
        <label htmlFor={toggleId}>
          <Text variant="headingMd" as="h6">
            {title}
          </Text>
        </label>
        <InlineStack gap="200" align="center" blockAlign="center">
          {settingStatusMarkup}
        </InlineStack>
      </InlineStack>
    </InlineStack>
  ) : null;

  const actionMarkup = (
    <Button
      role="switch"
      id={toggleId}
      ariaChecked={formState.isEnabled ? "true" : "false"}
      value={formState.isEnabled ? "true" : "false"}
      onClick={handleToggle}
      size="slim"
    >
      {contentStatus}
    </Button>
  );

  const headerMarkup = (
    <Box width="100%">
      <InlineStack
        gap="1200"
        align="space-between"
        blockAlign="start"
        wrap={false}
      >
        {settingTitle}
        {!breakerSwitch ? (
          <Box minWidth="fit-content">
            <InlineStack align="end">{actionMarkup}</InlineStack>
          </Box>
        ) : null}
      </InlineStack>
    </Box>
  );

  const descriptionMarkup = (
    <BlockStack gap="400">
      <Text id={descriptionId} variant="bodyMd" as="p" tone="subdued">
        {description}
      </Text>
      {breakerSwitch ? (
        <Box width="100%">
          <InlineStack align="start">{actionMarkup}</InlineStack>
        </Box>
      ) : null}
    </BlockStack>
  );

  return (
    <Page>
      <TitleBar title="Settings" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Preview
              </Text>
              <Text as="p" variant="bodyMd">
                This is the preview of the settings page
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap={{ xs: "400", sm: "500" }}>
              <Box width="100%">
                <BlockStack gap={{ xs: "200", sm: "400" }}>
                  {headerMarkup}
                  {descriptionMarkup}
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <br />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Content Settings
              </Text>
              <Text as="p" variant="bodyMd">
                The Content Settings allow you to customize the text and
                typography of your floating bar, ensuring it communicates
                effectively and aligns with your brand's voice.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Form method="POST">
                <Select
                  label={<span style={{ fontWeight: "bold" }}>Font Type</span>}
                  options={[
                    "Default",
                    "Abel",
                    "Abril Fatface",
                    "Alegreya",
                    "Alfa Slab One",
                    "Antic Didone",
                    "Balsamiq Sans",
                    "Bebas Neue",
                    "Berkshire Swash",
                    "Cabin",
                    "Caveat",
                    "Cedarville Cursive",
                    "Cinzel",
                    "Comfortaa",
                    "Cormorant",
                    "Cormorant Garamond",
                    "Crimson Text",
                    "Dancing Script",
                    "Fira Sans",
                    "Fjalla One",
                    "Homemade Apple",
                    "Inconsolata",
                    "Indie Flower",
                    "Italiana",
                    "Josefin Sans",
                    "Karla",
                    "La Belle Aurore",
                    "Lato",
                    "League Script",
                    "Lobster",
                    "Merriweather",
                    "Montserrat",
                    "Muli",
                    "Noto Sans",
                    "Nunito",
                    "Open Sans",
                    "Oswald",
                    "Pacifico",
                    "Playfair Display",
                    "Poppins",
                    "PT Sans",
                    "Quicksand",
                    "Raleway",
                    "Roboto",
                    "Rubik",
                    "Shadows Into Light",
                    "Source Sans Pro",
                    "Titillium Web",
                    "Ubuntu",
                    "Varela Round",
                    "Work Sans",
                    "Zilla Slab",
                  ]}
                  onChange={(value) =>
                    setFormState({ ...formState, fontChosen: value })
                  }
                  value={formState.fontChosen}
                  name="fontChosen"
                />
                <br />
                <TextField
                  label={<span style={{ fontWeight: "bold" }}>Font (px)</span>}
                  type="number"
                  value={formState.fontsizeValue}
                  name="fontsizeValue"
                  onChange={(value) => {
                    if (value > 0 && value <= 120) {
                      setFormState({
                        ...formState,
                        fontsizeValue: value,
                      });
                    }
                  }}
                  autoComplete="off"
                />
                <br />
                <TextField
                  label={<span style={{ fontWeight: "bold" }}>Title</span>}
                  value={formState?.textTitleFieldValue ?? ""}
                  name="textTitleFieldValue"
                  onChange={(value) =>
                    setFormState({ ...formState, textTitleFieldValue: value })
                  }
                  maxLength={30}
                  autoComplete="on"
                  placeholder="Enter your title here"
                  showCharacterCount
                />
                <br />
                <TextField
                  label={
                    <span style={{ fontWeight: "bold" }}>Content Text</span>
                  }
                  value={formState?.contentValue ?? ""}
                  name="contentValue"
                  onChange={(value) =>
                    setFormState({ ...formState, contentValue: value })
                  }
                  multiline={5}
                  maxHeight={300}
                  placeholder="Enter your description here. You can add multiple lines of text."
                  autoComplete="off"
                  maxLength={120}
                  showCharacterCount
                />
                <br />
                <div style={{ textAlign: "right" }}>
                  <PageActions
                    primaryAction={{
                      content: "Save",
                      submit: true,
                      name: "saveContentButton",
                      icon: <Icon source={CheckIcon} />,
                    }}
                    secondaryActions=<Popover
                      active={popoverContentActive}
                      activator={activator(0)}
                      onClose={togglePopoverContent}
                      ariaHaspopup={false}
                      sectioned
                    >
                      <Form method="POST">
                        <div style={{ fontWeight: "bold" }}>
                          <p>
                            Type{" "}
                            <span style={{ fontWeight: "bold" }}>RESET</span> to
                            return{" "}
                            <span style={{ fontWeight: "bold" }}>
                              Content Settings
                            </span>{" "}
                            to default:
                          </p>
                        </div>
                        <br />
                        <TextField
                          value={confirmText}
                          name="confirmContentText"
                          onChange={handleConfirmTextChange}
                          autoComplete="off"
                        />
                        <br />
                        <Button
                          submit="true"
                          name="resetContentButton"
                          size="slim"
                        >
                          Confirm
                        </Button>
                      </Form>
                    </Popover>
                  />
                </div>
              </Form>
            </BlockStack>
          </Card>
        </InlineGrid>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Visual Settings
              </Text>
              <Text as="p" variant="bodyMd">
                The Visual Settings allow you to enhance the appearance and
                behavior of your floating bar with animations and precise
                positioning. These settings help create a dynamic and visually
                appealing experience for your visitors.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Form method="POST">
                <Tooltip content="Allow users to close the floating bar manually.">
                  <InlineStack gap="200" align="start" blockAlign="baseline">
                    <Checkbox
                      label={
                        <InlineStack gap="8" align="center" blockAlign="center">
                          <Icon source={XCircleIcon} />
                          &nbsp;&nbsp;
                          <Text variant="headingMd" as="h6">
                            Can be Closed
                          </Text>
                        </InlineStack>
                      }
                      checked={formState.canBeClosed}
                      onChange={handleCheckBox("canBeClosed")}
                    />
                    <input
                      type="hidden"
                      name="canBeClosed"
                      value={formState.canBeClosed}
                    />
                  </InlineStack>
                </Tooltip>

                <Tooltip content="Enable a countdown timer on the floating bar.">
                  <InlineStack gap="200" align="start" blockAlign="baseline">
                    <Checkbox
                      label={
                        <InlineStack gap="8" align="center" blockAlign="center">
                          <Icon source={ClockIcon} />
                          &nbsp;&nbsp;
                          <Text variant="headingMd" as="h6">
                            Countdown
                          </Text>
                        </InlineStack>
                      }
                      checked={formState.countdown}
                      value={formState.countdown}
                      name="countdown"
                      onChange={handleCheckBox("countdown")}
                    />
                    <input
                      type="hidden"
                      name="countdown"
                      value={formState.countdown}
                    />
                  </InlineStack>
                  {formState.countdown && (
                    <InlineStack gap="200">
                      <TextField
                        type="number"
                        labelHidden
                        placeholder="Days"
                        value={formState?.daysValue}
                        name="daysValue"
                        onChange={(value) => {
                          if (value > 0 && value <= 999) {
                            setFormState({
                              ...formState,
                              daysValue: value,
                            });
                          }
                        }}
                        autoComplete="off"
                      />
                      <TextField
                        type="number"
                        labelHidden
                        placeholder="Hours"
                        value={formState?.hoursValue}
                        name="hoursValue"
                        onChange={(value) => {
                          if (value > 0 && value <= 24) {
                            setFormState({
                              ...formState,
                              hoursValue: value,
                            });
                          }
                        }}
                        autoComplete="off"
                      />
                      <TextField
                        type="number"
                        labelHidden
                        placeholder="Minutes"
                        value={formState?.minutesValue}
                        name="minutesValue"
                        onChange={(value) => {
                          if (value > 0 && value <= 60) {
                            setFormState({
                              ...formState,
                              minutesValue: value,
                            });
                          }
                        }}
                        autoComplete="off"
                      />
                      <TextField
                        type="number"
                        labelHidden
                        placeholder="Seconds"
                        value={formState?.secondsValue}
                        name="secondsValue"
                        onChange={(value) => {
                          if (value > 0 && value <= 60) {
                            setFormState({
                              ...formState,
                              secondsValue: value,
                            });
                          }
                        }}
                        autoComplete="off"
                      />
                    </InlineStack>
                  )}
                </Tooltip>

                <Tooltip content="Display a coupon code on the floating bar.">
                  <InlineStack gap="200" align="start" blockAlign="baseline">
                    <Checkbox
                      label={
                        <InlineStack gap="8" align="center" blockAlign="center">
                          <Icon source={DiscountIcon} />
                          &nbsp;&nbsp;
                          <Text variant="headingMd" as="h6">
                            Show Coupon
                          </Text>
                        </InlineStack>
                      }
                      disabled={formState.collectLeads}
                      checked={formState.showCoupon}
                      onChange={handleCheckBox("showCoupon")}
                    />
                    <input
                      type="hidden"
                      name="showCoupon"
                      value={formState.showCoupon}
                    />
                  </InlineStack>
                  {formState.showCoupon && (
                    <InlineStack gap="200">
                      <TextField
                        labelHidden
                        placeholder="Enter coupon code"
                        value={formState?.couponValue ?? ""}
                        name="couponValue"
                        maxLength={30}
                        showCharacterCount
                        onChange={(value) =>
                          setFormState({ ...formState, couponValue: value })
                        }
                        autoComplete="off"
                      />
                    </InlineStack>
                  )}
                </Tooltip>

                <Tooltip content="Show a button on the floating bar for additional actions.">
                  <InlineStack gap="200" align="start" blockAlign="baseline">
                    <Checkbox
                      label={
                        <InlineStack gap="8" align="center" blockAlign="center">
                          <Icon source={ButtonIcon} />
                          &nbsp;&nbsp;
                          <Text variant="headingMd" as="h6">
                            Show Button
                          </Text>
                        </InlineStack>
                      }
                      disabled={formState.collectLeads}
                      checked={formState.showButton}
                      onChange={handleCheckBox("showButton")}
                    />
                    <input
                      type="hidden"
                      name="showButton"
                      value={formState.showButton}
                    />
                  </InlineStack>
                  {formState.showButton && (
                    <InlineStack gap="200">
                      <TextField
                        value={formState?.textButtonFieldValue ?? ""}
                        name="textButtonFieldValue"
                        onChange={(value) =>
                          setFormState({
                            ...formState,
                            textButtonFieldValue: value,
                          })
                        }
                        maxLength={20}
                        autoComplete="on"
                        placeholder="Button Text"
                        showCharacterCount
                      />
                      <TextField
                        type="url"
                        value={formState?.urlButtonFieldValue ?? ""}
                        name="urlButtonFieldValue"
                        onChange={(value) =>
                          setFormState({
                            ...formState,
                            urlButtonFieldValue: value,
                          })
                        }
                        maxLength={256}
                        autoComplete="on"
                        placeholder="Button Link"
                        showCharacterCount
                      />
                    </InlineStack>
                  )}
                </Tooltip>

                <Tooltip content="Collect leads through a form integrated into the floating bar.">
                  <InlineStack gap="200" align="start" blockAlign="baseline">
                    <Checkbox
                      label={
                        <InlineStack gap="8" align="center" blockAlign="center">
                          <Icon source={ButtonPressIcon} />
                          &nbsp;&nbsp;
                          <Text variant="headingMd" as="h6">
                            Collect Leads
                          </Text>
                        </InlineStack>
                      }
                      disabled={formState.showButton || formState.showCoupon}
                      checked={formState.collectLeads}
                      onChange={handleCheckBox("collectLeads")}
                    />
                    <input
                      type="hidden"
                      name="collectLeads"
                      value={formState.collectLeads}
                    />
                  </InlineStack>
                  {formState.collectLeads && (
                    <Select
                      options={[
                        "Collect All",
                        "Collect Emails Only",
                        "Collect Names Only",
                        "Collect Phone Numbers Only",
                        "Collect Names and Phone Numbers",
                        "Collect Emails and Phone Numbers",
                        "Collect Emails and Names",
                      ]}
                      onChange={(value) =>
                        setFormState({ ...formState, leadChosen: value })
                      }
                      value={formState.leadChosen}
                      name="leadChosen"
                    />
                  )}
                </Tooltip>
                <Tooltip content="Select the position of the floating bar on the screen.">
                  <span style={{ fontWeight: "bold" }}>Position</span>
                </Tooltip>
                <Select
                  options={[
                    "Top",
                    "Center",
                    "Bottom",
                    "Right",
                    "Left",
                    "Top-Left",
                    "Top-Right",
                    "Bottom-Left",
                    "Bottom-Right",
                  ]}
                  onChange={(value) =>
                    setFormState({ ...formState, positionChosen: value })
                  }
                  value={formState.positionChosen}
                  name="positionChosen"
                />

                <Tooltip content="Choose the style of the floating bar.">
                  <span style={{ fontWeight: "bold" }}>Style</span>
                </Tooltip>
                <Select
                  options={[
                    "Full Width Bar",
                    "Sticky Bar",
                    "Slide-in Notification",
                    "Modal Popup",
                    "Bubble",
                    "Side Panel",
                    "Toast Notification",
                    "Overlay Bar",
                    "Accordion Bar",
                  ]}
                  onChange={(value) =>
                    setFormState({ ...formState, styleChosen: value })
                  }
                  value={formState.styleChosen}
                  name="styleChosen"
                />
                <div style={{ textAlign: "right" }}>
                  <PageActions
                    primaryAction={{
                      content: "Save",
                      submit: true,
                      name: "saveVisualButton",
                      icon: <Icon source={CheckIcon} />,
                    }}
                    secondaryActions=<Popover
                      active={popoverVisualActive}
                      activator={activator(1)}
                      onClose={togglePopoverVisual}
                      ariaHaspopup={false}
                      sectioned
                    >
                      <Form method="POST">
                        <div style={{ fontWeight: "bold" }}>
                          <p>
                            Type{" "}
                            <span style={{ fontWeight: "bold" }}>RESET</span> to
                            return{" "}
                            <span style={{ fontWeight: "bold" }}>
                              Visual Settings
                            </span>{" "}
                            to default:
                          </p>
                        </div>
                        <br />
                        <TextField
                          value={confirmText}
                          name="confirmVisualText"
                          onChange={handleConfirmTextChange}
                          autoComplete="off"
                        />
                        <br />
                        <Button
                          submit="true"
                          name="resetVisualButton"
                          size="slim"
                        >
                          Confirm
                        </Button>
                      </Form>
                    </Popover>
                  />
                </div>
              </Form>
            </BlockStack>
          </Card>
        </InlineGrid>
        {breakerSwitch ? <Divider /> : null}
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Color Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Choose the primary and secondary colors for the floating bar to
                match your website's color scheme.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Form method="POST">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
                    <Text as="h2" variant="headingSm">
                      Background Color
                    </Text>
                    <ColorPicker
                      fullWidth
                      onChange={(value) =>
                        setFormState({ ...formState, bgColor: value })
                      }
                      color={formState.bgColor}
                      allowAlpha
                    />
                    <input
                      type="hidden"
                      name="bgColor"
                      value={JSON.stringify(formState.bgColor)}
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
                    <Text as="h2" variant="headingSm">
                      Primary Color
                    </Text>
                    <ColorPicker
                      fullWidth
                      onChange={(value) =>
                        setFormState({ ...formState, pColor: value })
                      }
                      color={formState.pColor}
                      allowAlpha
                    />
                    <input
                      type="hidden"
                      name="pColor"
                      value={JSON.stringify(formState.pColor)}
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
                    <Text as="h2" variant="headingSm">
                      Secondary Color
                    </Text>
                    <ColorPicker
                      fullWidth
                      onChange={(value) =>
                        setFormState({ ...formState, sColor: value })
                      }
                      color={formState.sColor}
                      allowAlpha
                    />
                    <input
                      type="hidden"
                      name="sColor"
                      value={JSON.stringify(formState.sColor)}
                    />
                  </Grid.Cell>
                </Grid>
                <div style={{ textAlign: "right" }}>
                  <PageActions
                    primaryAction={{
                      content: "Save",
                      submit: true,
                      name: "saveColorButton",
                      icon: <Icon source={CheckIcon} />,
                    }}
                    secondaryActions=<Popover
                      active={popoverColorActive}
                      activator={activator(2)}
                      onClose={togglePopoverColor}
                      ariaHaspopup={false}
                      sectioned
                    >
                      <Form method="POST">
                        <div style={{ fontWeight: "bold" }}>
                          <p>
                            Type{" "}
                            <span style={{ fontWeight: "bold" }}>RESET</span> to
                            return{" "}
                            <span style={{ fontWeight: "bold" }}>
                              Color Settings
                            </span>{" "}
                            to default:
                          </p>
                        </div>
                        <br />
                        <TextField
                          value={confirmText}
                          name="confirmColorText"
                          onChange={handleConfirmTextChange}
                          autoComplete="off"
                        />
                        <br />
                        <Button
                          submit="true"
                          name="resetColorButton"
                          size="slim"
                        >
                          Confirm
                        </Button>
                      </Form>
                    </Popover>
                  />
                </div>
              </Form>
            </BlockStack>
          </Card>
        </InlineGrid>
        {breakerSwitch ? <Divider /> : null}
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Dimensions
              </Text>
              <Text as="p" variant="bodyMd">
                Adjust the width and height of the floating bar to fit
                seamlessly within your website's layout.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Form method="POST">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Text as="h2" variant="headingSm">
                      Width (px)
                    </Text>
                    <ChoiceList
                      choices={[
                        { label: "Default", value: false },
                        { label: "Custom", value: true },
                      ]}
                      name="widthChoice"
                      selected={[formState.widthChoice]}
                      onChange={(value) =>
                        setFormState({
                          ...formState,
                          widthChoice: value[0],
                        })
                      }
                    />
                    <TextField
                      label={
                        <span style={{ fontWeight: "bold" }}>
                          Width in pixels
                        </span>
                      }
                      type="number"
                      labelHidden
                      placeholder="Width in pixels"
                      value={formState.widthPixelValue}
                      name="widthPixelValue"
                      disabled={formState.widthChoice === false}
                      onChange={(value) => {
                        if (value > 0 && value <= 9999) {
                          setFormState({
                            ...formState,
                            widthPixelValue: value,
                          });
                        }
                      }}
                      autoComplete="off"
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Text as="h2" variant="headingSm">
                      Height (px)
                    </Text>
                    <ChoiceList
                      choices={[
                        { label: "Default", value: false },
                        { label: "Custom", value: true },
                      ]}
                      name="heightChoice"
                      selected={[formState.heightChoice]}
                      onChange={(value) =>
                        setFormState({
                          ...formState,
                          heightChoice: value[0],
                        })
                      }
                    />
                    <TextField
                      label={
                        <span style={{ fontWeight: "bold" }}>
                          Height in pixels
                        </span>
                      }
                      type="number"
                      labelHidden
                      placeholder="Height in pixels"
                      value={formState.heightPixelValue}
                      name="heightPixelValue"
                      disabled={formState.heightChoice === false}
                      onChange={(value) => {
                        if (value > 0 && value <= 9999) {
                          setFormState({
                            ...formState,
                            heightPixelValue: value,
                          });
                        }
                      }}
                      autoComplete="off"
                    />
                  </Grid.Cell>
                </Grid>
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Text as="h2" variant="headingSm">
                      Padding (px)
                    </Text>
                    <ChoiceList
                      choices={[
                        { label: "Default", value: false },
                        { label: "Custom", value: true },
                      ]}
                      name="paddingChoice"
                      selected={[formState.paddingChoice]}
                      onChange={(value) =>
                        setFormState({
                          ...formState,
                          paddingChoice: value[0],
                        })
                      }
                    />
                    <Grid>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Padding in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          placeholder="Top"
                          value={formState?.topPaddingValue}
                          name="topPaddingValue"
                          disabled={formState.paddingChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                topPaddingValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Padding in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          placeholder="Bottom"
                          value={formState?.bottomPaddingValue}
                          name="bottomPaddingValue"
                          disabled={formState.paddingChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                bottomPaddingValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                    </Grid>
                    <br />
                    <Grid>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Padding in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          maxLength={4}
                          placeholder="Left"
                          value={formState?.leftPaddingValue}
                          name="leftPaddingValue"
                          disabled={formState.paddingChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                leftPaddingValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Padding in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          maxLength={4}
                          placeholder="Right"
                          value={formState?.rightPaddingValue}
                          name="rightPaddingValue"
                          disabled={formState.paddingChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                rightPaddingValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                    </Grid>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Text as="h2" variant="headingSm">
                      Margin (px)
                    </Text>
                    <ChoiceList
                      choices={[
                        { label: "Default", value: false },
                        { label: "Custom", value: true },
                      ]}
                      name="marginChoice"
                      selected={[formState.marginChoice]}
                      onChange={(value) =>
                        setFormState({
                          ...formState,
                          marginChoice: value[0],
                        })
                      }
                    />
                    <Grid>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Margin in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          placeholder="Top"
                          value={formState?.topMarginValue}
                          name="topMarginValue"
                          disabled={formState.marginChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                topMarginValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Margin in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          placeholder="Bottom"
                          value={formState?.bottomMarginValue}
                          name="bottomMarginValue"
                          disabled={formState.marginChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                bottomMarginValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                    </Grid>
                    <br />
                    <Grid>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Margin in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          placeholder="Left"
                          value={formState?.leftMarginValue}
                          name="leftMarginValue"
                          disabled={formState.marginChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                leftMarginValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                      <Grid.Cell
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                      >
                        <TextField
                          label={
                            <span style={{ fontWeight: "bold" }}>
                              Margin in pixels
                            </span>
                          }
                          type="number"
                          labelHidden
                          placeholder="Right"
                          value={formState?.rightMarginValue}
                          name="rightMarginValue"
                          disabled={formState.marginChoice === false}
                          onChange={(value) => {
                            if (value <= 9999) {
                              setFormState({
                                ...formState,
                                rightMarginValue: value,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                    </Grid>
                  </Grid.Cell>
                </Grid>
                <div style={{ textAlign: "right" }}>
                  <PageActions
                    primaryAction={{
                      content: "Save",
                      submit: true,
                      name: "saveDimensionButton",
                      icon: <Icon source={CheckIcon} />,
                    }}
                    secondaryActions=<Popover
                      active={popoverDimensionActive}
                      activator={activator(3)}
                      onClose={togglePopoverDimension}
                      ariaHaspopup={false}
                      sectioned
                    >
                      <Form method="POST">
                        <div style={{ fontWeight: "bold" }}>
                          <p>
                            Type{" "}
                            <span style={{ fontWeight: "bold" }}>RESET</span> to
                            return{" "}
                            <span style={{ fontWeight: "bold" }}>
                              Dimensions
                            </span>{" "}
                            to default:
                          </p>
                        </div>
                        <br />
                        <TextField
                          value={confirmText}
                          name="confirmDimensionText"
                          onChange={handleConfirmTextChange}
                          autoComplete="off"
                        />
                        <br />
                        <Button
                          submit="true"
                          name="resetDimensionButton"
                          size="slim"
                        >
                          Confirm
                        </Button>
                      </Form>
                    </Popover>
                  />
                </div>
              </Form>
            </BlockStack>
          </Card>
        </InlineGrid>
        {breakerSwitch ? <Divider /> : null}
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Behavioral
              </Text>
              <Text as="p" variant="bodyMd">
                Control how your floating bar interacts with visitors and adapts
                to their behavior with these advanced settings.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Form method="POST">
                <Tooltip content="Set an expiry date for your floating bar to automatically disable it after a specific date and time. This is perfect for time-sensitive promotions or announcements, ensuring the floating bar is only displayed while the offer or message is relevant.">
                  <InlineStack gap="200" align="start" blockAlign="baseline">
                    <Checkbox
                      label={
                        <InlineStack gap="8" align="center" blockAlign="center">
                          <Icon source={CalendarIcon} />
                          &nbsp;&nbsp;
                          <Text variant="headingMd" as="h6">
                            Expiry Date
                          </Text>
                        </InlineStack>
                      }
                      checked={formState.expiryDate}
                      onChange={handleCheckBox("expiryDate")}
                    />
                    <input
                      type="hidden"
                      name="expiryDate"
                      value={formState.expiryDate}
                    />
                  </InlineStack>
                  {formState.expiryDate && (
                    <Popover
                      active={visible}
                      autofocusTarget="none"
                      preferredAlignment="left"
                      fullWidth
                      preferInputActivator={false}
                      preferredPosition="below"
                      preventCloseOnChildOverlayClick
                      onClose={handleOnClose}
                      activator={
                        <TextField
                          role="combobox"
                          prefix={<Icon source={CalendarIcon} />}
                          value={formState?.expiryDateValue}
                          name="expiryDateValue"
                          onFocus={() => setVisible(true)}
                          autoComplete="off"
                        />
                      }
                    >
                      <Card ref={datePickerRef}>
                        <DatePicker
                          month={month}
                          year={year}
                          selected={selectedDate}
                          onMonthChange={handleMonthChange}
                          onChange={handleDateSelection}
                        />
                      </Card>
                    </Popover>
                  )}
                </Tooltip>
                <Tooltip content="Select which devices will display the floating bar.">
                  <span style={{ fontWeight: "bold" }}>Devices</span>
                </Tooltip>
                <Select
                  options={["Both", "Desktop", "Mobile"]}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      deviceChosen: value,
                    })
                  }
                  value={formState.deviceChosen}
                  name="deviceChosen"
                />
                <Tooltip content="Select the animation effect for the button.">
                  <span style={{ fontWeight: "bold" }}>Button Effect</span>
                </Tooltip>
                <Select
                  options={[
                    "None",
                    "Slide",
                    "Shake",
                    "Swing",
                    "Heartbeat",
                    "Wobble",
                  ]}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      btnEffectChosen: value,
                    })
                  }
                  value={formState.btnEffectChosen}
                  name="btnEffectChosen"
                />
                <Tooltip content="Select what happens to the floating bar after a button is clicked.">
                  <span style={{ fontWeight: "bold" }}>After Button Click</span>
                </Tooltip>
                <Select
                  options={[
                    "Nothing",
                    "Hide the bar",
                    "Change its content",
                    "Display a confirmation",
                  ]}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      afterBtnClickChosen: value,
                    })
                  }
                  value={formState.afterBtnClickChosen}
                  name="afterBtnClickChosen"
                />

                <Tooltip content="Define the conditions under which the floating bar should appear. You can set triggers based on user actions such as page scroll, time spent on the page. This helps in targeting the right moment to engage your visitors.">
                  <span style={{ fontWeight: "bold" }}>Trigger</span>
                </Tooltip>
                <Select
                  options={["None", "Time", "Scroll"]}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      triggerChosen: value,
                    })
                  }
                  value={formState.triggerChosen}
                  name="triggerChosen"
                />
                <div style={{ textAlign: "right" }}>
                  <PageActions
                    primaryAction={{
                      content: "Save",
                      submit: true,
                      name: "saveBehavioralButton",
                      icon: <Icon source={CheckIcon} />,
                    }}
                    secondaryActions=<Popover
                      active={popoverBehaveActive}
                      activator={activator(4)}
                      onClose={togglePopoverBehave}
                      ariaHaspopup={false}
                      sectioned
                    >
                      <Form method="POST">
                        <div style={{ fontWeight: "bold" }}>
                          <p>
                            Type{" "}
                            <span style={{ fontWeight: "bold" }}>RESET</span> to
                            return{" "}
                            <span style={{ fontWeight: "bold" }}>
                              Behavioral
                            </span>{" "}
                            to default:
                          </p>
                        </div>
                        <br />
                        <TextField
                          value={confirmText}
                          name="confirmBehavioralText"
                          onChange={handleConfirmTextChange}
                          autoComplete="off"
                        />
                        <br />
                        <Button
                          submit="true"
                          name="resetBehavioralButton"
                          size="slim"
                        >
                          Confirm
                        </Button>
                      </Form>
                    </Popover>
                  />
                </div>
              </Form>
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
