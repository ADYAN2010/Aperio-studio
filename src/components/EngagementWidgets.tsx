import { useLocation } from "react-router-dom";
import LiveChatWidget from "./LiveChatWidget";
import WhatsAppButton from "./WhatsAppButton";
import WelcomeBubble from "./WelcomeBubble";
import ExitIntentPopup from "./ExitIntentPopup";

const EngagementWidgets = () => {
  const location = useLocation();

  const isAdminOrDashboard =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard");

  if (isAdminOrDashboard) return null;

  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-chat"));
  };

  return (
    <>
      <LiveChatWidget />
      <WhatsAppButton />
      <WelcomeBubble onOpenChat={openChat} />
      <ExitIntentPopup />
    </>
  );
};

export default EngagementWidgets;
