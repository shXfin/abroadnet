import DestinationSteps from "../../components/DestinationSteps";
import { ROMANIA_UNIVERSITIES } from "../../data/universities";
import { useLang } from "../../i18n";

export default function Romania() {
  const { t } = useLang();
  return (
    <DestinationSteps
      country={t.romania.country}
      code="OTP"
      intro={t.romania.intro}
      facts={t.romania.facts}
      steps={t.romania.steps}
      partnerUniversities={ROMANIA_UNIVERSITIES}
    />
  );
}
