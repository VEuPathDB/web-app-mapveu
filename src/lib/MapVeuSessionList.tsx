import React, { useCallback } from 'react';
import {
  SessionStore,
  useSessionList,
  useStudy,
} from '@veupathdb/eda-workspace-core';
import { useRouteMatch, Link, useHistory } from 'react-router-dom';
import { safeHtml } from '@veupathdb/wdk-client/lib/Utils/ComponentUtils';

interface Props {
  studyId: string;
  sessionStore: SessionStore;
}

export function SessionList(props: Props) {
  const { sessionStore, studyId } = props;
  const { studyRecord } = useStudy();
  const list = useSessionList();
  const { url } = useRouteMatch();
  const history = useHistory();
  const createSession = useCallback(async () => {
    const id = await sessionStore.createSession({
      name: 'Unnamed session',
      studyId,
      visualizations: [],
      variableUISettings: {},
      derivedVariables: [],
      starredVariables: [],
      filters: [],
    });
    history.push(`${url}/${id}`);
  }, [sessionStore, history, studyId, url]);
  return (
    <>
      <h2>Study: {studyRecord.displayName}</h2>
      <h3>Saved Sessions</h3>
      <div>
        <button className="btn" type="button" onClick={createSession}>
          New Session
        </button>
      </div>
      {list.length === 0 ? (
        <em>You do not have any sessions for this study.</em>
      ) : (
        <ul>
          {list.map((session) => (
            <li>
              <Link to={`${url}/${session.id}`}>{safeHtml(session.name)}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
