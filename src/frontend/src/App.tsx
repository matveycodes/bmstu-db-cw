import { Box } from "@chakra-ui/react";

import { CurrentUserControlPanelController } from "features/control-panel";
import { CurrentUserMapController } from "features/map";

const App = () => {
  return (
    <Box width="100vw" height="100vh" display="flex">
      <CurrentUserControlPanelController
        position="absolute"
        zIndex={900}
        maxH="100vh"
      />

      <CurrentUserMapController />
    </Box>
  );
};

export { App };
