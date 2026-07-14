import { buildInfo } from "../config/build";
import { useI18n } from "../i18n/context";
import { TEMPLATE_LAST_UPDATED } from "../templateMetadata";

export function BuildInfo() {
  const { t } = useI18n();
  const shortCommit =
    buildInfo.commit === "unknown" ? buildInfo.commit : buildInfo.commit.slice(0, 7);

  return (
    <dl className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-base-content/60">
      <div>
        <dt className="inline">{t("last-updated-label")}: </dt>
        <dd className="inline" dir="ltr">
          <time dateTime={TEMPLATE_LAST_UPDATED}>{TEMPLATE_LAST_UPDATED}</time>
        </dd>
      </div>
      <div>
        <dt className="inline">{t("build-version-label")}: </dt>
        <dd className="inline">{buildInfo.version}</dd>
      </div>
      <div>
        <dt className="inline">{t("build-commit-label")}: </dt>
        <dd className="inline font-mono" dir="ltr">
          {shortCommit}
        </dd>
      </div>
      <div>
        <dt className="inline">{t("build-environment-label")}: </dt>
        <dd className="inline">{buildInfo.environment}</dd>
      </div>
    </dl>
  );
}
