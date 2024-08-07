import { HistoryI } from "./types";
import { AuditTruncatedI } from "./types/prisma";

export const checkLocalMostRecent = (
  history: HistoryI[],
  auditId: string,
  user: string | undefined,
): boolean => {
  /* 
    localstorage of structure:
    { address: { auditid: id }}
  */

  if (typeof window == undefined) return false;
  if (history.length == 0) return false;
  // We already don't display for non-members of an audit, but include this for type safety.
  if (!user) return false;
  const localHistory = localStorage.getItem("history_noti");
  const mostRecent = history[history.length - 1].id;
  if (localHistory) {
    const parsed = JSON.parse(localHistory);
    if (user in parsed) {
      if (auditId in parsed[user]) {
        if (parsed[user][auditId] == mostRecent) {
          return false;
        }
      }
    }
  }
  return true;
};

export const checkLocalMostRecentMany = (
  address: string,
  audits: AuditTruncatedI[],
): Record<string, boolean> | undefined => {
  if (typeof window == undefined) return;
  const localHistory = localStorage.getItem("history_noti") || "null";
  const parsed = JSON.parse(localHistory);
  const shouldSkip = !parsed || !(address in parsed); // no object exists for this user.
  const out: Record<string, boolean> = {};
  audits.forEach((audit) => {
    const isHistory = audit.history.length > 0;
    if (!isHistory) {
      out[audit.id] = false;
    } else {
      if (shouldSkip) {
        out[audit.id] = true;
      } else {
        if (audit.id in parsed[address]) {
          out[audit.id] = parsed[address][audit.id] != audit.history[0].id;
        } else {
          out[audit.id] = true;
        }
      }
    }
  });
  return out;
};

export const setLocalMostRecent = (
  history: HistoryI[],
  auditId: string,
  user: string | undefined,
): void => {
  if (typeof window == undefined) return;
  if (history.length == 0) return;
  if (!user) return;
  const localHistory = localStorage.getItem("history_noti");
  const mostRecent = history[history.length - 1].id;
  if (!localHistory) {
    const toCreate = { [user]: { [auditId]: mostRecent } };
    localStorage.setItem("history_noti", JSON.stringify(toCreate));
  } else {
    const parsed = JSON.parse(localHistory);
    if (!(user in parsed)) {
      parsed[user] = {};
    }
    parsed[user][auditId] = mostRecent;
    localStorage.setItem("history_noti", JSON.stringify(parsed));
  }
};
