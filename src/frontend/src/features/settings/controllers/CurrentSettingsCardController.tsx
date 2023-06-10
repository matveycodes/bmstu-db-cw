import { useSettings } from "../hooks/useSettings";

import { SettingsCard } from "../views/SettingsCard";

const CurrentSettingsCardController = () => {
  const { data: settings = [] } = useSettings();

  return <SettingsCard settings={settings} />;
};

export { CurrentSettingsCardController };
