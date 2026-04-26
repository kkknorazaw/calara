import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IconGlyph } from "@/components/ui/IconGlyph";
import type { Incident } from "@/types";

interface IncidentTableProps {
  title?: string;
  countLabel?: string;
  incidents: Incident[];
  searchable?: boolean;
  filterable?: boolean;
  severityHeading?: string;
  footerContent?: ReactNode;
}

type FilterValue = "all" | "attack" | "mev";

export function IncidentTable({
  title,
  countLabel,
  incidents,
  searchable = false,
  filterable = false,
  severityHeading = "严重性",
  footerContent
}: IncidentTableProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    return incidents.filter((incident) => {
      const passesFilter =
        filter === "all" ||
        (filter === "attack" && incident.classification === "ATTACK") ||
        (filter === "mev" && incident.classification === "NON_ATTACK_MEV");

      if (!passesFilter) {
        return false;
      }

      const haystack = [
        incident.title,
        incident.protocol,
        incident.chainLabel,
        incident.attackTypeLabel
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query.trim().toLowerCase());
    });
  }, [filter, incidents, query]);

  return (
    <section className="event-panel">
      {title ? (
        <div className="panel-head">
          <div className="panel-title">
            {title} {countLabel ? <span className="count-pill">{countLabel}</span> : null}
          </div>
          {filterable ? (
            <div className="segmented">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
                全部
              </button>
              <button
                className={filter === "attack" ? "active" : ""}
                onClick={() => setFilter("attack")}
              >
                攻击
              </button>
              <button className={filter === "mev" ? "active" : ""} onClick={() => setFilter("mev")}>
                MEV
              </button>
            </div>
          ) : (
            <div />
          )}
          {searchable ? (
            <input
              className="searchbox"
              type="search"
              placeholder="搜索协议、类型..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : null}
        </div>
      ) : null}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{severityHeading}</th>
              <th>协议 / 链</th>
              <th>发生时间 (UTC)</th>
              <th>损失金额 (USD)</th>
              <th>攻击类型</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((incident) => (
              <tr key={incident.id}>
                <td>
                  <span
                    className="severity-dot"
                    style={{ background: `var(--${incident.severityColor})` }}
                  />
                </td>
                <td>
                  <strong>{incident.title}</strong>
                </td>
                <td>{incident.incidentTimeLabel}</td>
                <td className="loss-red">{incident.usdLossLabel}</td>
                <td>
                  <span className={`type-pill type-${incident.severityColor}`}>
                    {incident.attackTypeLabel}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      incident.reportStatus === "verified" ? "status-ok" : "status-warn"
                    }`}
                  >
                    {incident.reportStatusLabel}
                  </span>
                </td>
                <td>
                  <Link className="row-link" to={incident.href}>
                    {incident.accessible ? "查看报告" : "Pro 解锁"} <IconGlyph className="inline-chevron" name="angle-right" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footerContent ? <div className="pager-row">{footerContent}</div> : null}
    </section>
  );
}
