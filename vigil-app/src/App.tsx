import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { PricingPage } from "@/pages/PricingPage";
import { ResearchPage } from "@/pages/ResearchPage";
import { UnlockPage } from "@/pages/UnlockPage";
import { SubscribePage } from "@/pages/SubscribePage";
import { LicensePage } from "@/pages/LicensePage";
import { IncidentReportPage } from "@/pages/IncidentReportPage";
import { SignInPage } from "@/pages/SignInPage";
import { ApiPlaceholderPage } from "@/pages/ApiPlaceholderPage";

export default function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/unlock" element={<UnlockPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/license" element={<LicensePage />} />
        <Route path="/report.html" element={<IncidentReportPage />} />
        <Route path="/incidents/:incidentId" element={<IncidentReportPage />} />
        <Route path="/api/auth/signin/twitter" element={<SignInPage />} />
        <Route
          path="/api/stripe/checkout"
          element={
            <ApiPlaceholderPage
              title="Checkout Unavailable In Static Build"
              heading="Checkout Unavailable In Static Build"
              description="Stripe checkout requires backend runtime and is disabled in this static deployment."
            />
          }
        />
        <Route
          path="/api/stripe/portal"
          element={
            <ApiPlaceholderPage
              title="Portal Unavailable In Static Build"
              heading="Portal Unavailable In Static Build"
              description="Stripe customer portal requires backend runtime and is disabled in this static deployment."
            />
          }
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}
