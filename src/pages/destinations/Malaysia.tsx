import DestinationSteps from "../../components/DestinationSteps";
import { MALAYSIA_UNIVERSITIES } from "../../data/universities";
import { useLang } from "../../i18n";

export default function Malaysia() {
  const { t } = useLang();
  return (
    <DestinationSteps
      country={t.malaysia.country}
      code="KUL"
      intro={t.malaysia.intro}
      steps={t.malaysia.steps}
      partnerUniversities={MALAYSIA_UNIVERSITIES}
    />
  );
}
