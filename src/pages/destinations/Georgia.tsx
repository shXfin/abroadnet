import DestinationSteps from "../../components/DestinationSteps";
import { GEORGIA_UNIVERSITIES } from "../../data/universities";
import { useLang } from "../../i18n";

export default function Georgia() {
  const { t } = useLang();
  return (
    <DestinationSteps
      country={t.georgia.country}
      code="TBS"
      intro={t.georgia.intro}
      steps={t.georgia.steps}
      partnerUniversities={GEORGIA_UNIVERSITIES}
    />
  );
}
