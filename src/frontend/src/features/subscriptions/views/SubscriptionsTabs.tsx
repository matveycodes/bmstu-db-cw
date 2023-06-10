import { FC, ReactNode } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabsProps,
} from "@chakra-ui/react";

interface Props extends Omit<TabsProps, "children"> {
  subscriptionsTab?: ReactNode;
  activeSubscriptionsTab?: ReactNode;
  finishedSubscriptionsTab?: ReactNode;
}

const SubscriptionsTabs: FC<Props> = ({
  subscriptionsTab,
  activeSubscriptionsTab,
  finishedSubscriptionsTab,
}) => {
  return (
    <Tabs isLazy>
      <TabList>
        <Tab>Доступные</Tab>
        <Tab>Активные</Tab>
        <Tab>Завершённые</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>{subscriptionsTab}</TabPanel>
        <TabPanel>{activeSubscriptionsTab}</TabPanel>
        <TabPanel>{finishedSubscriptionsTab}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { SubscriptionsTabs };
